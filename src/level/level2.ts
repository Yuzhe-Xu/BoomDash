import { type LevelDefinition } from "./LevelDefinition";

export const level2: LevelDefinition = {
  id: "level-2",
  name: "SECTOR 02",
  worldHeight: 1688,
  start: {
    cx: 195,
    cy: 1654,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goal: {
    cx: 195,
    cy: 34,
    rx: 125,
    ry: 58,
    arc: "lower",
  },
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 24,
  star3Time: 11,
  star2Time: 17,
  shipRadius: 14,
  speedCap: 900,
};
