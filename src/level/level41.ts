import { roundedRectCentered } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL41_ORBIT_CENTER = { x: 195, y: 428 };
export const LEVEL41_ORBIT_RADIUS = 198;

export const level41LeftPlanet: PlanetDefinition = {
  id: "planet-left-converging-orbit",
  center: {
    x: LEVEL41_ORBIT_CENTER.x + LEVEL41_ORBIT_RADIUS * Math.cos(2.27),
    y: LEVEL41_ORBIT_CENTER.y + LEVEL41_ORBIT_RADIUS * Math.sin(2.27),
  },
  radius: 31,
  gravitationalParameter: 170000,
  appearance: "rocky",
  motion: {
    center: LEVEL41_ORBIT_CENTER,
    angularVelocity: 0.22,
  },
};

export const level41RightPlanet: PlanetDefinition = {
  id: "planet-right-converging-orbit",
  center: {
    x: LEVEL41_ORBIT_CENTER.x + LEVEL41_ORBIT_RADIUS * Math.cos(0.87),
    y: LEVEL41_ORBIT_CENTER.y + LEVEL41_ORBIT_RADIUS * Math.sin(0.87),
  },
  radius: 31,
  gravitationalParameter: 170000,
  appearance: "rocky",
  motion: {
    center: LEVEL41_ORBIT_CENTER,
    angularVelocity: -0.22,
  },
};

export const level41: LevelDefinition = {
  id: "level-41",
  name: "SECTOR 41",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectCentered("goal-converging-orbits", 195, 110, 82, 35, 16)],
  hazards: [],
  planets: [level41LeftPlanet, level41RightPlanet],
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
