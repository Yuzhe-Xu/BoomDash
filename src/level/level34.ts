import { circleRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const level34Planet: PlanetDefinition = {
  id: "planet-well",
  center: { x: LOGICAL_WIDTH * 0.5, y: 292 },
  radius: 64,
  gravitationalParameter: 1100000,
  appearance: "rocky",
};

export const level34: LevelDefinition = {
  id: "level-34",
  name: "SECTOR 34",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [circleRegion("goal-above-planet", LOGICAL_WIDTH * 0.5, 90, 40)],
  hazards: [],
  planets: [level34Planet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 18,
  star3Score: 5600,
  star2Score: 4000,
  shipRadius: 14,
  speedCap: 900,
};
