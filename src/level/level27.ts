import { type LevelDefinition } from "./LevelDefinition";
import { level26 } from "./level26";

export const LEVEL27_WORLD_HEIGHT = 1200;

export const level27: LevelDefinition = {
  ...level26,
  id: "level-27",
  name: "SECTOR 27",
  worldHeight: LEVEL27_WORLD_HEIGHT,
  start: {
    ...level26.start,
    cy: LEVEL27_WORLD_HEIGHT - 34,
  },
  timeLimit: 24,
  star3Score: 5000,
  star2Score: 3400,
};
