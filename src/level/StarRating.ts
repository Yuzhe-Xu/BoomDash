import type { LevelDefinition } from "./LevelDefinition";

export const MAX_STARS = 3;

export type StarCount = 0 | 1 | 2 | 3;

export type StarThresholds = Pick<LevelDefinition, "star3Time" | "star2Time">;

export function starsForTime(elapsed: number, level: StarThresholds): StarCount {
  if (elapsed <= level.star3Time) {
    return 3;
  }
  if (elapsed <= level.star2Time) {
    return 2;
  }
  return 1;
}

export function starsForBestTime(bestTime: number | null, level: StarThresholds): StarCount {
  if (bestTime === null) {
    return 0;
  }
  return starsForTime(bestTime, level);
}
