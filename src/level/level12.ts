import { closedCubicBlob, closedCubicCircleGoal } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL12_WORLD_HEIGHT = 1688;

export const level12LowerAsteroid: HazardRegion = closedCubicBlob(
  "asteroid-lower-right",
  270,
  1280,
  70,
  50,
);

export const level12MidAsteroid: HazardRegion = closedCubicBlob(
  "asteroid-mid-left",
  100,
  880,
  45,
  46,
);

export const level12UpperAsteroid: HazardRegion = closedCubicBlob(
  "asteroid-upper-left",
  100,
  500,
  45,
  42,
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
  goals: [closedCubicCircleGoal("goal-center", 195, 120, 44)],
  hazards: [level12LowerAsteroid, level12MidAsteroid, level12UpperAsteroid],
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
