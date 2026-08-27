import type { RunState } from "../simulation/GameState";
import { remainingBombs } from "../simulation/ShipSimulator";
import { flightProgress } from "../simulation/LifecycleBounds";
import { referenceGoalY } from "../level/GoalGeometry";
import { LOGICAL_WIDTH, type LevelDefinition } from "../level/LevelDefinition";

export const COUNTDOWN_WARN_SECONDS = 3;

export function remainingTime(elapsed: number, timeLimit: number): number {
  return Math.max(0, timeLimit - elapsed);
}

export function isCountdownWarning(remaining: number): boolean {
  return remaining > 0 && remaining <= COUNTDOWN_WARN_SECONDS;
}

export class Hud {
  constructor(
    private readonly stat: HTMLElement,
    private readonly levelTag: HTMLElement,
    private readonly muteBtn: HTMLButtonElement,
  ) {}

  bind(onPause: () => void, onMute: () => void): void {
    document.getElementById("btn-pause")?.addEventListener("click", onPause);
    this.muteBtn.addEventListener("click", onMute);
  }

  render(state: RunState, level: LevelDefinition, muted: boolean): void {
    this.levelTag.textContent = level.name;
    this.muteBtn.textContent = muted ? "MUTE" : "SND";
    this.muteBtn.classList.toggle("active", muted);

    const planning = state.phase === "planning" || (state.phase === "paused" && state.resumePhase === "planning");
    if (planning) {
      this.stat.textContent = `BOMBS ${state.bombs.length}/${level.unlimitedBombs ? "∞" : level.maxBombs}`;
      this.stat.classList.remove("warn");
      return;
    }

    const remain = remainingBombs(state);
    const progress = Math.round(
      flightProgress(
        state.ship.position.y,
        level.start.cy,
        referenceGoalY(level.goals, LOGICAL_WIDTH, level.worldHeight),
      ) * 100,
    );
    const remaining = remainingTime(state.elapsed, level.timeLimit);
    this.stat.textContent = `T ${remaining.toFixed(1)}s  ${progress}%  ARM ${remain}`;
    this.stat.classList.toggle("warn", isCountdownWarning(remaining));
  }
}
