import { circleRegion, equalRingSegments } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type HazardMotion,
  type HazardRegion,
  type LevelDefinition,
} from "./LevelDefinition";

export const LEVEL26_RING_CENTER = { x: LOGICAL_WIDTH / 2, y: 240 };
export const LEVEL26_RING_INNER = 78;
export const LEVEL26_RING_OUTER = 108;
export const LEVEL26_RING_COUNT = 3;
export const LEVEL26_RING_SEGMENT_ANGLE = Math.PI / 3;
export const LEVEL26_RING_SPACING = (Math.PI * 2) / LEVEL26_RING_COUNT;
export const LEVEL26_RING_GAP = LEVEL26_RING_SPACING - LEVEL26_RING_SEGMENT_ANGLE;
export const LEVEL26_RING_FIRST_START = Math.PI / 2 + LEVEL26_RING_GAP / 2;

export const level26RotatingRings: HazardRegion[] = equalRingSegments(
  "asteroid-rotating-ring",
  LEVEL26_RING_CENTER.x,
  LEVEL26_RING_CENTER.y,
  LEVEL26_RING_INNER,
  LEVEL26_RING_OUTER,
  LEVEL26_RING_COUNT,
  LEVEL26_RING_SEGMENT_ANGLE,
  LEVEL26_RING_FIRST_START,
);

export const level26HazardMotion: HazardMotion = {
  center: LEVEL26_RING_CENTER,
  angularVelocity: 0.17,
};

export const level26: LevelDefinition = {
  id: "level-26",
  name: "SECTOR 26",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [circleRegion("goal-rotating-rings-center", LEVEL26_RING_CENTER.x, LEVEL26_RING_CENTER.y, 42)],
  hazards: level26RotatingRings,
  hazardMotion: level26HazardMotion,
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 16,
  star3Score: 5400,
  star2Score: 3600,
  shipRadius: 14,
  speedCap: 900,
};
