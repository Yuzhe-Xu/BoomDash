import { cornerQuarterCircle, roundedRectRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type DustRegion,
  type HazardRegion,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL47_WALL_X = 92;
export const LEVEL47_WALL_WIDTH = 34;

export const level47VerticalAsteroid: HazardRegion = roundedRectRegion(
  "asteroid-bottom-vertical-wall",
  LEVEL47_WALL_X,
  345,
  LEVEL47_WALL_WIDTH,
  LOGICAL_HEIGHT - 345,
  10,
);

export const level47VerticalDust: DustRegion = {
  ...roundedRectRegion("dust-top-vertical-column", LEVEL47_WALL_X, 0, LEVEL47_WALL_WIDTH, 345, 10),
  dragPerSecond: 0.3,
};

export const level47Planet: PlanetDefinition = {
  id: "planet-upper-right-sentinel",
  center: { x: 286, y: 170 },
  radius: 48,
  gravitationalParameter: 300000,
  appearance: "rocky",
};

export const level47: LevelDefinition = {
  id: "level-47",
  name: "SECTOR 47",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [cornerQuarterCircle("goal-bottom-left-wall-gate", "bottom-left", 92)],
  hazards: [level47VerticalAsteroid],
  planets: [level47Planet],
  dustRegions: [level47VerticalDust],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 180,
  launchVelocity: -55,
  timeLimit: 24,
  star3Score: 5100,
  star2Score: 3300,
  shipRadius: 14,
  speedCap: 900,
};
