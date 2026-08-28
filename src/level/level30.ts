import { circleRegion } from "./GoalGeometry";
import type { GoalRegion, HazardMotion, LevelDefinition } from "./LevelDefinition";
import { LEVEL29_CENTER, level29 } from "./level29";

export const LEVEL30_BONUS_SCORE = 2000;
export const LEVEL30_BONUS_RADIUS = 24;
export const LEVEL30_BONUS_ORBIT_RADIUS = 210;
export const LEVEL30_BONUS_START_ANGLE = -1.05;

export const level30BonusGoal: GoalRegion = {
  ...circleRegion(
    "goal-rotating-bonus",
    LEVEL29_CENTER.x + LEVEL30_BONUS_ORBIT_RADIUS * Math.cos(LEVEL30_BONUS_START_ANGLE),
    LEVEL29_CENTER.y + LEVEL30_BONUS_ORBIT_RADIUS * Math.sin(LEVEL30_BONUS_START_ANGLE),
    LEVEL30_BONUS_RADIUS,
  ),
  bonusScore: LEVEL30_BONUS_SCORE,
};

export const level30GoalMotion: HazardMotion = {
  center: LEVEL29_CENTER,
  angularVelocity: -0.13,
};

export const level30: LevelDefinition = {
  ...level29,
  id: "level-30",
  name: "SECTOR 30",
  goals: [level29.goals[0], level30BonusGoal],
  goalMotion: level30GoalMotion,
  timeLimit: 20,
  star3Score: 5200,
  star2Score: 3400,
};
