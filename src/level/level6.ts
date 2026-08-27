import { topClosedQuadraticGoal } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type HazardRegion,
  type LevelDefinition,
} from "./LevelDefinition";

export const level6AsteroidBelt: HazardRegion = {
  id: "asteroid-belt-center",
  start: { x: 76, y: 438 },
  curve: [
    {
      kind: "cubic",
      c1: { x: 88, y: 388 },
      c2: { x: 142, y: 365 },
      to: { x: 198, y: 382 },
    },
    {
      kind: "cubic",
      c1: { x: 254, y: 360 },
      c2: { x: 304, y: 389 },
      to: { x: 316, y: 438 },
    },
    {
      kind: "cubic",
      c1: { x: 303, y: 486 },
      c2: { x: 256, y: 512 },
      to: { x: 194, y: 493 },
    },
    {
      kind: "cubic",
      c1: { x: 137, y: 514 },
      c2: { x: 88, y: 486 },
      to: { x: 76, y: 438 },
    },
  ],
  closeEdges: [],
};

export const level6: LevelDefinition = {
  id: "level-6",
  name: "SECTOR 06",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedQuadraticGoal("goal-top", 70, 320, 92)],
  hazards: [level6AsteroidBelt],
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 15,
  star3Score: 6000,
  star2Score: 4400,
  shipRadius: 14,
  speedCap: 900,
};
