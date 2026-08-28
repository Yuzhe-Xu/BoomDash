import type { GameEvent, RecordedInput } from "../app/GameEvents";
import { isSimulating } from "../app/GamePhase";
import { clampToCanvas, type LevelDefinition } from "../level/LevelDefinition";
import { enteredGoal, evaluateLifecycle } from "./LifecycleBounds";
import { createInitialState, resetShip, type RunState } from "./GameState";
import {
  ageEffects,
  detonateBomb,
  integrateShip,
  launchShip,
  rearmBombs,
} from "./ShipSimulator";

export class GameSimulation {
  readonly level: LevelDefinition;
  state: RunState;
  recorded: RecordedInput[] = [];
  private queue: GameEvent[] = [];

  constructor(level: LevelDefinition, state = createInitialState(level)) {
    this.level = level;
    this.state = state;
  }

  enqueue(event: GameEvent): void {
    this.queue.push(event);
  }

  flushEvents(): void {
    const events = this.queue;
    this.queue = [];
    for (const event of events) {
      this.applyEvent(event);
    }
  }

  snapshot(): RunState {
    return structuredClone(this.state);
  }

  reset(keepBombs: boolean): void {
    const bombs = keepBombs ? rearmBombs(this.state.bombs) : [];
    const selectedId = keepBombs ? this.state.selectedId : null;
    this.state = {
      ...createInitialState(this.level),
      bombs,
      selectedId,
      nextBombId: keepBombs ? this.state.nextBombId : 1,
    };
    this.queue = [];
    this.recorded = [];
  }

  resetShipKeepBombs(): void {
    this.state.ship = resetShip(this.level);
    this.state.phase = "planning";
    this.state.resumePhase = "planning";
    this.state.elapsed = 0;
    this.state.tick = 0;
    this.state.failReason = null;
    this.state.effects = [];
    this.state.lastImpulse = { x: 0, y: 0 };
    this.state.usedBombs = 0;
    this.state.successGoalId = null;
  }

  rearmAll(): void {
    this.state.bombs = rearmBombs(this.state.bombs);
    this.state.effects = [];
    this.state.lastImpulse = { x: 0, y: 0 };
  }

  updateFixed(dt: number): void {
    this.flushEvents();

    if (!isSimulating(this.state.phase)) {
      return;
    }

    this.state.tick += 1;
    this.state.elapsed += dt;
    this.state.ship = integrateShip(this.state.ship, dt);
    this.state.effects = ageEffects(this.state.effects, dt);

    const result = evaluateLifecycle(
      this.state.ship,
      this.level.goals,
      this.state.elapsed,
      this.level.timeLimit,
      this.level.worldHeight,
      this.level.hazards,
    );

    if (result.kind === "success") {
      this.state.phase = "success";
      this.state.successGoalId = enteredGoal(
        this.state.ship,
        this.level.goals,
        this.level.worldHeight,
      )?.id ?? null;
      this.state.ship.velocity = { x: 0, y: 0 };
      return;
    }

    if (result.kind === "failed") {
      this.state.phase = "failed";
      this.state.failReason = result.reason;
    }
  }

  replay(events: RecordedInput[], ticks: number, dt: number): void {
    this.reset(false);
    let index = 0;
    for (let tick = 0; tick <= ticks; tick += 1) {
      while (index < events.length && events[index].tick === tick) {
        this.enqueue(events[index].event);
        index += 1;
      }
      this.updateFixed(dt);
    }
  }

  private applyEvent(event: GameEvent): void {
    const { phase } = this.state;
    if (
      event.type === "place" ||
      event.type === "move" ||
      event.type === "launch" ||
      event.type === "detonate"
    ) {
      this.record(event);
    }

    if (event.type === "pause" && (phase === "planning" || phase === "flying")) {
      this.state.resumePhase = phase;
      this.state.phase = "paused";
      return;
    }

    if (event.type === "resume" && phase === "paused") {
      this.state.phase = this.state.resumePhase;
      return;
    }

    if (event.type === "retry") {
      const wasPlanning =
        phase === "planning" || (phase === "paused" && this.state.resumePhase === "planning");
      this.reset(true);
      if (this.state.bombs.length > 0 && !wasPlanning) {
        this.enqueue({ type: "launch" });
      }
      return;
    }

    if (event.type === "redeploy") {
      this.reset(true);
      return;
    }

    if (phase === "paused" || phase === "success" || phase === "failed") {
      return;
    }

    switch (event.type) {
      case "place":
        this.placeBomb(event.x, event.y);
        break;
      case "select":
        if (phase === "planning" && this.state.bombs.some((bomb) => bomb.id === event.id)) {
          this.state.selectedId = event.id;
        }
        break;
      case "move":
        this.moveBomb(event.id, event.x, event.y);
        break;
      case "delete":
        this.deleteSelected();
        break;
      case "clear":
        if (phase === "planning") {
          this.state.bombs = [];
          this.state.selectedId = null;
        }
        break;
      case "launch":
        if (phase === "planning") {
          this.state.phase = "flying";
          this.state.elapsed = 0;
          this.state.tick = 0;
          this.state.failReason = null;
          this.state.usedBombs = 0;
          this.state.successGoalId = null;
          this.state.effects = [];
          this.state.ship = launchShip(this.state.ship, this.level.launchVelocity);
        }
        break;
      case "detonate":
        if (phase === "flying") {
          const result = detonateBomb(this.state, event.id, this.level);
          this.state.bombs = result.bombs;
          this.state.ship = result.ship;
          this.state.usedBombs = result.usedBombs;
          if (result.effect) {
            this.state.effects = [...this.state.effects, result.effect];
            this.state.lastImpulse = result.effect.impulse;
          }
        }
        break;
      default:
        break;
    }
  }

  private placeBomb(x: number, y: number): void {
    if (this.state.phase !== "planning") {
      return;
    }
    if (!this.level.unlimitedBombs && this.state.bombs.length >= this.level.maxBombs) {
      return;
    }
    const position = clampToCanvas(x, y, this.level.worldHeight);
    const id = `b${this.state.nextBombId}`;
    this.state.nextBombId += 1;
    this.state.bombs = [
      ...this.state.bombs,
      {
        id,
        position,
        state: "armed",
        order: this.state.bombs.length + 1,
      },
    ];
    this.state.selectedId = id;
  }

  private moveBomb(id: string, x: number, y: number): void {
    if (this.state.phase !== "planning") {
      return;
    }
    const position = clampToCanvas(x, y, this.level.worldHeight);
    this.state.bombs = this.state.bombs.map((bomb) =>
      bomb.id === id ? { ...bomb, position } : bomb,
    );
    this.state.selectedId = id;
  }

  private deleteSelected(): void {
    if (this.state.phase !== "planning" || !this.state.selectedId) {
      return;
    }
    this.state.bombs = this.state.bombs
      .filter((bomb) => bomb.id !== this.state.selectedId)
      .map((bomb, index) => ({ ...bomb, order: index + 1 }));
    this.state.selectedId = this.state.bombs.at(-1)?.id ?? null;
  }

  private record(event: GameEvent): void {
    this.recorded.push({ tick: this.state.tick, event });
  }
}
