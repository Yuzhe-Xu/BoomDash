import type { ZoneDefinition } from "../level/LevelDefinition";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from "../level/LevelDefinition";
import type { FailReason } from "../app/GamePhase";
import type { Ship } from "./GameState";
import type { Vec2 } from "./Vec2";

export type LifecycleResult =
  | { kind: "alive" }
  | { kind: "success" }
  | { kind: "failed"; reason: FailReason };

export function pointInLowerEllipse(
  x: number,
  y: number,
  zone: ZoneDefinition,
): boolean {
  const dx = (x - zone.cx) / zone.rx;
  const dy = (y - zone.cy) / zone.ry;
  return dx * dx + dy * dy <= 1 && dy >= 0;
}

export function isInsideGoal(ship: Ship, goal: ZoneDefinition): boolean {
  if (pointInLowerEllipse(ship.position.x, ship.position.y, goal)) {
    return true;
  }

  const expanded = {
    ...goal,
    rx: goal.rx + ship.radius,
    ry: goal.ry + ship.radius,
  };
  const dx = (ship.position.x - expanded.cx) / expanded.rx;
  const dy = (ship.position.y - expanded.cy) / expanded.ry;
  return dx * dx + dy * dy <= 1 && ship.position.y - goal.cy >= -ship.radius;
}

export function evaluateLifecycle(
  ship: Ship,
  goal: ZoneDefinition,
  elapsed: number,
  timeLimit: number,
): LifecycleResult {
  if (isInsideGoal(ship, goal)) {
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

  if (y - r > LOGICAL_HEIGHT) {
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

export function distanceToGoal(position: Vec2, goal: ZoneDefinition, shipRadius: number): number {
  const dist = Math.hypot(position.x - goal.cx, position.y - goal.cy);
  return Math.max(0, dist - goal.ry - shipRadius);
}

export function minSpeedToFinish(
  position: Vec2,
  goal: ZoneDefinition,
  shipRadius: number,
  elapsed: number,
  timeLimit: number,
): number {
  const dist = distanceToGoal(position, goal, shipRadius);
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
