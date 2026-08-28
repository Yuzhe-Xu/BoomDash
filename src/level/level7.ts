import { roundedRectCentered, topClosedCircularArc } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL7_WORLD_HEIGHT = 1200;

export const level7LowerAsteroid: HazardRegion = roundedRectCentered(
  "asteroid-center-lower",
  LOGICAL_WIDTH * 0.5,
  820,
  70,
  50,
  25,
);

export const level7UpperAsteroid: HazardRegion = roundedRectCentered(
  "asteroid-center-upper",
  LOGICAL_WIDTH * 0.5,
  380,
  70,
  50,
  25,
);

export const level7: LevelDefinition = {
  id: "level-7",
  name: "SECTOR 07",
  worldHeight: LEVEL7_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL7_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedCircularArc("goal-top", 70, 320, 92)],
  hazards: [level7LowerAsteroid, level7UpperAsteroid],
  dustRegions: [],
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 22,
  star3Score: 5800,
  star2Score: 4200,
  shipRadius: 14,
  speedCap: 900,
};
