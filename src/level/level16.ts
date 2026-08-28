import { roundedRectRegion } from "./GoalGeometry";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL16_WORLD_HEIGHT = LOGICAL_HEIGHT;

export const level16OuterLeftAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-outer-left",
  70,
  275,
  28,
  215,
  10,
);

export const level16BottomAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-goal-bottom",
  86,
  458,
  184,
  32,
  10,
);

export const level16TopAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-goal-top",
  158,
  339,
  112,
  28,
  10,
);

export const level16RightAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-goal-right",
  246,
  339,
  24,
  151,
  10,
);

export const level16: LevelDefinition = {
  id: "level-16",
  name: "SECTOR 16",
  worldHeight: LEVEL16_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL16_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectRegion("goal-center-right", 168, 376, 70, 70, 16)],
  hazards: [
    level16OuterLeftAsteroid,
    level16BottomAsteroid,
    level16TopAsteroid,
    level16RightAsteroid,
  ],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 20,
  star3Score: 5000,
  star2Score: 3400,
  shipRadius: 14,
  speedCap: 900,
};
