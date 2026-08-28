import { circleRegion, cornerQuarterCircle, roundedRectCentered } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL9_WORLD_HEIGHT = 1100;
export const LEVEL9_RIGHT_BONUS = 2000;

export const level9MidAsteroid: HazardRegion = roundedRectCentered(
  "asteroid-mid",
  LOGICAL_WIDTH * 0.5,
  640,
  88,
  58,
  28,
);

export const level9RightGateAsteroid: HazardRegion = roundedRectCentered(
  "asteroid-right-gate",
  230,
  240,
  60,
  40,
  20,
);

export const level9: LevelDefinition = {
  id: "level-9",
  name: "SECTOR 09",
  worldHeight: LEVEL9_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL9_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [
    cornerQuarterCircle("goal-left", "top-left", 72),
    { ...circleRegion("goal-right", 334, 130, 36), bonusScore: LEVEL9_RIGHT_BONUS },
  ],
  hazards: [level9MidAsteroid, level9RightGateAsteroid],
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 20,
  star3Score: 5400,
  star2Score: 3800,
  shipRadius: 14,
  speedCap: 900,
};
