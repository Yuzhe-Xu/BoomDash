import { topClosedQuadraticGoal } from "./GoalGeometry";
import { type LevelDefinition } from "./LevelDefinition";

export const level2: LevelDefinition = {
  id: "level-2",
  name: "SECTOR 02",
  worldHeight: 1688,
  start: {
    cx: 195,
    cy: 1654,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedQuadraticGoal("goal-top", 70, 320, 92)],
  hazards: [],
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 24,
  star3Score: 6400,
  star2Score: 4900,
  shipRadius: 14,
  speedCap: 900,
};
