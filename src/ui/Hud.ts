import type { RunState } from "../simulation/GameState";
import { remainingBombs } from "../simulation/ShipSimulator";
import { flightProgress, minSpeedToFinish } from "../simulation/LifecycleBounds";
import type { LevelDefinition } from "../level/LevelDefinition";
import { length } from "../simulation/Vec2";

export class Hud {
  constructor(
    private readonly stat: HTMLElement,
    private readonly levelTag: HTMLElement,
    private readonly muteBtn: HTMLButtonElement,
    private readonly shipRow: HTMLElement,
    private readonly speedEl: HTMLElement,
    private readonly minEl: HTMLElement,
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
    this.shipRow.hidden = planning;
    if (planning) {
      this.stat.textContent = `BOMBS ${state.bombs.length}/${level.unlimitedBombs ? "∞" : level.maxBombs}`;
      this.speedEl.classList.remove("ok", "warn");
      return;
    }

    const remain = remainingBombs(state);
    const progress = Math.round(flightProgress(state.ship.position.y, level.start.cy, level.goal.cy) * 100);
    this.stat.textContent = `T ${state.elapsed.toFixed(1)}s  ${progress}%  ARM ${remain}`;

    const speed = Math.round(length(state.ship.velocity));
    const minSpeed = minSpeedToFinish(
      state.ship.position,
      level.goal,
      state.ship.radius,
      state.elapsed,
      level.timeLimit,
    );
    const minShown = Number.isFinite(minSpeed) ? Math.round(minSpeed) : null;
    this.speedEl.textContent = `V ${speed}`;
    this.minEl.textContent = `MIN ${minShown === null ? "∞" : minShown}`;
    const feasible = minShown !== null && speed >= minShown;
    this.speedEl.classList.toggle("ok", feasible);
    this.speedEl.classList.toggle("warn", !feasible);
  }
}
