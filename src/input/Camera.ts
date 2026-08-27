import { LOGICAL_HEIGHT } from "../level/LevelDefinition";

export class Camera {
  offsetY = 0;

  reset(worldHeight: number): void {
    this.offsetY = Math.max(0, worldHeight - LOGICAL_HEIGHT);
  }

  panBy(deltaY: number, worldHeight: number): void {
    this.setOffset(this.offsetY + deltaY, worldHeight);
  }

  follow(shipY: number, worldHeight: number): void {
    const target = shipY - LOGICAL_HEIGHT * 0.58;
    this.setOffset(target, worldHeight);
  }

  worldPoint(point: { x: number; y: number }): { x: number; y: number } {
    return { x: point.x, y: point.y + this.offsetY };
  }

  private setOffset(offsetY: number, worldHeight: number): void {
    const maxOffset = Math.max(0, worldHeight - LOGICAL_HEIGHT);
    this.offsetY = Math.min(maxOffset, Math.max(0, offsetY));
  }
}
