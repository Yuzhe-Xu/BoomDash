import { cornerQuarterCircle, cornerQuarterRing } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type DustRegion,
  type LevelDefinition,
} from "./LevelDefinition";

export const LEVEL22_WORLD_HEIGHT = LOGICAL_HEIGHT;

function dustRing(id: string, innerRadius: number, outerRadius: number): DustRegion {
  return {
    ...cornerQuarterRing(id, "top-left", innerRadius, outerRadius),
    dragPerSecond: 0.32,
  };
}

export const level22DustRings: DustRegion[] = [
  dustRing("dust-ring-inner", 78, 105),
  dustRing("dust-ring-middle", 160, 202),
  dustRing("dust-ring-outer", 346, 380),
];

export const level22: LevelDefinition = {
  id: "level-22",
  name: "SECTOR 22",
  worldHeight: LEVEL22_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL22_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [cornerQuarterCircle("goal-top-left", "top-left", 68)],
  hazards: [],
  dustRegions: level22DustRings,
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 20,
  star3Score: 6000,
  star2Score: 4100,
  shipRadius: 14,
  speedCap: 900,
};
