import { describe, expect, it } from "vitest";
import { pointInGoalRegion, referenceGoalY } from "../src/level/GoalGeometry";
import { level1 } from "../src/level/level1";
import { level2 } from "../src/level/level2";
import { level3 } from "../src/level/level3";
import {
  distanceToGoal,
  evaluateLifecycle,
  isInsideAnyGoal,
  isInsideGoal,
  minSpeedToFinish,
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
  it("accepts the top-closed curve and rejects points beside it", () => {
    const [goal] = level1.goals;
    expect(pointInGoalRegion(195, 50, goal)).toBe(true);
    expect(pointInGoalRegion(195, 10, goal)).toBe(true);
    expect(pointInGoalRegion(10, 50, goal)).toBe(false);
  });

  it("succeeds when the ship enters the goal", () => {
    expect(isInsideGoal(shipAt(195, 50), level1.goals[0])).toBe(true);
    expect(evaluateLifecycle(shipAt(195, 50), level1.goals, 1, 15)).toEqual({ kind: "success" });
  });

  it("fails when leaving the sides or bottom", () => {
    expect(evaluateLifecycle(shipAt(-20, 400), level1.goals, 1, 15)).toEqual({
      kind: "failed",
      reason: "out-of-bounds",
    });
    expect(evaluateLifecycle(shipAt(410, 400), level1.goals, 1, 15)).toEqual({
      kind: "failed",
      reason: "out-of-bounds",
    });
    expect(evaluateLifecycle(shipAt(195, 870), level1.goals, 1, 15)).toEqual({
      kind: "failed",
      reason: "out-of-bounds",
    });
  });

  it("fails when crossing the top outside the goal", () => {
    expect(evaluateLifecycle(shipAt(20, -20), level1.goals, 1, 15)).toEqual({
      kind: "failed",
      reason: "overshoot",
    });
  });

  it("fails on timeout", () => {
    expect(evaluateLifecycle(shipAt(195, 400), level1.goals, 15, 15)).toEqual({
      kind: "failed",
      reason: "timeout",
    });
  });

  it("uses the configured world height for a tall sector", () => {
    expect(level2.worldHeight).toBe(1688);
    expect(level2.start.cy - referenceGoalY(level2.goals, 390, level2.worldHeight)).toBeGreaterThan(
      (level1.start.cy - referenceGoalY(level1.goals)) * 2,
    );
    expect(
      evaluateLifecycle(
        shipAt(195, level2.worldHeight + 20),
        level2.goals,
        1,
        level2.timeLimit,
        level2.worldHeight,
      ),
    ).toEqual({ kind: "failed", reason: "out-of-bounds" });
  });
});

describe("minSpeedToFinish", () => {
  it("is remaining distance over remaining time", () => {
    const ship = shipAt(195, 400);
    const dist = distanceToGoal(ship.position, level1.goals, ship.radius);
    expect(minSpeedToFinish(ship.position, level1.goals, ship.radius, 5, 15)).toBeCloseTo(dist / 10);
  });

  it("is zero once the ship can reach the goal zone", () => {
    const ship = shipAt(195, 50);
    expect(distanceToGoal(ship.position, level1.goals, ship.radius)).toBe(0);
    expect(minSpeedToFinish(ship.position, level1.goals, ship.radius, 1, 15)).toBe(0);
  });

  it("is infinite after the time limit if still away from the goal", () => {
    const ship = shipAt(195, 400);
    expect(minSpeedToFinish(ship.position, level1.goals, ship.radius, 15, 15)).toBe(
      Number.POSITIVE_INFINITY,
    );
  });
});

describe("multi-goal sectors", () => {
  it("treats either corner as success and the center gap as a miss", () => {
    expect(level3.goals).toHaveLength(2);
    expect(isInsideAnyGoal(shipAt(28, 24), level3.goals)).toBe(true);
    expect(isInsideAnyGoal(shipAt(362, 24), level3.goals)).toBe(true);
    expect(isInsideAnyGoal(shipAt(195, 20), level3.goals)).toBe(false);
    expect(evaluateLifecycle(shipAt(28, 24), level3.goals, 1, level3.timeLimit)).toEqual({
      kind: "success",
    });
    expect(evaluateLifecycle(shipAt(362, 24), level3.goals, 1, level3.timeLimit)).toEqual({
      kind: "success",
    });
    expect(evaluateLifecycle(shipAt(195, -20), level3.goals, 1, level3.timeLimit)).toEqual({
      kind: "failed",
      reason: "overshoot",
    });
  });
});
