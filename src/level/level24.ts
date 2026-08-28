import { roundedRectRegion } from "./GoalGeometry";
import { type DustRegion, type LevelDefinition } from "./LevelDefinition";
import { level8 } from "./level8";

export const level24DustField: DustRegion = {
  ...roundedRectRegion("dust-left-of-asteroid", 0, 125, 218, 100, 14),
  dragPerSecond: 0.4,
};

export const level24: LevelDefinition = {
  ...level8,
  id: "level-24",
  name: "SECTOR 24",
  dustRegions: [level24DustField],
  maxBombs: 8,
  timeLimit: 18,
  star3Score: 5800,
  star2Score: 4000,
};
