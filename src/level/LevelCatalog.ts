import type { LevelDefinition } from "./LevelDefinition";
import { level1 } from "./level1";
import { level2 } from "./level2";
import { level3 } from "./level3";
import { level4 } from "./level4";

export const levels: LevelDefinition[] = [level1, level2, level3, level4];

export function findLevel(id: string): LevelDefinition | undefined {
  return levels.find((level) => level.id === id);
}

export function nextLevel(currentId: string): LevelDefinition | undefined {
  const index = levels.findIndex((level) => level.id === currentId);
  return index >= 0 ? levels[index + 1] : undefined;
}
