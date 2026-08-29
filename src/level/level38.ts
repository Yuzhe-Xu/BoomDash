import { circleRegion, roundedRectRegion, triangleRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type DustRegion,
  type HazardRegion,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const level38LeftPlanet: PlanetDefinition = {
  id: "planet-left-triangle-gate",
  center: { x: 84, y: 320 },
  radius: 52,
  gravitationalParameter: 760000,
  appearance: "rocky",
};

export const level38RightPlanet: PlanetDefinition = {
  id: "planet-right-triangle-gate",
  center: { x: 306, y: 320 },
  radius: 52,
  gravitationalParameter: 760000,
  appearance: "rocky",
};

export const level38Triangle: HazardRegion = triangleRegion(
  "asteroid-triangle",
  { x: 195, y: 404 },
  { x: 150, y: 535 },
  { x: 240, y: 535 },
);

export const level38DustField: DustRegion = {
  ...roundedRectRegion("dust-lower-bar", 90, 574, 210, 58, 10),
  dragPerSecond: 0.38,
};

export const level38: LevelDefinition = {
  id: "level-38",
  name: "SECTOR 38",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [circleRegion("goal-above-triangle-gate", LOGICAL_WIDTH * 0.5, 180, 40)],
  hazards: [level38Triangle],
  planets: [level38LeftPlanet, level38RightPlanet],
  dustRegions: [level38DustField],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 21,
  star3Score: 5400,
  star2Score: 3600,
  shipRadius: 14,
  speedCap: 900,
};
