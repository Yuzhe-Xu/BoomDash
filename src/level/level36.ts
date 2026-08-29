import { circleRegion, ringSegmentRegion } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type HazardRegion,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const LEVEL36_PLANET_CENTER = { x: LOGICAL_WIDTH * 0.5, y: 270 };
export const LEVEL36_GOAL_CENTER = { x: LOGICAL_WIDTH * 0.5, y: 382 };
export const LEVEL36_PLANET_RADIUS = 52;
export const LEVEL36_ASTEROID_INNER_RADIUS = 72;
export const LEVEL36_ASTEROID_OUTER_RADIUS = 102;

export const level36Planet: PlanetDefinition = {
  id: "planet-upper-gate",
  center: LEVEL36_PLANET_CENTER,
  radius: LEVEL36_PLANET_RADIUS,
  gravitationalParameter: 720000,
  appearance: "rocky",
};

// The open upper half leaves a narrow approach between the planet and the goal.
export const level36AsteroidCup: HazardRegion = ringSegmentRegion(
  "asteroid-goal-cup",
  LEVEL36_GOAL_CENTER.x,
  LEVEL36_GOAL_CENTER.y,
  LEVEL36_ASTEROID_INNER_RADIUS,
  LEVEL36_ASTEROID_OUTER_RADIUS,
  0.2,
  Math.PI - 0.2,
);

export const level36: LevelDefinition = {
  id: "level-36",
  name: "SECTOR 36",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [circleRegion("goal-between-planet-and-cup", LEVEL36_GOAL_CENTER.x, LEVEL36_GOAL_CENTER.y, 36)],
  hazards: [level36AsteroidCup],
  planets: [level36Planet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 20,
  star3Score: 5500,
  star2Score: 3700,
  shipRadius: 14,
  speedCap: 900,
};
