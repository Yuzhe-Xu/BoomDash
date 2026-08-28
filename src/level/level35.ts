import { circleRegion, ringSegmentRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type DustRegion,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL35_CENTER = { x: LOGICAL_WIDTH * 0.5, y: 430 };
export const LEVEL35_PLANET_RADIUS = 58;
export const LEVEL35_ASTEROID_INNER_RADIUS = 88;
export const LEVEL35_ASTEROID_OUTER_RADIUS = 116;
export const LEVEL35_DUST_INNER_RADIUS = 132;
export const LEVEL35_DUST_OUTER_RADIUS = 162;

export const level35Planet: PlanetDefinition = {
  id: "planet-ring-core",
  center: LEVEL35_CENTER,
  radius: LEVEL35_PLANET_RADIUS,
  gravitationalParameter: 150000,
  appearance: "rocky",
};

export const level35AsteroidRing = ringSegmentRegion(
  "asteroid-planet-ring",
  LEVEL35_CENTER.x,
  LEVEL35_CENTER.y,
  LEVEL35_ASTEROID_INNER_RADIUS,
  LEVEL35_ASTEROID_OUTER_RADIUS,
  0,
  Math.PI * 2,
);

export const level35DustRing: DustRegion = {
  ...ringSegmentRegion(
    "dust-outer-planet-ring",
    LEVEL35_CENTER.x,
    LEVEL35_CENTER.y,
    LEVEL35_DUST_INNER_RADIUS,
    LEVEL35_DUST_OUTER_RADIUS,
    0,
    Math.PI * 2,
  ),
  dragPerSecond: 0.22,
};

export const level35: LevelDefinition = {
  id: "level-35",
  name: "SECTOR 35",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [circleRegion("goal-above-planet-ring", LEVEL35_CENTER.x, 92, 38)],
  hazards: [level35AsteroidRing],
  planets: [level35Planet],
  dustRegions: [level35DustRing],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 100,
  launchVelocity: -55,
  timeLimit: 22,
  star3Score: 5700,
  star2Score: 3900,
  shipRadius: 14,
  speedCap: 900,
};
