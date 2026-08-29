import { circleRegion } from "./GoalGeometry";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, type LevelDefinition, type PlanetDefinition } from "./LevelDefinition";

export const level37LeftPlanet: PlanetDefinition = {
  id: "planet-left-gate",
  center: { x: 92, y: 402 },
  radius: 54,
  gravitationalParameter: 820000,
  appearance: "rocky",
};

export const level37RightPlanet: PlanetDefinition = {
  id: "planet-right-gate",
  center: { x: 298, y: 402 },
  radius: 54,
  gravitationalParameter: 820000,
  appearance: "rocky",
};

export const level37: LevelDefinition = {
  id: "level-37",
  name: "SECTOR 37",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [circleRegion("goal-double-planet-channel", LOGICAL_WIDTH * 0.5, 104, 40)],
  hazards: [],
  planets: [level37LeftPlanet, level37RightPlanet],
  dustRegions: [],
  maxBombs: 8,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 19,
  star3Score: 5700,
  star2Score: 3900,
  shipRadius: 14,
  speedCap: 900,
};
