import { circleRegion } from "./GoalGeometry";
import {
  LOGICAL_WIDTH,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL44_ORBIT_CENTER = { x: LOGICAL_WIDTH * 0.5, y: 500 };
export const LEVEL44_INNER_ORBIT_RADIUS = 108;
export const LEVEL44_OUTER_ORBIT_RADIUS = 248;

export const level44InnerPlanet: PlanetDefinition = {
  id: "planet-inner-counterclockwise",
  center: {
    x: LEVEL44_ORBIT_CENTER.x,
    y: LEVEL44_ORBIT_CENTER.y - LEVEL44_INNER_ORBIT_RADIUS,
  },
  radius: 38,
  gravitationalParameter: 190000,
  appearance: "rocky",
  motion: {
    center: LEVEL44_ORBIT_CENTER,
    angularVelocity: -0.38,
  },
};

export const level44OuterPlanet: PlanetDefinition = {
  id: "planet-outer-counterclockwise",
  center: {
    x: LEVEL44_ORBIT_CENTER.x,
    y: LEVEL44_ORBIT_CENTER.y + LEVEL44_OUTER_ORBIT_RADIUS,
  },
  radius: 42,
  gravitationalParameter: 230000,
  appearance: "rocky",
  motion: {
    center: LEVEL44_ORBIT_CENTER,
    angularVelocity: -0.23,
  },
};

export const level44: LevelDefinition = {
  id: "level-44",
  name: "SECTOR 44",
  worldHeight: 1200,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 1160,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [circleRegion("goal-between-orbits", LEVEL44_ORBIT_CENTER.x, LEVEL44_ORBIT_CENTER.y, 34)],
  hazards: [],
  planets: [level44InnerPlanet, level44OuterPlanet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 26,
  star3Score: 5400,
  star2Score: 3600,
  shipRadius: 14,
  speedCap: 900,
};
