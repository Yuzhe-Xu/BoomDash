import { cornerQuarterCircle, ringSegmentRegion } from "./GoalGeometry";
import {
  LOGICAL_WIDTH,
  type HazardRegion,
  type LevelDefinition,
} from "./LevelDefinition";

export const LEVEL45_LEFT_WALL_CENTER = { x: -170, y: 600 };
export const LEVEL45_RIGHT_WALL_CENTER = { x: -80, y: 600 };

export const level45LeftArc: HazardRegion = ringSegmentRegion(
  "asteroid-left-sweep",
  LEVEL45_LEFT_WALL_CENTER.x,
  LEVEL45_LEFT_WALL_CENTER.y,
  425,
  460,
  -1.14,
  1.14,
);

export const level45RightArc: HazardRegion = ringSegmentRegion(
  "asteroid-right-sweep",
  LEVEL45_RIGHT_WALL_CENTER.x,
  LEVEL45_RIGHT_WALL_CENTER.y,
  660,
  680,
  -0.94,
  0.94,
);

export const level45: LevelDefinition = {
  id: "level-45",
  name: "SECTOR 45",
  worldHeight: 1200,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 1160,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [cornerQuarterCircle("goal-top-left-arc-gate", "top-left", 82)],
  hazards: [level45LeftArc, level45RightArc],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 27,
  star3Score: 5200,
  star2Score: 3400,
  shipRadius: 14,
  speedCap: 900,
};
