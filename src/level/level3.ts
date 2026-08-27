import { cornerQuadraticGoal } from "./GoalGeometry";
import { LOGICAL_HEIGHT, type LevelDefinition } from "./LevelDefinition";

export const level3: LevelDefinition = {
  id: "level-3",
  name: "SECTOR 03",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: 195,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [
    cornerQuadraticGoal("goal-left", "top-left", 78, 78, 64),
    cornerQuadraticGoal("goal-right", "top-right", 78, 78, 64),
  ],
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 15,
  star3Time: 8,
  star2Time: 12,
  shipRadius: 14,
  speedCap: 900,
};
