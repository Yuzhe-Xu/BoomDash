import { roundedRectRegion, topClosedCircularArc } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL13_WORLD_HEIGHT = 1560;

export const level13LowerAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-belt-lower-right",
  92,
  1188,
  298,
  152,
  36,
);

export const level13UpperAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-belt-upper-left",
  0,
  520,
  300,
  150,
  36,
);

export const level13: LevelDefinition = {
  id: "level-13",
  name: "SECTOR 13",
  worldHeight: LEVEL13_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL13_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedCircularArc("goal-top-right", 250, 360, 110)],
  hazards: [level13LowerAsteroid, level13UpperAsteroid],
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
