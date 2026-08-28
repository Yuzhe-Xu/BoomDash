import { ringSegmentRegion } from "./GoalGeometry";
import type { DustRegion, HazardMotion, LevelDefinition } from "./LevelDefinition";
import { level26, level26HazardMotion } from "./level26";

const DUST_SEGMENT_STARTS = [0.495, 1.045, 1.595, 2.145];

export const level28DustSegments: DustRegion[] = DUST_SEGMENT_STARTS.map((start, index) => ({
  ...ringSegmentRegion(
    `dust-rotating-outer-ring-${index + 1}`,
    level26HazardMotion.center.x,
    level26HazardMotion.center.y,
    225,
    260,
    start,
    start + 0.4,
  ),
  dragPerSecond: 0.2,
}));

export const level28HazardMotion: HazardMotion = {
  ...level26HazardMotion,
  angularVelocity: -0.17,
};

export const level28DustMotion: HazardMotion = {
  center: level26HazardMotion.center,
  angularVelocity: -0.1,
};

export const level28: LevelDefinition = {
  ...level26,
  id: "level-28",
  name: "SECTOR 28",
  hazardMotion: level28HazardMotion,
  dustRegions: level28DustSegments,
  dustMotion: level28DustMotion,
  timeLimit: 18,
  star3Score: 5200,
  star2Score: 3500,
};
