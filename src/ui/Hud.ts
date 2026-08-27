import type { RunState } from "../simulation/GameState";
import { remainingBombs } from "../simulation/ShipSimulator";
import { flightProgress } from "../simulation/LifecycleBounds";
import type { LevelDefinition } from "../level/LevelDefinition";

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

    if (state.phase === "planning" || state.phase === "paused" && state.resumePhase === "planning") {
      this.stat.textContent = `BOMBS ${state.bombs.length}/${level.unlimitedBombs ? "∞" : level.maxBombs}`;
      return;
    }

    const remain = remainingBombs(state);
    const progress = Math.round(flightProgress(state.ship.position.y, level.start.cy, level.goal.cy) * 100);
    this.stat.textContent = `T ${state.elapsed.toFixed(1)}s  ${progress}%  ARM ${remain}`;
  }
}
