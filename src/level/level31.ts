import { LOGICAL_WIDTH, type LevelDefinition, type PlanetDefinition } from "./LevelDefinition";
import { level6 } from "./level6";

export const LEVEL31_PLANET_RADIUS = 55;
export const LEVEL31_GRAVITY = 900000;

export const level31Planet: PlanetDefinition = {
  id: "planet-center",
  center: { x: LOGICAL_WIDTH * 0.5, y: 438 },
  radius: LEVEL31_PLANET_RADIUS,
  gravitationalParameter: LEVEL31_GRAVITY,
  appearance: "rocky",
};

export const level31: LevelDefinition = {
  ...level6,
  id: "level-31",
  name: "SECTOR 31",
  hazards: [],
  planets: [level31Planet],
  maxBombs: 8,
  star3Score: 6000,
  star2Score: 5000,
};
