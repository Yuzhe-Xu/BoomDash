export const LOGICAL_WIDTH = 390;
export const LOGICAL_HEIGHT = 844;

export type ArcKind = "upper" | "lower";

export type ZoneDefinition = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  arc: ArcKind;
};

export type LevelDefinition = {
  id: string;
  name: string;
  worldHeight: number;
  start: ZoneDefinition;
  goal: ZoneDefinition;
  maxBombs: number;
  unlimitedBombs: boolean;
  blastRadius: number;
  maxImpulse: number;
  launchVelocity: number;
  timeLimit: number;
  shipRadius: number;
  speedCap: number;
};

export function clampToCanvas(
  x: number,
  y: number,
  worldHeight = LOGICAL_HEIGHT,
): { x: number; y: number } {
  return {
    x: Math.min(LOGICAL_WIDTH, Math.max(0, x)),
    y: Math.min(worldHeight, Math.max(0, y)),
  };
}
