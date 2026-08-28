import type { LevelDefinition } from "../level/LevelDefinition";
import { LOGICAL_HEIGHT } from "../level/LevelDefinition";
import type { RunState } from "../simulation/GameState";
import { gravityAcceleration } from "../simulation/GravitySystem";

export class DebugOverlay {
  constructor(private readonly root: HTMLElement) {}

  render(
    state: RunState,
    level: LevelDefinition,
    fps: number,
    visible: boolean,
    cameraY = 0,
  ): void {
    this.root.hidden = !visible;
    if (!visible) {
      return;
    }
    const bombs = state.bombs
      .map((b) => `${b.order}:${b.state[0]}@${b.position.x.toFixed(0)},${b.position.y.toFixed(0)}`)
      .join(" ");
    const gravity = gravityAcceleration(state.ship.position, level.planets);
    this.root.textContent = [
      `phase ${state.phase}  tick ${state.tick}  fps ${fps.toFixed(0)}`,
      `ship ${state.ship.position.x.toFixed(1)},${state.ship.position.y.toFixed(1)}  v ${state.ship.velocity.x.toFixed(1)},${state.ship.velocity.y.toFixed(1)}`,
      `g ${gravity.x.toFixed(1)},${gravity.y.toFixed(1)}`,
      `camera ${cameraY.toFixed(1)} / ${Math.max(0, level.worldHeight - LOGICAL_HEIGHT).toFixed(1)}`,
      `blast ${level.blastRadius}  impulse ${state.lastImpulse.x.toFixed(1)},${state.lastImpulse.y.toFixed(1)}`,
      bombs || "bombs none",
      "F6 reset ship  F7 rearm  F8 log inputs  ?unlimited=1",
    ].join("\n");
  }
}
