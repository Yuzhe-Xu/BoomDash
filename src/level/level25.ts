import { roundedRectRegion } from "./GoalGeometry";
import { type DustRegion, type LevelDefinition } from "./LevelDefinition";
import { level10 } from "./level10";

export const level25DustField: DustRegion = {
  ...roundedRectRegion("dust-between-asteroids", 0, 292, 390, 744, 18),
  dragPerSecond: 0.22,
};

export const level25: LevelDefinition = {
  ...level10,
  id: "level-25",
  name: "SECTOR 25",
  dustRegions: [level25DustField],
  maxBombs: 8,
  timeLimit: 34,
  star3Score: 5400,
  star2Score: 3700,
};
