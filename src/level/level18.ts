import { roundedRectRegion } from "./GoalGeometry";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL18_WORLD_HEIGHT = LOGICAL_HEIGHT;

export const level18UpperAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-goal-upper-bar",
  62,
  320,
  266,
  34,
  8,
);

export const level18LowerAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-goal-lower-bar",
  58,
  450,
  274,
  34,
  8,
);

export const level18: LevelDefinition = {
  id: "level-18",
  name: "SECTOR 18",
  worldHeight: LEVEL18_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL18_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectRegion("goal-center-slot", 155, 370, 80, 64, 16)],
  hazards: [level18UpperAsteroid, level18LowerAsteroid],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 18,
  star3Score: 5400,
  star2Score: 3700,
  shipRadius: 14,
  speedCap: 900,
};
