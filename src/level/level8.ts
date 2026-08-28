import { cornerQuarterCircle, roundedRectCentered } from "./GoalGeometry";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const level8GoalAsteroid: HazardRegion = roundedRectCentered(
  "asteroid-below-goal",
  310,
  175,
  78,
  50,
  25,
);

export const level8: LevelDefinition = {
  id: "level-8",
  name: "SECTOR 08",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [cornerQuarterCircle("goal-top-right", "top-right", 120)],
  hazards: [level8GoalAsteroid],
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 15,
  star3Score: 5600,
  star2Score: 4000,
  shipRadius: 14,
  speedCap: 900,
};
