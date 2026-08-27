import { AudioSystem } from "../audio/AudioSystem";
import { eventFromKey } from "../input/KeyboardInput";
import { pickBombAt, PointerInput } from "../input/PointerInput";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from "../level/LevelDefinition";
import { level1, withDebugOverrides } from "../level/level1";
import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { GameSimulation } from "../simulation/GameSimulation";
import { FIXED_DT } from "../simulation/ShipSimulator";
import { loadProgress, recordBestTime, saveMuted } from "../storage/ProgressStore";
import { DebugOverlay } from "../ui/DebugOverlay";
import { FlightControls } from "../ui/FlightControls";
import { Hud } from "../ui/Hud";
import { PlanningControls } from "../ui/PlanningControls";
import { ResultPanel } from "../ui/ResultPanel";

export class GameApp {
  private readonly debug = new URLSearchParams(window.location.search).get("debug") === "1";
  private readonly level = withDebugOverrides(level1, this.debug);
  private readonly sim = new GameSimulation(this.level);
  private readonly renderer: CanvasRenderer;
  private readonly pointer: PointerInput;
  private readonly audio = new AudioSystem();
  private readonly hud: Hud;
  private readonly planning: PlanningControls;
  private readonly flight: FlightControls;
  private readonly result: ResultPanel;
  private readonly debugView: DebugOverlay;
  private accumulator = 0;
  private previousTime = performance.now();
  private fps = 60;
  private frames = 0;
  private fpsStamp = performance.now();
  private bestTime: number | null;
  private lastPhase = this.sim.state.phase;
  private seenFx = new Set<string>();
  private readonly stage: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    const canvas = mustEl<HTMLCanvasElement>("#game");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D unavailable");
    }
    this.renderer = new CanvasRenderer(canvas, ctx);
    this.pointer = new PointerInput(canvas);
    this.hud = new Hud(
      mustEl("#hud-stat"),
      mustEl("#level-tag"),
      mustEl<HTMLButtonElement>("#btn-mute"),
      mustEl("#hud-ship"),
      mustEl("#hud-speed"),
      mustEl("#hud-min"),
    );
    this.planning = new PlanningControls(
      mustEl("#planning-bar"),
      mustEl<HTMLButtonElement>("#btn-clear"),
      mustEl<HTMLButtonElement>("#btn-delete"),
      mustEl<HTMLButtonElement>("#btn-launch"),
    );
    this.flight = new FlightControls(mustEl("#bomb-rail"));
    this.result = new ResultPanel(
      mustEl("#result"),
      mustEl("#result-kicker"),
      mustEl("#result-title"),
      mustEl("#result-copy"),
      mustEl("#result-stats"),
      mustEl("#pause-menu"),
    );
    this.debugView = new DebugOverlay(mustEl("#debug"));
    this.stage = mustEl("#stage");
    const progress = loadProgress(this.level.id);
    this.bestTime = progress.bestTime;
    this.audio.setMuted(progress.muted);
    this.bind(canvas);
    this.layoutStage();
    this.syncUi();
  }

  start(): void {
    this.previousTime = performance.now();
    requestAnimationFrame(this.frame);
  }

  private bind(canvas: HTMLCanvasElement): void {
    this.hud.bind(
      () => this.togglePause(),
      () => {
        this.audio.setMuted(!this.audio.muted);
        saveMuted(this.level.id, this.audio.muted);
        this.syncUi();
      },
    );
    this.planning.bind({
      clear: () => this.sim.enqueue({ type: "clear" }),
      remove: () => this.sim.enqueue({ type: "delete" }),
      launch: () => {
        this.audio.unlock();
        this.sim.enqueue({ type: "launch" });
      },
    });
    this.flight.bind((id) => {
      if (this.sim.state.phase === "planning") {
        this.sim.enqueue({ type: "select", id });
        return;
      }
      this.sim.enqueue({ type: "detonate", id });
    });
    this.result.bind({
      resume: () => this.sim.enqueue({ type: "resume" }),
      retry: () => this.retry(),
      redeploy: () => this.redeploy(),
    });

    canvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      this.audio.unlock();
      const point = this.pointer.clientToLogical(event.clientX, event.clientY);
      if (!point) {
        return;
      }
      const bombId = pickBombAt(point, this.sim.state.bombs, this.pointer.hitRadius());
      this.pointer.begin(event.pointerId, point, bombId);
      canvas.setPointerCapture(event.pointerId);
      if (this.sim.state.phase === "flying" && bombId) {
        this.sim.enqueue({ type: "detonate", id: bombId });
      }
      if (this.sim.state.phase === "planning" && bombId) {
        this.sim.enqueue({ type: "select", id: bombId });
      }
    });

    canvas.addEventListener("pointermove", (event) => {
      const point = this.pointer.clientToLogical(event.clientX, event.clientY);
      if (!point) {
        return;
      }
      const session = this.pointer.move(event.pointerId, point);
      if (session.kind === "drag" && session.bombId) {
        this.sim.enqueue({ type: "move", id: session.bombId, x: point.x, y: point.y });
      }
    });

    const endPointer = (event: PointerEvent) => {
      const session = this.pointer.end(event.pointerId);
      if (session.kind === "place" && !session.moved && this.sim.state.phase === "planning") {
        const canPlace =
          this.level.unlimitedBombs || this.sim.state.bombs.length < this.level.maxBombs;
        if (canPlace) {
          this.sim.enqueue({ type: "place", x: session.start.x, y: session.start.y });
          this.audio.place();
        }
      }
    };
    canvas.addEventListener("pointerup", endPointer);
    canvas.addEventListener("pointercancel", () => this.pointer.cancel());

    window.addEventListener("keydown", (event) => {
      if (event.repeat) {
        return;
      }
      if (this.debug && event.key === "F6") {
        this.sim.resetShipKeepBombs();
        this.renderer.resetVisuals();
        return;
      }
      if (this.debug && event.key === "F7") {
        this.sim.rearmAll();
        this.renderer.resetVisuals();
        return;
      }
      if (this.debug && event.key === "F8") {
        console.info("boomdash replay", this.sim.recorded);
        return;
      }
      if (event.key >= "1" && event.key <= "9") {
        const bomb = this.sim.state.bombs[Number(event.key) - 1];
        if (!bomb) {
          return;
        }
        if (this.sim.state.phase === "planning") {
          this.sim.enqueue({ type: "select", id: bomb.id });
        } else if (this.sim.state.phase === "flying") {
          this.sim.enqueue({ type: "detonate", id: bomb.id });
        }
        return;
      }
      const mapped = eventFromKey(event.key, this.sim.state.selectedId);
      if (!mapped) {
        return;
      }
      if (mapped.type === "pause") {
        this.togglePause();
        return;
      }
      this.sim.enqueue(mapped);
    });

    const layout = () => {
      this.layoutStage();
      this.renderer.resize();
    };
    window.addEventListener("resize", layout);
    window.visualViewport?.addEventListener("resize", layout);
    new ResizeObserver(layout).observe(this.stage.parentElement ?? this.root);
    this.root.addEventListener("contextmenu", (event) => event.preventDefault());
  }

  private layoutStage(): void {
    const box = this.stage.parentElement ?? this.root;
    const scale = Math.min(box.clientWidth / LOGICAL_WIDTH, box.clientHeight / LOGICAL_HEIGHT);
    this.stage.style.setProperty(
      "--stage-scale",
      String(Number.isFinite(scale) && scale > 0 ? scale : 1),
    );
  }

  private togglePause(): void {
    if (this.sim.state.phase === "paused") {
      this.sim.enqueue({ type: "resume" });
      return;
    }
    if (this.sim.state.phase === "planning" || this.sim.state.phase === "flying") {
      this.sim.enqueue({ type: "pause" });
    }
  }

  private retry(): void {
    this.renderer.resetVisuals();
    this.seenFx.clear();
    this.sim.enqueue({ type: "retry" });
  }

  private redeploy(): void {
    this.renderer.resetVisuals();
    this.seenFx.clear();
    this.sim.enqueue({ type: "redeploy" });
  }

  private frame = (now: number): void => {
    const frameDelta = Math.min((now - this.previousTime) / 1000, 0.1);
    this.previousTime = now;
    this.sim.flushEvents();
    if (this.sim.state.phase !== "paused") {
      this.accumulator += frameDelta;
    }

    while (this.accumulator >= FIXED_DT) {
      this.sim.updateFixed(FIXED_DT);
      this.accumulator -= FIXED_DT;
    }

    this.observePhase();
    const alpha = this.sim.state.phase === "flying" ? this.accumulator / FIXED_DT : 1;
    this.renderer.render(this.sim.state, this.level, alpha, frameDelta, this.debug);
    this.syncUi();
    this.frames += 1;
    if (now - this.fpsStamp >= 500) {
      this.fps = (this.frames * 1000) / (now - this.fpsStamp);
      this.frames = 0;
      this.fpsStamp = now;
    }
    this.debugView.render(this.sim.state, this.level, this.fps, this.debug);
    requestAnimationFrame(this.frame);
  };

  private observePhase(): void {
    const phase = this.sim.state.phase;
    if (phase === this.lastPhase) {
      for (const fx of this.sim.state.effects) {
        if (!this.seenFx.has(fx.id)) {
          this.seenFx.add(fx.id);
          this.audio.explode(fx.hit);
        }
      }
      return;
    }

    if (phase === "flying" && this.lastPhase !== "flying" && this.lastPhase !== "paused") {
      this.renderer.flashLaunch();
      this.audio.launch();
    }
    if (phase === "success") {
      this.bestTime = recordBestTime(this.level.id, this.sim.state.elapsed);
      this.audio.success();
    }
    if (phase === "failed") {
      this.audio.fail();
    }
    this.lastPhase = phase;
  }

  private syncUi(): void {
    const { state } = this.sim;
    const planning = state.phase === "planning" || (state.phase === "paused" && state.resumePhase === "planning");
    const flying = state.phase === "flying" || (state.phase === "paused" && state.resumePhase === "flying");
    this.planning.setVisible(planning);
    this.planning.setDeleteEnabled(Boolean(state.selectedId) && planning);
    this.flight.render(state.bombs, (planning || flying) && state.bombs.length > 0, state.selectedId, planning);
    this.hud.render(state, this.level, this.audio.muted);
    this.result.render(state, this.bestTime);
  }
}

function mustEl<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`Missing ${selector}`);
  }
  return el as T;
}
