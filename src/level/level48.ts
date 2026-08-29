import { circleRegion, roundedRectCentered } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type DustRegion,
  type HazardRegion,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const level48DustField: DustRegion = {
  ...roundedRectCentered("dust-full-sector", LOGICAL_WIDTH * 0.5, LOGICAL_HEIGHT * 0.5, LOGICAL_WIDTH * 0.5, LOGICAL_HEIGHT * 0.5, 0),
  dragPerSecond: 0.08,
};

export const level48UpperPlanet: PlanetDefinition = {
  id: "planet-upper-dust-well",
  center: { x: 195, y: 300 },
  radius: 50,
  gravitationalParameter: 420000,
  appearance: "rocky",
};

export const level48LowerPlanet: PlanetDefinition = {
  id: "planet-lower-dust-well",
  center: { x: 195, y: 700 },
  radius: 52,
  gravitationalParameter: 500000,
  appearance: "rocky",
};

export const level48Hazards: HazardRegion[] = [
  roundedRectCentered("asteroid-upper-left", 90, 390, 30, 38, 12),
  roundedRectCentered("asteroid-upper-right", 300, 390, 30, 38, 12),
  roundedRectCentered("asteroid-lower-left", 90, 790, 30, 38, 12),
  roundedRectCentered("asteroid-lower-right", 300, 790, 30, 38, 12),
];

export const level48: LevelDefinition = {
  id: "level-48",
  name: "SECTOR 48",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [circleRegion("goal-top-dust-beacon", 195, 72, 40)],
  hazards: level48Hazards,
  planets: [level48UpperPlanet, level48LowerPlanet],
  dustRegions: [level48DustField],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 180,
  launchVelocity: -55,
  timeLimit: 25,
  star3Score: 4900,
  star2Score: 3100,
  shipRadius: 14,
  speedCap: 900,
};
