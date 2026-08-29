import { circleRegion, roundedRectRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type DustRegion,
  type HazardMotion,
  type HazardRegion,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL39_CENTER = { x: 270, y: 510 };
export const LEVEL39_DUST_RADIUS = 220;
export const LEVEL39_ORBIT_RADIUS = 108;
export const LEVEL39_ASTEROID_RADIUS = 20;
export const LEVEL39_ASTEROID_START_ANGLE = Math.PI / 2;

export const level39Planet: PlanetDefinition = {
  id: "planet-dust-orbit",
  center: LEVEL39_CENTER,
  radius: 50,
  gravitationalParameter: 920000,
  appearance: "rocky",
};

export const level39DustField: DustRegion = {
  ...circleRegion("dust-planet-orbit", LEVEL39_CENTER.x, LEVEL39_CENTER.y, LEVEL39_DUST_RADIUS),
  dragPerSecond: 0.46,
};

export const level39MovingAsteroid: HazardRegion = circleRegion(
  "asteroid-orbiting-planet",
  LEVEL39_CENTER.x + LEVEL39_ORBIT_RADIUS * Math.cos(LEVEL39_ASTEROID_START_ANGLE),
  LEVEL39_CENTER.y + LEVEL39_ORBIT_RADIUS * Math.sin(LEVEL39_ASTEROID_START_ANGLE),
  LEVEL39_ASTEROID_RADIUS,
);

export const level39HazardMotion: HazardMotion = {
  center: LEVEL39_CENTER,
  angularVelocity: 0.22,
  initialAngle: 0,
  angleRange: {
    min: -Math.PI * 0.9,
    max: Math.PI * 0.9,
    mode: "wrap",
  },
};

export const level39: LevelDefinition = {
  id: "level-39",
  name: "SECTOR 39",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectRegion("goal-upper-right-platform", 238, 92, 124, 58, 16)],
  hazards: [level39MovingAsteroid],
  hazardMotion: level39HazardMotion,
  planets: [level39Planet],
  dustRegions: [level39DustField],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 24,
  star3Score: 5000,
  star2Score: 3300,
  shipRadius: 14,
  speedCap: 900,
};
