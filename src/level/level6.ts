import { roundedRectCentered, topClosedCircularArc } from "./GoalGeometry";
import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type HazardRegion,
  type LevelDefinition,
} from "./LevelDefinition";

export const level6AsteroidBelt: HazardRegion = roundedRectCentered(
  "asteroid-belt-center",
  LOGICAL_WIDTH * 0.5,
  438,
  110,
  55,
  55,
);

export const level6: LevelDefinition = {
  id: "level-6",
  name: "SECTOR 06",
  worldHeight: LOGICAL_HEIGHT,
  start: {
    cx: LOGICAL_WIDTH * 0.5,
    cy: 810,
    rx: 125,
    ry: 58,
    arc: "upper",
  },
  goals: [topClosedCircularArc("goal-top", 70, 320, 92)],
  hazards: [level6AsteroidBelt],
  maxBombs: 5,
  unlimitedBombs: false,
  blastRadius: 110,
  maxImpulse: 150,
  launchVelocity: -55,
  timeLimit: 15,
  star3Score: 6000,
  star2Score: 4400,
  shipRadius: 14,
  speedCap: 900,
};
