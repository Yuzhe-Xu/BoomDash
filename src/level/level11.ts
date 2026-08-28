import { roundedRectRegion, topClosedCircularArc } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL11_WORLD_HEIGHT = 1560;

export const level11LowerAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-belt-lower-right",
  LOGICAL_WIDTH / 2,
  1170,
  LOGICAL_WIDTH / 2,
  140,
  28,
);

export const level11UpperAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-belt-upper-left",
  0,
  500,
  LOGICAL_WIDTH / 2,
  135,
  28,
);

export const level11: LevelDefinition = {
  id: "level-11",
  name: "SECTOR 11",
  worldHeight: LEVEL11_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL11_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedCircularArc("goal-top-right", 250, 360, 110)],
  hazards: [level11LowerAsteroid, level11UpperAsteroid],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 31,
  star3Score: 5000,
  star2Score: 3400,
  shipRadius: 14,
  speedCap: 900,
};
