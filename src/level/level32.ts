import { cornerQuarterCircle } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type LevelDefinition,
  type PlanetDefinition,
} from "./LevelDefinition";

export const level32Planet: PlanetDefinition = {
  id: "planet-corner-guard",
  center: { x: 292, y: 228 },
  radius: 50,
  gravitationalParameter: 980000,
  appearance: "rocky",
};

export const level32: LevelDefinition = {
  id: "level-32",
  name: "SECTOR 32",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [cornerQuarterCircle("goal-top-right", "top-right", 118)],
  hazards: [],
  planets: [level32Planet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 16,
  star3Score: 5200,
  star2Score: 3800,
  shipRadius: 14,
  speedCap: 900,
};
