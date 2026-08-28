import { closedCubicBlob } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL15_WORLD_HEIGHT = 2080;
export const LEVEL15_RIGHT_BONUS = 2500;

export const level15CenterAsteroid: HazardRegion = closedCubicBlob(
  "asteroid-center-lower",
  195,
  1200,
  52,
  40,
);

export const level15UpperAsteroid: HazardRegion = closedCubicBlob(
  "asteroid-center-upper",
  195,
  800,
  45,
  34,
);

export const level15: LevelDefinition = {
  id: "level-15",
  name: "SECTOR 15",
  worldHeight: LEVEL15_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL15_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [
    { ...closedCubicBlob("goal-left", 70, 760, 44, 44) },
    { ...closedCubicBlob("goal-right-bonus", 280, 760, 70, 70), bonusScore: LEVEL15_RIGHT_BONUS },
  ],
  hazards: [level15CenterAsteroid, level15UpperAsteroid],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 42,
  star3Score: 4600,
  star2Score: 3000,
  shipRadius: 14,
  speedCap: 900,
};
