import { circleRegion, roundedRectCentered, triangleRegion } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL12_WORLD_HEIGHT = 1688;

export const level12LowerAsteroid: HazardRegion = roundedRectCentered(
  "asteroid-lower-right",
  270,
  1280,
  70,
  50,
  25,
);

export const level12MidAsteroid: HazardRegion = triangleRegion(
  "asteroid-mid-left",
  { x: 100, y: 834 },
  { x: 145, y: 926 },
  { x: 55, y: 926 },
);

export const level12UpperAsteroid: HazardRegion = triangleRegion(
  "asteroid-upper-left",
  { x: 100, y: 458 },
  { x: 145, y: 542 },
  { x: 55, y: 542 },
);

export const level12: LevelDefinition = {
  id: "level-12",
  name: "SECTOR 12",
  worldHeight: LEVEL12_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL12_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [circleRegion("goal-center", 195, 120, 44)],
  hazards: [level12LowerAsteroid, level12MidAsteroid, level12UpperAsteroid],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 33,
  star3Score: 4900,
  star2Score: 3300,
  shipRadius: 14,
  speedCap: 900,
};
