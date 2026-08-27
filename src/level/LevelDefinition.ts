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

export type Point = {
  x: number;
  y: number;
};

export type CurveCommand =
  | { kind: "line"; to: Point }
  | { kind: "quadratic"; control: Point; to: Point }
  | { kind: "cubic"; c1: Point; c2: Point; to: Point };

export type MapEdge = "top" | "right" | "bottom" | "left";

export type GoalRegion = {
  id: string;
  start: Point;
  curve: CurveCommand[];
  closeEdges: MapEdge[];
};

export type LevelDefinition = {
  id: string;
  name: string;
  worldHeight: number;
  start: ZoneDefinition;
  goals: GoalRegion[];
  maxBombs: number;
  unlimitedBombs: boolean;
  blastRadius: number;
  maxImpulse: number;
  launchVelocity: number;
  timeLimit: number;
  star3Time: number;
  star2Time: number;
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
