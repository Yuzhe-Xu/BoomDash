import { roundedRectCentered } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL42_ORBIT_CENTER = { x: 195, y: 428 };
export const LEVEL42_ORBIT_RADIUS = 198;

export const level42LeftPlanet: PlanetDefinition = {
  id: "planet-left-rising-orbit",
  center: {
    x: LEVEL42_ORBIT_CENTER.x + LEVEL42_ORBIT_RADIUS * Math.cos(2.27),
    y: LEVEL42_ORBIT_CENTER.y + LEVEL42_ORBIT_RADIUS * Math.sin(2.27),
  },
  radius: 31,
  gravitationalParameter: 180000,
  appearance: "rocky",
  motion: {
    center: LEVEL42_ORBIT_CENTER,
    angularVelocity: 0.24,
  },
};

export const level42RightPlanet: PlanetDefinition = {
  id: "planet-right-falling-orbit",
  center: {
    x: LEVEL42_ORBIT_CENTER.x + LEVEL42_ORBIT_RADIUS * Math.cos(-0.87),
    y: LEVEL42_ORBIT_CENTER.y + LEVEL42_ORBIT_RADIUS * Math.sin(-0.87),
  },
  radius: 31,
  gravitationalParameter: 180000,
  appearance: "rocky",
  motion: {
    center: LEVEL42_ORBIT_CENTER,
    angularVelocity: 0.24,
  },
};

export const level42: LevelDefinition = {
  id: "level-42",
  name: "SECTOR 42",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectCentered("goal-crossing-orbits", 195, 110, 82, 35, 16)],
  hazards: [],
  planets: [level42LeftPlanet, level42RightPlanet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 21,
  star3Score: 5500,
  star2Score: 3700,
  shipRadius: 14,
  speedCap: 900,
};
