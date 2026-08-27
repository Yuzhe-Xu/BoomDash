import { describe, expect, it } from "vitest";
import { level1 } from "../src/level/level1";
import { level2 } from "../src/level/level2";
import {
  TUTORIAL_PAGES,
  clampTutorialPage,
  isFirstTutorialPage,
  isLastTutorialPage,
  shouldShowTutorial,
} from "../src/ui/tutorialPages";

describe("tutorialPages", () => {
  it("defines three briefing pages", () => {
    expect(TUTORIAL_PAGES).toHaveLength(3);
    expect(TUTORIAL_PAGES.map((page) => page.id)).toEqual(["goal", "deploy", "flight"]);
  });

  it("only appears before the first sector", () => {
    expect(shouldShowTutorial(level1.id)).toBe(true);
    expect(shouldShowTutorial(level2.id)).toBe(false);
  });

  it("clamps page bounds", () => {
    expect(clampTutorialPage(-2)).toBe(0);
    expect(clampTutorialPage(9)).toBe(2);
    expect(isFirstTutorialPage(0)).toBe(true);
    expect(isLastTutorialPage(2)).toBe(true);
    expect(isLastTutorialPage(0)).toBe(false);
  });
});
