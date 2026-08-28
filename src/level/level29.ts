import { circleRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type DustRegion,
  type HazardMotion,
  type HazardRegion,
  type LevelDefinition,
} from "./LevelDefinition";

export const LEVEL29_CENTER = { x: LOGICAL_WIDTH / 2, y: 250 };
export const LEVEL29_DUST_RADIUS = 165;
export const LEVEL29_ORBIT_RADIUS = 300;
export const LEVEL29_ASTEROID_RADIUS = 28;
export const LEVEL29_ASTEROID_START_ANGLE = 2.1;
export const LEVEL29_ORBIT_MIN_ANGLE = 0.71;
export const LEVEL29_ORBIT_MAX_ANGLE = 2.43;

export const level29Dust: DustRegion = {
  ...circleRegion("dust-goal-field", LEVEL29_CENTER.x, LEVEL29_CENTER.y, LEVEL29_DUST_RADIUS),
  dragPerSecond: 0.5,
};

export const level29MovingAsteroid: HazardRegion = circleRegion(
  "asteroid-arc-runner",
  LEVEL29_CENTER.x + LEVEL29_ORBIT_RADIUS * Math.cos(LEVEL29_ASTEROID_START_ANGLE),
  LEVEL29_CENTER.y + LEVEL29_ORBIT_RADIUS * Math.sin(LEVEL29_ASTEROID_START_ANGLE),
  LEVEL29_ASTEROID_RADIUS,
);

export const level29HazardMotion: HazardMotion = {
  center: LEVEL29_CENTER,
  angularVelocity: -0.16,
  angleRange: {
    min: LEVEL29_ORBIT_MIN_ANGLE - LEVEL29_ASTEROID_START_ANGLE,
    max: LEVEL29_ORBIT_MAX_ANGLE - LEVEL29_ASTEROID_START_ANGLE,
    mode: "wrap",
  },
};

export const level29: LevelDefinition = {
  id: "level-29",
  name: "SECTOR 29",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH / 2,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [circleRegion("goal-dust-center", LEVEL29_CENTER.x, LEVEL29_CENTER.y, 38)],
  hazards: [level29MovingAsteroid],
  hazardMotion: level29HazardMotion,
  dustRegions: [level29Dust],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 18,
  star3Score: 5000,
  star2Score: 3300,
  shipRadius: 14,
  speedCap: 900,
};
