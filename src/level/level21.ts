import { roundedRectRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type DustRegion,
  type LevelDefinition,
} from "./LevelDefinition";

export const LEVEL21_WORLD_HEIGHT = LOGICAL_HEIGHT;

export const level21DustBelt: DustRegion = {
  ...roundedRectRegion("dust-center-belt", 58, 355, 274, 155, 18),
  dragPerSecond: 0.45,
};

export const level21: LevelDefinition = {
  id: "level-21",
  name: "SECTOR 21",
  worldHeight: LEVEL21_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL21_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectRegion("goal-top-center", 115, 135, 160, 80, 18)],
  hazards: [],
  dustRegions: [level21DustBelt],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 18,
  star3Score: 6500,
  star2Score: 4500,
  shipRadius: 14,
  speedCap: 900,
};
