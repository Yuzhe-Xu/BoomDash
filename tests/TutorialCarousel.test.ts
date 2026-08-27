import { describe, expect, it } from "vitest";
import { level1 } from "../src/level/level1";
import { level2 } from "../src/level/level2";
import { level3 } from "../src/level/level3";
import { level4 } from "../src/level/level4";
import { level5 } from "../src/level/level5";
import { level6 } from "../src/level/level6";
import { level7 } from "../src/level/level7";
import { level8 } from "../src/level/level8";
import { level9 } from "../src/level/level9";
import { level10 } from "../src/level/level10";
import {
  LEVEL1_TUTORIAL_PAGES,
  LEVEL2_TUTORIAL_PAGES,
  LEVEL4_TUTORIAL_PAGES,
  LEVEL6_TUTORIAL_PAGES,
  clampTutorialPage,
  isFirstTutorialPage,
  isLastTutorialPage,
  shouldShowTutorial,
  tutorialPagesFor,
} from "../src/ui/tutorialPages";

describe("tutorialPages", () => {
  it("defines three briefing pages for sector one", () => {
    expect(LEVEL1_TUTORIAL_PAGES).toHaveLength(3);
    expect(LEVEL1_TUTORIAL_PAGES.map((page) => page.id)).toEqual(["goal", "deploy", "flight"]);
    expect(tutorialPagesFor(level1.id)).toEqual(LEVEL1_TUTORIAL_PAGES);
  });

  it("defines one map survey page for sector two", () => {
    expect(LEVEL2_TUTORIAL_PAGES).toHaveLength(1);
    expect(LEVEL2_TUTORIAL_PAGES[0]?.id).toBe("scroll");
    expect(LEVEL2_TUTORIAL_PAGES[0]?.copy).toContain("鼠标滚轮");
    expect(LEVEL2_TUTORIAL_PAGES[0]?.copy).toContain("上下滑动");
    expect(tutorialPagesFor(level2.id)).toEqual(LEVEL2_TUTORIAL_PAGES);
  });

  it("defines one rating page for sector four", () => {
    expect(LEVEL4_TUTORIAL_PAGES).toHaveLength(1);
    expect(LEVEL4_TUTORIAL_PAGES[0]?.id).toBe("score");
    expect(LEVEL4_TUTORIAL_PAGES[0]?.copy).toContain("时间");
    expect(LEVEL4_TUTORIAL_PAGES[0]?.copy).toContain("引爆炸弹");
    expect(LEVEL4_TUTORIAL_PAGES[0]?.copy).toContain("星级");
    expect(tutorialPagesFor(level4.id)).toEqual(LEVEL4_TUTORIAL_PAGES);
  });

  it("defines one asteroid hazard page for sector six", () => {
    expect(LEVEL6_TUTORIAL_PAGES).toHaveLength(1);
    expect(LEVEL6_TUTORIAL_PAGES[0]?.id).toBe("asteroid");
    expect(LEVEL6_TUTORIAL_PAGES[0]?.copy).toContain("禁入区域");
    expect(LEVEL6_TUTORIAL_PAGES[0]?.copy).toContain("任务立即失败");
    expect(tutorialPagesFor(level6.id)).toEqual(LEVEL6_TUTORIAL_PAGES);
  });

  it("appears before sectors that have briefing pages", () => {
    expect(shouldShowTutorial(level1.id)).toBe(true);
    expect(shouldShowTutorial(level2.id)).toBe(true);
    expect(shouldShowTutorial(level3.id)).toBe(false);
    expect(shouldShowTutorial(level4.id)).toBe(true);
    expect(shouldShowTutorial(level5.id)).toBe(false);
    expect(shouldShowTutorial(level6.id)).toBe(true);
    expect(shouldShowTutorial(level7.id)).toBe(false);
    expect(shouldShowTutorial(level8.id)).toBe(false);
    expect(shouldShowTutorial(level9.id)).toBe(false);
    expect(shouldShowTutorial(level10.id)).toBe(false);
    expect(shouldShowTutorial("missing")).toBe(false);
  });

  it("clamps page bounds for the active briefing", () => {
    expect(clampTutorialPage(-2, 3)).toBe(0);
    expect(clampTutorialPage(9, 3)).toBe(2);
    expect(clampTutorialPage(4, 1)).toBe(0);
    expect(isFirstTutorialPage(0, 1)).toBe(true);
    expect(isLastTutorialPage(0, 1)).toBe(true);
    expect(isLastTutorialPage(2, 3)).toBe(true);
    expect(isLastTutorialPage(0, 3)).toBe(false);
  });
});
