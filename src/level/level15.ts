import { circleRegion, roundedRectCentered } from "./GoalGeometry";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL15_WORLD_HEIGHT = LOGICAL_HEIGHT;

export const level15GoalAsteroidBottom: HazardRegion = roundedRectCentered(
  "asteroid-goal-cup-bottom",
  100,
  488,
  64,
  36,
  16,
);

export const level15GoalAsteroidLeft: HazardRegion = roundedRectCentered(
  "asteroid-goal-cup-left",
  38,
  400,
  14,
  52,
  10,
);

export const level15GoalAsteroidRight: HazardRegion = roundedRectCentered(
  "asteroid-goal-cup-right",
  162,
  400,
  14,
  52,
  10,
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
  goals: [circleRegion("goal-mid-left", 100, 400, 48)],
  hazards: [level15GoalAsteroidBottom, level15GoalAsteroidLeft, level15GoalAsteroidRight],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 16,
  star3Score: 5200,
  star2Score: 3600,
  shipRadius: 14,
  speedCap: 900,
};
