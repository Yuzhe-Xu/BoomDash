import { describe, expect, it } from "vitest";
import { level1 } from "../src/level/level1";
import {
  distanceToGoal,
  evaluateLifecycle,
  isInsideGoal,
  minSpeedToFinish,
  pointInLowerEllipse,
} from "../src/simulation/LifecycleBounds";
import type { Ship } from "../src/simulation/GameState";
import { vec2 } from "../src/simulation/Vec2";

function shipAt(x: number, y: number): Ship {
  return {
    position: vec2(x, y),
    prevPosition: vec2(x, y),
    velocity: vec2(0, 0),
    radius: 14,
  };
}

describe("GoalDetection", () => {
  it("accepts the lower half ellipse and rejects the upper half", () => {
    expect(pointInLowerEllipse(195, 50, level1.goal)).toBe(true);
    expect(pointInLowerEllipse(195, 10, level1.goal)).toBe(false);
    expect(pointInLowerEllipse(10, 50, level1.goal)).toBe(false);
  });

  it("succeeds when the ship enters the goal", () => {
    expect(isInsideGoal(shipAt(195, 50), level1.goal)).toBe(true);
    expect(evaluateLifecycle(shipAt(195, 50), level1.goal, 1, 15)).toEqual({ kind: "success" });
  });

  it("fails when leaving the sides or bottom", () => {
    expect(evaluateLifecycle(shipAt(-20, 400), level1.goal, 1, 15)).toEqual({
      kind: "failed",
      reason: "out-of-bounds",
    });
    expect(evaluateLifecycle(shipAt(410, 400), level1.goal, 1, 15)).toEqual({
      kind: "failed",
      reason: "out-of-bounds",
    });
    expect(evaluateLifecycle(shipAt(195, 870), level1.goal, 1, 15)).toEqual({
      kind: "failed",
      reason: "out-of-bounds",
    });
  });

  it("fails when crossing the top outside the goal", () => {
    expect(evaluateLifecycle(shipAt(20, -20), level1.goal, 1, 15)).toEqual({
      kind: "failed",
      reason: "overshoot",
    });
  });

  it("fails on timeout", () => {
    expect(evaluateLifecycle(shipAt(195, 400), level1.goal, 15, 15)).toEqual({
      kind: "failed",
      reason: "timeout",
    });
  });
});

describe("minSpeedToFinish", () => {
  it("is remaining distance over remaining time", () => {
    const ship = shipAt(level1.goal.cx, 400);
    const dist = distanceToGoal(ship.position, level1.goal, ship.radius);
    expect(minSpeedToFinish(ship.position, level1.goal, ship.radius, 5, 15)).toBeCloseTo(dist / 10);
  });

  it("is zero once the ship can reach the goal zone", () => {
    const ship = shipAt(195, 50);
    expect(distanceToGoal(ship.position, level1.goal, ship.radius)).toBe(0);
    expect(minSpeedToFinish(ship.position, level1.goal, ship.radius, 1, 15)).toBe(0);
  });

  it("is infinite after the time limit if still away from the goal", () => {
    const ship = shipAt(195, 400);
    expect(minSpeedToFinish(ship.position, level1.goal, ship.radius, 15, 15)).toBe(
      Number.POSITIVE_INFINITY,
    );
  });
});
