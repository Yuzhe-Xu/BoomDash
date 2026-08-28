import { circleRegion, roundedRectRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type HazardRegion,
  type LevelDefinition,
} from "./LevelDefinition";

export const LEVEL20_WORLD_HEIGHT = LOGICAL_HEIGHT;

const rows = [
  { cy: 340, centers: [90, 195, 300] },
  { cy: 450, centers: [45, 145, 245, 345] },
  { cy: 560, centers: [90, 195, 300] },
];

export const level20Asteroids: HazardRegion[] = rows.flatMap((row, rowIndex) =>
  row.centers.map((cx, columnIndex) =>
    circleRegion(`asteroid-staggered-${rowIndex + 1}-${columnIndex + 1}`, cx, row.cy, 20),
  ),
);

export const level20: LevelDefinition = {
  id: "level-20",
  name: "SECTOR 20",
  worldHeight: LEVEL20_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL20_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectRegion("goal-top-center", 145, 145, 100, 75, 16)],
  hazards: level20Asteroids,
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 18,
  star3Score: 5400,
  star2Score: 3700,
  shipRadius: 14,
  speedCap: 900,
};
