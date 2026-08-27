import { describe, expect, it } from "vitest";
import { level1 } from "../src/level/level1";
import { evaluateLifecycle, isInsideGoal, pointInLowerEllipse } from "../src/simulation/LifecycleBounds";
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
