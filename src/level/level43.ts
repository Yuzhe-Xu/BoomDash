import { cornerQuarterCircle } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL43_CORE_CENTER = { x: 250, y: 452 };

export const level43CorePlanet: PlanetDefinition = {
  id: "planet-right-orbit-core",
  center: LEVEL43_CORE_CENTER,
  radius: 54,
  gravitationalParameter: 920000,
  appearance: "rocky",
};

export const level43LeftPlanet: PlanetDefinition = {
  id: "planet-left-inner-orbit",
  center: { x: 78, y: LEVEL43_CORE_CENTER.y },
  radius: 31,
  gravitationalParameter: 160000,
  appearance: "rocky",
  motion: {
    center: LEVEL43_CORE_CENTER,
    angularVelocity: -0.2,
  },
};

export const level43UpperPlanet: PlanetDefinition = {
  id: "planet-upper-right-outer-orbit",
  center: { x: 302, y: 230 },
  radius: 29,
  gravitationalParameter: 160000,
  appearance: "rocky",
  motion: {
    center: LEVEL43_CORE_CENTER,
    angularVelocity: -0.16,
  },
};

export const level43: LevelDefinition = {
  id: "level-43",
  name: "SECTOR 43",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [cornerQuarterCircle("goal-top-right-orbit-gate", "top-right", 106)],
  hazards: [],
  planets: [level43CorePlanet, level43LeftPlanet, level43UpperPlanet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 23,
  star3Score: 5300,
  star2Score: 3500,
  shipRadius: 14,
  speedCap: 900,
};
