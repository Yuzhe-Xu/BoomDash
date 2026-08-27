import { level1 } from "../level/level1";

export type TutorialPage = {
  id: "goal" | "deploy" | "flight";
  kicker: string;
  title: string;
  copy: string;
};

export const TUTORIAL_PAGES: TutorialPage[] = [
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

export function shouldShowTutorial(levelId: string): boolean {
  return levelId === level1.id;
}

export function clampTutorialPage(index: number): number {
  return Math.min(TUTORIAL_PAGES.length - 1, Math.max(0, index));
}

export function isFirstTutorialPage(index: number): boolean {
  return clampTutorialPage(index) === 0;
}

export function isLastTutorialPage(index: number): boolean {
  return clampTutorialPage(index) === TUTORIAL_PAGES.length - 1;
}
