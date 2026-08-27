import type { LevelDefinition } from "./LevelDefinition";

export const MAX_STARS = 3;
export const SCORE_SCALE = 10000;
export const TIME_WEIGHT = 0.6;
export const BOMB_WEIGHT = 0.4;

export type StarCount = 0 | 1 | 2 | 3;

export type ScoreInputs = Pick<LevelDefinition, "timeLimit" | "maxBombs">;
export type StarThresholds = Pick<LevelDefinition, "star3Score" | "star2Score">;

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function runScore(elapsed: number, usedBombs: number, level: ScoreInputs): number {
  const timeFactor = level.timeLimit <= 0 ? 0 : clamp01((level.timeLimit - elapsed) / level.timeLimit);
  const bombFactor = level.maxBombs <= 0 ? 1 : clamp01((level.maxBombs - usedBombs) / level.maxBombs);
  return Math.round(SCORE_SCALE * (TIME_WEIGHT * timeFactor + BOMB_WEIGHT * bombFactor));
}

export function starsForScore(score: number, level: StarThresholds): StarCount {
  if (score >= level.star3Score) {
    return 3;
  }
  if (score >= level.star2Score) {
    return 2;
  }
  return 1;
}

export function starsForBestScore(bestScore: number | null, level: StarThresholds): StarCount {
  if (bestScore === null) {
    return 0;
  }
  return starsForScore(bestScore, level);
}
