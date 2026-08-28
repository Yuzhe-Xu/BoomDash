import { topClosedQuadraticGoal } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL13_WORLD_HEIGHT = 1560;

export const level13LowerAsteroid: HazardRegion = {
  id: "asteroid-belt-lower-right",
  start: { x: 92, y: 1218 },
  curve: [
    {
      kind: "cubic",
      c1: { x: 165, y: 1160 },
      c2: { x: 292, y: 1148 },
      to: { x: 390, y: 1188 },
    },
    { kind: "line", to: { x: 390, y: 1310 } },
    {
      kind: "cubic",
      c1: { x: 284, y: 1274 },
      c2: { x: 170, y: 1284 },
      to: { x: 92, y: 1340 },
    },
    {
      kind: "cubic",
      c1: { x: 76, y: 1308 },
      c2: { x: 76, y: 1250 },
      to: { x: 92, y: 1218 },
    },
  ],
  closeEdges: [],
};

export const level13UpperAsteroid: HazardRegion = {
  id: "asteroid-belt-upper-left",
  start: { x: 0, y: 520 },
  curve: [
    {
      kind: "cubic",
      c1: { x: 94, y: 474 },
      c2: { x: 222, y: 486 },
      to: { x: 300, y: 548 },
    },
    {
      kind: "cubic",
      c1: { x: 316, y: 580 },
      c2: { x: 316, y: 638 },
      to: { x: 300, y: 670 },
    },
    {
      kind: "cubic",
      c1: { x: 218, y: 610 },
      c2: { x: 92, y: 600 },
      to: { x: 0, y: 642 },
    },
    { kind: "line", to: { x: 0, y: 520 } },
  ],
  closeEdges: [],
};

export const level13: LevelDefinition = {
  id: "level-13",
  name: "SECTOR 13",
  worldHeight: LEVEL13_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL13_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedQuadraticGoal("goal-top-right", 250, 360, 110)],
  hazards: [level13LowerAsteroid, level13UpperAsteroid],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 31,
  star3Score: 5000,
  star2Score: 3400,
  shipRadius: 14,
  speedCap: 900,
};
