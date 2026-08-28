import { topClosedQuadraticGoal } from "./GoalGeometry";
import { LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL11_WORLD_HEIGHT = 1560;

export const level11LowerAsteroid: HazardRegion = {
  id: "asteroid-belt-lower-right",
  start: { x: 150, y: 1218 },
  curve: [
    {
      kind: "cubic",
      c1: { x: 196, y: 1172 },
      c2: { x: 310, y: 1170 },
      to: { x: 390, y: 1198 },
    },
    { kind: "line", to: { x: 390, y: 1288 } },
    {
      kind: "cubic",
      c1: { x: 296, y: 1260 },
      c2: { x: 198, y: 1264 },
      to: { x: 150, y: 1310 },
    },
    {
      kind: "cubic",
      c1: { x: 136, y: 1282 },
      c2: { x: 136, y: 1242 },
      to: { x: 150, y: 1218 },
    },
  ],
  closeEdges: [],
};

export const level11UpperAsteroid: HazardRegion = {
  id: "asteroid-belt-upper-left",
  start: { x: 0, y: 535 },
  curve: [
    {
      kind: "cubic",
      c1: { x: 86, y: 500 },
      c2: { x: 206, y: 508 },
      to: { x: 278, y: 550 },
    },
    {
      kind: "cubic",
      c1: { x: 292, y: 570 },
      c2: { x: 292, y: 616 },
      to: { x: 278, y: 635 },
    },
    {
      kind: "cubic",
      c1: { x: 204, y: 590 },
      c2: { x: 84, y: 586 },
      to: { x: 0, y: 625 },
    },
    { kind: "line", to: { x: 0, y: 535 } },
  ],
  closeEdges: [],
};

export const level11: LevelDefinition = {
  id: "level-11",
  name: "SECTOR 11",
  worldHeight: LEVEL11_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL11_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedQuadraticGoal("goal-top-right", 250, 360, 110)],
  hazards: [level11LowerAsteroid, level11UpperAsteroid],
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
