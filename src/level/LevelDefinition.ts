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

export type HazardMotion = {
  center: Point;
  angularVelocity: number;
  initialAngle?: number;
  angleRange?: {
    min: number;
    max: number;
    mode?: "ping-pong" | "wrap";
  };
};

export type PlanetMotion = {
  center: Point;
  angularVelocity: number;
  initialAngle?: number;
};

export type CurveCommand =
  | { kind: "line"; to: Point }
  | { kind: "quadratic"; control: Point; to: Point }
  | { kind: "cubic"; c1: Point; c2: Point; to: Point }
  | {
      kind: "arc";
      cx: number;
      cy: number;
      radius: number;
      startAngle: number;
      endAngle: number;
      counterclockwise?: boolean;
      to: Point;
    };

export type MapEdge = "top" | "right" | "bottom" | "left";

export type CurveRegion = {
  id: string;
  start: Point;
  curve: CurveCommand[];
  closeEdges: MapEdge[];
};

export type GoalRegion = CurveRegion & {
  bonusScore?: number;
};
export type HazardRegion = CurveRegion;
export type DustRegion = CurveRegion & {
  dragPerSecond: number;
};

export type PlanetAppearance = "rocky";

export type PlanetDefinition = {
  id: string;
  center: Point;
  radius: number;
  gravitationalParameter: number;
  appearance?: PlanetAppearance;
  spinRate?: number;
  spinPhase?: number;
  motion?: PlanetMotion;
};

export type LevelDefinition = {
  id: string;
  name: string;
  worldHeight: number;
  start: ZoneDefinition;
  goals: GoalRegion[];
  goalMotion?: HazardMotion;
  hazards: HazardRegion[];
  hazardMotion?: HazardMotion;
  planets?: PlanetDefinition[];
  dustRegions: DustRegion[];
  dustMotion?: HazardMotion;
  maxBombs: number;
  unlimitedBombs: boolean;
  blastRadius: number;
  maxImpulse: number;
  launchVelocity: number;
  timeLimit: number;
  star3Score: number;
  star2Score: number;
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
