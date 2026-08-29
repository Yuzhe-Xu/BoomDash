import { roundedRectCentered } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL40_CORE_CENTER = { x: 195, y: 438 };
export const LEVEL40_CORE_RADIUS = 58;
export const LEVEL40_ORBIT_RADIUS = 220;

export const level40CorePlanet: PlanetDefinition = {
  id: "planet-orbit-core",
  center: LEVEL40_CORE_CENTER,
  radius: LEVEL40_CORE_RADIUS,
  gravitationalParameter: 860000,
  appearance: "rocky",
};

export const level40OrbitingPlanet: PlanetDefinition = {
  id: "planet-counterclockwise-scout",
  center: {
    x: LEVEL40_CORE_CENTER.x + LEVEL40_ORBIT_RADIUS * Math.cos(-1.13),
    y: LEVEL40_CORE_CENTER.y + LEVEL40_ORBIT_RADIUS * Math.sin(-1.13),
  },
  radius: 27,
  gravitationalParameter: 180000,
  appearance: "rocky",
  motion: {
    center: LEVEL40_CORE_CENTER,
    angularVelocity: -0.24,
  },
};

export const level40: LevelDefinition = {
  id: "level-40",
  name: "SECTOR 40",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectCentered("goal-above-orbit-core", 195, 112, 80, 35, 16)],
  hazards: [],
  planets: [level40CorePlanet, level40OrbitingPlanet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 21,
  star3Score: 5600,
  star2Score: 3800,
  shipRadius: 14,
  speedCap: 900,
};
