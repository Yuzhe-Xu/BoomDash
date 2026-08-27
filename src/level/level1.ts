import { topClosedQuadraticGoal } from "./GoalGeometry";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, type LevelDefinition } from "./LevelDefinition";

export const level1: LevelDefinition = {
  id: "level-1",
  name: "SECTOR 01",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedQuadraticGoal("goal-top", 70, 320, 92)],
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 15,
  star3Score: 6400,
  star2Score: 4800,
  shipRadius: 14,
  speedCap: 900,
};

export function withDebugOverrides(level: LevelDefinition, debug: boolean): LevelDefinition {
  if (!debug) {
    return level;
  }
  const params = new URLSearchParams(window.location.search);
  return {
    ...level,
    unlimitedBombs: params.get("unlimited") !== "0",
    maxBombs: Number(params.get("bombs") ?? level.maxBombs) || level.maxBombs,
  };
}

export { LOGICAL_HEIGHT, LOGICAL_WIDTH };
