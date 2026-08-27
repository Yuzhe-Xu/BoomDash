import { level1 } from "../level/level1";
import { level2 } from "../level/level2";

export type TutorialPage = {
  id: "goal" | "deploy" | "flight" | "scroll";
  kicker: string;
  title: string;
  copy: string;
};

export const LEVEL1_TUTORIAL_PAGES: TutorialPage[] = [
  {
    id: "goal",
    kicker: "OBJECTIVE",
    title: "游戏目标",
    copy: "在规定时间内使飞船进入终点区域。",
  },
  {
    id: "deploy",
    kicker: "DEPLOY",
    title: "炸弹部署",
    copy: "在合理的位置部署炸弹，规划飞船的飞行路线。",
  },
  {
    id: "flight",
    kicker: "FLIGHT",
    title: "飞船飞行",
    copy: "启动后在合适时机引爆炸弹，使飞船在规定时间内进入终点区域。",
  },
];

export const LEVEL2_TUTORIAL_PAGES: TutorialPage[] = [
  {
    id: "scroll",
    kicker: "SURVEY",
    title: "浏览地图",
    copy: "使用鼠标滚轮或上下滑动，浏览整个地图。",
  },
];

const TUTORIALS_BY_LEVEL: Record<string, TutorialPage[]> = {
  [level1.id]: LEVEL1_TUTORIAL_PAGES,
  [level2.id]: LEVEL2_TUTORIAL_PAGES,
};

export function tutorialPagesFor(levelId: string): TutorialPage[] {
  return TUTORIALS_BY_LEVEL[levelId] ?? [];
}

export function shouldShowTutorial(levelId: string): boolean {
  return tutorialPagesFor(levelId).length > 0;
}

export function clampTutorialPage(index: number, pageCount: number): number {
  if (pageCount <= 0) {
    return 0;
  }
  return Math.min(pageCount - 1, Math.max(0, index));
}

export function isFirstTutorialPage(index: number, pageCount: number): boolean {
  return clampTutorialPage(index, pageCount) === 0;
}

export function isLastTutorialPage(index: number, pageCount: number): boolean {
  return pageCount <= 0 || clampTutorialPage(index, pageCount) === pageCount - 1;
}
