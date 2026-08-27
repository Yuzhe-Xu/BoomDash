import { circleHitsGoalRegion, distanceToPolygon, goalPolygon } from "../level/GoalGeometry";
import type { GoalRegion } from "../level/LevelDefinition";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from "../level/LevelDefinition";
import type { FailReason } from "../app/GamePhase";
import type { Ship } from "./GameState";
import type { Vec2 } from "./Vec2";

export type LifecycleResult =
  | { kind: "alive" }
  | { kind: "success" }
  | { kind: "failed"; reason: FailReason };

export function isInsideGoal(
  ship: Ship,
  region: GoalRegion,
  worldHeight = LOGICAL_HEIGHT,
): boolean {
  return circleHitsGoalRegion(
    ship.position.x,
    ship.position.y,
    ship.radius,
    region,
    LOGICAL_WIDTH,
    worldHeight,
  );
}

export function isInsideAnyGoal(
  ship: Ship,
  goals: GoalRegion[],
  worldHeight = LOGICAL_HEIGHT,
): boolean {
  return goals.some((region) => isInsideGoal(ship, region, worldHeight));
}

export function evaluateLifecycle(
  ship: Ship,
  goals: GoalRegion[],
  elapsed: number,
  timeLimit: number,
  worldHeight = LOGICAL_HEIGHT,
): LifecycleResult {
  if (isInsideAnyGoal(ship, goals, worldHeight)) {
    return { kind: "success" };
  }

  if (elapsed >= timeLimit) {
    return { kind: "failed", reason: "timeout" };
  }

  const { x, y } = ship.position;
  const r = ship.radius;

  if (x + r < 0 || x - r > LOGICAL_WIDTH) {
    return { kind: "failed", reason: "out-of-bounds" };
  }

  if (y - r > worldHeight) {
    return { kind: "failed", reason: "out-of-bounds" };
  }

  if (y + r < 0) {
    return { kind: "failed", reason: "overshoot" };
  }

  return { kind: "alive" };
}

export function flightProgress(shipY: number, startY: number, goalY: number): number {
  const span = startY - goalY;
  if (span <= 0) {
    return 0;
  }
  return clamp01((startY - shipY) / span);
}

export function distanceToGoal(
  position: Vec2,
  goals: GoalRegion[],
  shipRadius: number,
  worldHeight = LOGICAL_HEIGHT,
): number {
  let min = Number.POSITIVE_INFINITY;
  for (const region of goals) {
    const dist = distanceToPolygon(
      position.x,
      position.y,
      goalPolygon(region, LOGICAL_WIDTH, worldHeight),
    );
    min = Math.min(min, Math.max(0, dist - shipRadius));
  }
  return min;
}

export function minSpeedToFinish(
  position: Vec2,
  goals: GoalRegion[],
  shipRadius: number,
  elapsed: number,
  timeLimit: number,
  worldHeight = LOGICAL_HEIGHT,
): number {
  const dist = distanceToGoal(position, goals, shipRadius, worldHeight);
  if (dist <= 0) {
    return 0;
  }
  const remainingTime = timeLimit - elapsed;
  if (remainingTime <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return dist / remainingTime;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
