import { circleRegion } from "./GoalGeometry";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, type LevelDefinition } from "./LevelDefinition";

const GOAL_RADIUS = 31.25;
const TOP_GAP = 80;

export const level5: LevelDefinition = {
  id: "level-5",
  name: "SECTOR 05",
  worldHeight: LOGICAL_HEIGHT + TOP_GAP,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LOGICAL_HEIGHT + TOP_GAP - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [
    circleRegion(
      "goal-center",
      LOGICAL_WIDTH * 0.5,
      TOP_GAP + GOAL_RADIUS,
      GOAL_RADIUS,
    ),
  ],
  hazards: [],
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
