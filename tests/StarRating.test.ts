import { describe, expect, it } from "vitest";
import { levels } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level2 } from "../src/level/level2";
import { level4 } from "../src/level/level4";
import { level9, LEVEL9_RIGHT_BONUS } from "../src/level/level9";
import {
  BOMB_WEIGHT,
  goalBonus,
  isBonusGoal,
  runScore,
  SCORE_SCALE,
  starsForBestScore,
  starsForScore,
  TIME_WEIGHT,
} from "../src/level/StarRating";

describe("runScore", () => {
  it("rewards faster finishes and fewer detonations", () => {
    const fastFew = runScore(6, 1, level1);
    const slowFew = runScore(12, 1, level1);
    const fastMany = runScore(6, 4, level1);
    expect(fastFew).toBeGreaterThan(slowFew);
    expect(fastFew).toBeGreaterThan(fastMany);
  });

  it("uses a 60/40 time-bomb mix on a 10000 scale", () => {
    expect(TIME_WEIGHT + BOMB_WEIGHT).toBe(1);
    expect(runScore(0, 0, level1)).toBe(SCORE_SCALE);
    expect(runScore(level1.timeLimit, level1.maxBombs, level1)).toBe(0);
    expect(runScore(7, 1, level1)).toBe(6400);
  });

  it("adds bonus points from a harder goal on top of the time-bomb score", () => {
    expect(runScore(7, 1, level1, 0)).toBe(6400);
    expect(runScore(7, 1, level1, 500)).toBe(6900);
    expect(runScore(7, 1, level1, -200)).toBe(6400);
    expect(goalBonus(level9.goals, "goal-left")).toBe(0);
    expect(goalBonus(level9.goals, "goal-right")).toBe(LEVEL9_RIGHT_BONUS);
    expect(goalBonus(level9.goals, null)).toBe(0);
    expect(isBonusGoal(level9.goals[0]!)).toBe(false);
    expect(isBonusGoal(level9.goals[1]!)).toBe(true);
  });
});

describe("starsForScore", () => {
  it("awards three stars at or above the high threshold", () => {
    expect(starsForScore(level1.star3Score, level1)).toBe(3);
    expect(starsForScore(SCORE_SCALE, level1)).toBe(3);
  });

  it("awards two stars between the high and mid thresholds", () => {
    expect(starsForScore(level1.star3Score - 1, level1)).toBe(2);
    expect(starsForScore(level1.star2Score, level1)).toBe(2);
  });

  it("awards one star for any successful finish below the mid threshold", () => {
    expect(starsForScore(level1.star2Score - 1, level1)).toBe(1);
    expect(starsForScore(0, level1)).toBe(1);
  });

  it("uses sector two thresholds independently", () => {
    expect(starsForScore(level2.star3Score, level2)).toBe(3);
    expect(starsForScore(level2.star3Score - 1, level2)).toBe(2);
    expect(starsForScore(level2.star2Score, level2)).toBe(2);
    expect(starsForScore(level2.star2Score - 1, level2)).toBe(1);
  });

  it("lets extra bombs drop a fast sector-four finish from three stars to two", () => {
    const lean = runScore(8, 1, level4);
    const wasteful = runScore(8, 3, level4);
    expect(starsForScore(lean, level4)).toBe(3);
    expect(starsForScore(wasteful, level4)).toBe(2);
  });
});

describe("starsForBestScore", () => {
  it("is empty until a successful run is stored", () => {
    expect(starsForBestScore(null, level1)).toBe(0);
  });

  it("derives stars from the stored best score", () => {
    expect(starsForBestScore(level1.star3Score, level1)).toBe(3);
    expect(starsForBestScore(level1.star2Score, level1)).toBe(2);
    expect(starsForBestScore(0, level1)).toBe(1);
  });
});

describe("level star thresholds", () => {
  it("keeps 3-star above 2-star and both inside the score scale", () => {
    for (const level of levels) {
      expect(level.star3Score).toBeGreaterThan(level.star2Score);
      expect(level.star2Score).toBeGreaterThan(0);
      expect(level.star3Score).toBeLessThanOrEqual(SCORE_SCALE);
    }
  });
});
