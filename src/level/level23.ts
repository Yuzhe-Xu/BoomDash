import { roundedRectRegion } from "./GoalGeometry";
import { type DustRegion, type LevelDefinition } from "./LevelDefinition";
import { level6 } from "./level6";

export const level23DustBelt: DustRegion = {
  ...roundedRectRegion("dust-below-asteroid", 0, 530, 390, 108, 16),
  dragPerSecond: 0.38,
};

export const level23: LevelDefinition = {
  ...level6,
  id: "level-23",
  name: "SECTOR 23",
  dustRegions: [level23DustBelt],
  maxBombs: 8,
  timeLimit: 18,
  star3Score: 5900,
  star2Score: 4100,
};
