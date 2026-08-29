import { cornerQuarterCircle, roundedRectCentered } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type DustRegion,
  type HazardRegion,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";
import { rotateRegion } from "./GoalGeometry";

const DIAGONAL_ANGLE = -0.62;

export const level46LowerAsteroid: HazardRegion = rotateRegion(
  roundedRectCentered("asteroid-lower-diagonal", 112, 930, 154, 34, 16),
  { x: 112, y: 930 },
  DIAGONAL_ANGLE,
);

export const level46UpperAsteroid: HazardRegion = rotateRegion(
  roundedRectCentered("asteroid-upper-diagonal", 282, 270, 142, 34, 16),
  { x: 282, y: 270 },
  DIAGONAL_ANGLE,
);

export const level46DiagonalDust: DustRegion = {
  ...rotateRegion(
    roundedRectCentered("dust-diagonal-bridge", 195, 600, 116, 38, 18),
    { x: 195, y: 600 },
    DIAGONAL_ANGLE,
  ),
  dragPerSecond: 0.32,
};

export const level46MovingPlanet: PlanetDefinition = {
  id: "planet-diagonal-crossing",
  center: { x: 58, y: 1090 },
  radius: 42,
  gravitationalParameter: 220000,
  appearance: "rocky",
  motion: {
    center: { x: 0, y: 0 },
    angularVelocity: 0,
    linearVelocity: { x: 15, y: -15 },
  },
};

export const level46: LevelDefinition = {
  id: "level-46",
  name: "SECTOR 46",
  worldHeight: LOGICAL_HEIGHT + 356,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 1160,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [cornerQuarterCircle("goal-bottom-left-diagonal", "top-left", 80)],
  hazards: [level46LowerAsteroid, level46UpperAsteroid],
  planets: [level46MovingPlanet],
  dustRegions: [level46DiagonalDust],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 180,
  launchVelocity: -55,
  timeLimit: 27,
  star3Score: 5000,
  star2Score: 3200,
  shipRadius: 14,
  speedCap: 900,
};
