import { cornerQuarterCircle, roundedRectCentered, triangleRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type HazardMotion,
  type HazardRegion,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL50_CORE_CENTER = { x: LOGICAL_WIDTH * 0.5, y: 395 };
export const LEVEL50_CORE_RADIUS = 51;

export const level50Planet: PlanetDefinition = {
  id: "planet-rotating-asteroid-core",
  center: LEVEL50_CORE_CENTER,
  radius: LEVEL50_CORE_RADIUS,
  gravitationalParameter: 700000,
  appearance: "rocky",
};

export const level50HazardMotion: HazardMotion = {
  center: LEVEL50_CORE_CENTER,
  angularVelocity: -0.1,
};

export const level50RotatingHazards: HazardRegion[] = [
  {
    ...triangleRegion(
      "asteroid-rotating-north",
      { x: 195, y: 254 },
      { x: 160, y: 355 },
      { x: 230, y: 355 },
    ),
    motion: level50HazardMotion,
  },
  {
    ...triangleRegion(
      "asteroid-rotating-east",
      { x: 336, y: 395 },
      { x: 235, y: 360 },
      { x: 235, y: 430 },
    ),
    motion: level50HazardMotion,
  },
  {
    ...triangleRegion(
      "asteroid-rotating-south",
      { x: 195, y: 536 },
      { x: 160, y: 435 },
      { x: 230, y: 435 },
    ),
    motion: level50HazardMotion,
  },
  {
    ...triangleRegion(
      "asteroid-rotating-west",
      { x: 54, y: 395 },
      { x: 155, y: 360 },
      { x: 155, y: 430 },
    ),
    motion: level50HazardMotion,
  },
  { ...roundedRectCentered("asteroid-left-rotating-gate", 48, 570, 30, 27, 9), motion: null },
  { ...roundedRectCentered("asteroid-right-rotating-gate", 342, 570, 30, 27, 9), motion: null },
];

export const level50: LevelDefinition = {
  id: "level-50",
  name: "SECTOR 50",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [
    cornerQuarterCircle("goal-top-left-rotating-gate", "top-left", 112),
    cornerQuarterCircle("goal-top-right-rotating-gate", "top-right", 112),
  ],
  hazards: level50RotatingHazards,
  hazardMotion: level50HazardMotion,
  planets: [level50Planet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 175,
  launchVelocity: -55,
  timeLimit: 25,
  star3Score: 5000,
  star2Score: 3200,
  shipRadius: 14,
  speedCap: 900,
};
