import { circleRegion, roundedRectRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type HazardRegion,
  type LevelDefinition,
} from "./LevelDefinition";

export const LEVEL19_WORLD_HEIGHT = LOGICAL_HEIGHT;

const columnXs = [65, 160, 230, 325];
const rowYs = [350, 460, 570];

export const level19Asteroids: HazardRegion[] = rowYs.flatMap((cy, row) =>
  columnXs.map((cx, column) =>
    circleRegion(`asteroid-aligned-${row + 1}-${column + 1}`, cx, cy, 22),
  ),
);

export const level19: LevelDefinition = {
  id: "level-19",
  name: "SECTOR 19",
  worldHeight: LEVEL19_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL19_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectRegion("goal-top-center", 145, 145, 100, 75, 16)],
  hazards: level19Asteroids,
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 18,
  star3Score: 5600,
  star2Score: 3900,
  shipRadius: 14,
  speedCap: 900,
};
