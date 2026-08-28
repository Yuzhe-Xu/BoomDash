import { roundedRectRegion } from "./GoalGeometry";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, type HazardRegion, type LevelDefinition } from "./LevelDefinition";

export const LEVEL17_WORLD_HEIGHT = LOGICAL_HEIGHT;

const columnXs = [47, 167, 287];
const rowYs = [323, 483];

export const level17Asteroids: HazardRegion[] = rowYs.flatMap((y, row) =>
  columnXs.map((x, column) =>
    roundedRectRegion(`asteroid-grid-${row + 1}-${column + 1}`, x, y, 56, 58, 10),
  ),
);

export const level17: LevelDefinition = {
  id: "level-17",
  name: "SECTOR 17",
  worldHeight: LEVEL17_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL17_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectRegion("goal-top-center", 151, 155, 88, 68, 16)],
  hazards: level17Asteroids,
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
