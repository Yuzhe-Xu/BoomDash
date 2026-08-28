import { level1 } from "../level/level1";
import { level2 } from "../level/level2";
import { level4 } from "../level/level4";
import { level6 } from "../level/level6";
import { level9 } from "../level/level9";
import { level21 } from "../level/level21";
import { level31 } from "../level/level31";

export type TutorialPage = {
  id: "goal" | "deploy" | "flight" | "scroll" | "score" | "asteroid" | "bonus" | "dust" | "gravity";
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

export const LEVEL4_TUTORIAL_PAGES: TutorialPage[] = [
  {
    id: "score",
    kicker: "RATING",
    title: "通关评分",
    copy: "分数由时间（越短越好）和引爆炸弹数（越少越好）加权得到，星级由分数判定。",
  },
];

export const LEVEL6_TUTORIAL_PAGES: TutorialPage[] = [
  {
    id: "asteroid",
    kicker: "HAZARD",
    title: "陨石带",
    copy: "陨石带是禁入区域。飞船一旦进入，任务立即失败；规划轨迹从区域外绕行。",
  },
];

export const LEVEL9_TUTORIAL_PAGES: TutorialPage[] = [
  {
    id: "bonus",
    kicker: "BONUS",
    title: "奖励终点",
    copy: "带奖励图样的终点更难到达。进入后可获得额外加分。",
  },
];

export const LEVEL21_TUTORIAL_PAGES: TutorialPage[] = [
  {
    id: "dust",
    kicker: "DRAG FIELD",
    title: "星际尘埃",
    copy: "飞船进入灰色尘埃区域后会持续减速。预留炸弹，在尘埃中补充速度。",
  },
];

export const LEVEL31_TUTORIAL_PAGES: TutorialPage[] = [
  {
    id: "gravity",
    kicker: "GRAVITY",
    title: "行星引力",
    copy: "行星具有引力。飞船速度的大小和方向会改变轨迹；撞击表面立即失败。",
  },
];

const TUTORIALS_BY_LEVEL: Record<string, TutorialPage[]> = {
  [level1.id]: LEVEL1_TUTORIAL_PAGES,
  [level2.id]: LEVEL2_TUTORIAL_PAGES,
  [level4.id]: LEVEL4_TUTORIAL_PAGES,
  [level6.id]: LEVEL6_TUTORIAL_PAGES,
  [level9.id]: LEVEL9_TUTORIAL_PAGES,
  [level21.id]: LEVEL21_TUTORIAL_PAGES,
  [level31.id]: LEVEL31_TUTORIAL_PAGES,
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
