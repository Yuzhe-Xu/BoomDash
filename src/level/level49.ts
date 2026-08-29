import { roundedRectCentered } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type HazardRegion,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL49_ORBIT_CENTER = { x: LOGICAL_WIDTH * 0.5, y: 390 };
export const LEVEL49_ORBIT_RADIUS = 142;
export const LEVEL49_ORBIT_ANGULAR_VELOCITY = -0.2;

function orbitPosition(angle: number): { x: number; y: number } {
  return {
    x: LEVEL49_ORBIT_CENTER.x + LEVEL49_ORBIT_RADIUS * Math.cos(angle),
    y: LEVEL49_ORBIT_CENTER.y + LEVEL49_ORBIT_RADIUS * Math.sin(angle),
  };
}

export const level49TopPlanet: PlanetDefinition = {
  id: "planet-orbit-top",
  center: orbitPosition(-Math.PI / 2),
  radius: 31,
  gravitationalParameter: 240000,
  appearance: "rocky",
  motion: {
    center: LEVEL49_ORBIT_CENTER,
    angularVelocity: LEVEL49_ORBIT_ANGULAR_VELOCITY,
  },
};

export const level49LeftPlanet: PlanetDefinition = {
  id: "planet-orbit-left",
  center: orbitPosition((Math.PI * 3) / 4),
  radius: 30,
  gravitationalParameter: 230000,
  appearance: "rocky",
  motion: {
    center: LEVEL49_ORBIT_CENTER,
    angularVelocity: LEVEL49_ORBIT_ANGULAR_VELOCITY,
  },
};

export const level49RightPlanet: PlanetDefinition = {
  id: "planet-orbit-right",
  center: orbitPosition(Math.PI / 4),
  radius: 30,
  gravitationalParameter: 230000,
  appearance: "rocky",
  motion: {
    center: LEVEL49_ORBIT_CENTER,
    angularVelocity: LEVEL49_ORBIT_ANGULAR_VELOCITY,
  },
};

export const level49Hazards: HazardRegion[] = [
  roundedRectCentered("asteroid-left-orbit-wall", 61, 350, 61, 47, 15),
  roundedRectCentered("asteroid-right-orbit-wall", 329, 350, 61, 47, 15),
];

export const level49: LevelDefinition = {
  id: "level-49",
  name: "SECTOR 49",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [roundedRectCentered("goal-above-orbit", 195, 94, 48, 30, 14)],
  hazards: level49Hazards,
  planets: [level49TopPlanet, level49LeftPlanet, level49RightPlanet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 170,
  launchVelocity: -55,
  timeLimit: 24,
  star3Score: 5100,
  star2Score: 3300,
  shipRadius: 14,
  speedCap: 900,
};
