import { roundedRectCentered, topClosedCircularArc } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL10_WORLD_HEIGHT = 1440;

export const level10LowerAsteroid: HazardRegion = roundedRectCentered(
  "asteroid-lower-right",
  255,
  1080,
  58,
  44,
  44,
);

export const level10UpperAsteroid: HazardRegion = roundedRectCentered(
  "asteroid-upper-left",
  105,
  250,
  58,
  42,
  20,
);

export const level10: LevelDefinition = {
  id: "level-10",
  name: "SECTOR 10",
  worldHeight: LEVEL10_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL10_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedCircularArc("goal-top-right", 255, 338, 31)],
  hazards: [level10LowerAsteroid, level10UpperAsteroid],
  dustRegions: [],
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 26,
  star3Score: 5200,
  star2Score: 3600,
  shipRadius: 14,
  speedCap: 900,
};
