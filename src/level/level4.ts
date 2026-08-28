import { topClosedCircularArc } from "./GoalGeometry";
import { LOGICAL_HEIGHT, type LevelDefinition } from "./LevelDefinition";

export const level4: LevelDefinition = {
  id: "level-4",
  name: "SECTOR 04",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: 195,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedCircularArc("goal-top-left", 40, 123, 31)],
  hazards: [],
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 15,
  star3Score: 5800,
  star2Score: 4200,
  shipRadius: 14,
  speedCap: 900,
};
