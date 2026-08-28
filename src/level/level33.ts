import { cornerQuarterCircle } from "./GoalGeometry";
import { LOGICAL_WIDTH, type LevelDefinition, type PlanetDefinition } from "./LevelDefinition";

export const LEVEL33_WORLD_HEIGHT = 1200;

export const level33LowerPlanet: PlanetDefinition = {
  id: "planet-lower-right",
  center: { x: 272, y: 900 },
  radius: 54,
  gravitationalParameter: 760000,
  appearance: "rocky",
};

export const level33UpperPlanet: PlanetDefinition = {
  id: "planet-upper-left",
  center: { x: 118, y: 380 },
  radius: 50,
  gravitationalParameter: 720000,
  appearance: "rocky",
};

export const level33: LevelDefinition = {
  id: "level-33",
  name: "SECTOR 33",
  worldHeight: LEVEL33_WORLD_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: LEVEL33_WORLD_HEIGHT - 34,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [cornerQuarterCircle("goal-top-right", "top-right", 110)],
  hazards: [],
  planets: [level33LowerPlanet, level33UpperPlanet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 24,
  star3Score: 5800,
  star2Score: 4200,
  shipRadius: 14,
  speedCap: 900,
};
