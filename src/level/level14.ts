import { circleRegion, roundedRectCentered } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL14_WORLD_HEIGHT = 1840;
export const LEVEL14_RIGHT_BONUS = 2000;

export const level14CenterAsteroid: HazardRegion = roundedRectCentered(
  "asteroid-center",
  195,
  800,
  52,
  40,
  20,
);

export const level14BonusAsteroid: HazardRegion = roundedRectCentered(
  "asteroid-below-bonus",
  348,
  868,
  54,
  36,
  16,
);

export const level14: LevelDefinition = {
  id: "level-14",
  name: "SECTOR 14",
  worldHeight: LEVEL14_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL14_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [
    circleRegion("goal-left", 70, 760, 44),
    { ...circleRegion("goal-right-bonus", 320, 760, 50), bonusScore: LEVEL14_RIGHT_BONUS },
  ],
  hazards: [level14CenterAsteroid, level14BonusAsteroid],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 37,
  star3Score: 4700,
  star2Score: 3100,
  shipRadius: 14,
  speedCap: 900,
};
