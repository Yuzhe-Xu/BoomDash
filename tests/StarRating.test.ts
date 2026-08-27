import { describe, expect, it } from "vitest";
import { levels } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level2 } from "../src/level/level2";
import { starsForBestTime, starsForTime } from "../src/level/StarRating";

describe("starsForTime", () => {
  it("awards three stars at or below the fast threshold", () => {
    expect(starsForTime(0, level1)).toBe(3);
    expect(starsForTime(level1.star3Time, level1)).toBe(3);
  });

  it("awards two stars between the fast and mid thresholds", () => {
    expect(starsForTime(level1.star3Time + 0.01, level1)).toBe(2);
    expect(starsForTime(level1.star2Time, level1)).toBe(2);
  });

  it("awards one star for any slower successful finish", () => {
    expect(starsForTime(level1.star2Time + 0.01, level1)).toBe(1);
    expect(starsForTime(level1.timeLimit, level1)).toBe(1);
  });

  it("uses sector two thresholds independently", () => {
    expect(starsForTime(level2.star3Time, level2)).toBe(3);
    expect(starsForTime(level2.star3Time + 0.01, level2)).toBe(2);
    expect(starsForTime(level2.star2Time, level2)).toBe(2);
    expect(starsForTime(level2.star2Time + 0.01, level2)).toBe(1);
  });
});

describe("starsForBestTime", () => {
  it("is empty until a successful run is stored", () => {
    expect(starsForBestTime(null, level1)).toBe(0);
  });

  it("derives stars from the stored best time", () => {
    expect(starsForBestTime(level1.star3Time, level1)).toBe(3);
    expect(starsForBestTime(level1.star2Time, level1)).toBe(2);
    expect(starsForBestTime(level1.timeLimit, level1)).toBe(1);
  });
});

describe("level star thresholds", () => {
  it("keeps 3-star faster than 2-star and both inside the time limit", () => {
    for (const level of levels) {
      expect(level.star3Time).toBeLessThan(level.star2Time);
      expect(level.star2Time).toBeLessThan(level.timeLimit);
    }
  });
});
