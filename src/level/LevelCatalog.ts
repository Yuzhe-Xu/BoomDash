import type { LevelDefinition } from "./LevelDefinition";
import { level1 } from "./level1";
import { level2 } from "./level2";
import { level3 } from "./level3";
import { level4 } from "./level4";
import { level5 } from "./level5";
import { level6 } from "./level6";
import { level7 } from "./level7";
import { level8 } from "./level8";
import { level9 } from "./level9";
import { level10 } from "./level10";
import { level11 } from "./level11";
import { level12 } from "./level12";
import { level13 } from "./level13";
import { level14 } from "./level14";
import { level15 } from "./level15";
import { level16 } from "./level16";
import { level17 } from "./level17";
import { level18 } from "./level18";
import { level19 } from "./level19";
import { level20 } from "./level20";
import { level21 } from "./level21";
import { level22 } from "./level22";
import { level23 } from "./level23";
import { level24 } from "./level24";
import { level25 } from "./level25";

export const levels: LevelDefinition[] = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15,
  level16,
  level17,
  level18,
  level19,
  level20,
  level21,
  level22,
  level23,
  level24,
  level25,
];

export function findLevel(id: string): LevelDefinition | undefined {
  return levels.find((level) => level.id === id);
}

export function nextLevel(currentId: string): LevelDefinition | undefined {
  const index = levels.findIndex((level) => level.id === currentId);
  return index >= 0 ? levels[index + 1] : undefined;
}
