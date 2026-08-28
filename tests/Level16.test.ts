import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { level15 } from "../src/level/level15";
import {
  level16,
  level16BottomAsteroid,
  level16OuterLeftAsteroid,
  level16RightAsteroid,
  level16TopAsteroid,
} from "../src/level/level16";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal, isInsideAnyHazard } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 16 catalog and geometry", () => {
  it("is appended after sector fifteen and remains directly playable", () => {
    expect(findLevel(level16.id)).toBe(level16);
    expect(nextLevel(level15.id)).toBe(level16);
    expect(nextLevel(level16.id)).toBeUndefined();
  });

  it("builds the sketched left-entry enclosure from regular rounded rectangles", () => {
    const [goal] = level16.goals;
    const goalBounds = bounds(goalPolygon(goal, 390, level16.worldHeight));
    const outerLeftBounds = bounds(goalPolygon(level16OuterLeftAsteroid, 390, level16.worldHeight));
    const bottomBounds = bounds(goalPolygon(level16BottomAsteroid, 390, level16.worldHeight));
    const topBounds = bounds(goalPolygon(level16TopAsteroid, 390, level16.worldHeight));
    const rightBounds = bounds(goalPolygon(level16RightAsteroid, 390, level16.worldHeight));

    expect(level16.worldHeight).toBe(844);
    expect(level16.maxBombs).toBe(8);
    expect(level16.goals).toHaveLength(1);
    expect(level16.hazards).toHaveLength(4);
    expect(outerLeftBounds.right).toBeLessThan(topBounds.left);
    expect(outerLeftBounds.bottom).toBe(bottomBounds.bottom);
    expect(bottomBounds.right).toBe(rightBounds.right);
    expect(topBounds.right).toBe(rightBounds.right);
    expect(goalBounds.left).toBeGreaterThan(outerLeftBounds.right);
    expect(goalBounds.top).toBeGreaterThanOrEqual(topBounds.bottom);
    expect(goalBounds.bottom).toBeLessThanOrEqual(bottomBounds.top);
    expect(goalBounds.right).toBeLessThanOrEqual(rightBounds.left);
  });
});

describe("level 16 left-entry route", () => {
  it("rejects a straight flight through the lower enclosure", () => {
    const sim = new GameSimulation(level16);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, [level16BottomAsteroid], level16.worldHeight)).toBe(true);
  });

  it("can go around the outer wall and enter the goal from the left", () => {
    const sim = flyWithTimedBlasts([
      { x: 202, y: 767, trigger: "ascending-y", at: 760 },
      { x: 26, y: 525, trigger: "ascending-y", at: 525 },
      { x: 51, y: 215, trigger: "ascending-y", at: 220 },
      { x: 43, y: 219, trigger: "ascending-y", at: 220 },
      { x: 138, y: 219, trigger: "right-x", at: 129 },
      { x: 130, y: 210, trigger: "right-x", at: 129 },
      { x: 102, y: 390, trigger: "descending-y", at: 390 },
    ]);

    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level16.goals, level16.worldHeight)).toBe(true);
    expect(sim.state.ship.position.x).toBeLessThan(level16.goals[0].start.x);
    expect(sim.state.usedBombs).toBe(7);
  });
});

type Bomb = {
  x: number;
  y: number;
  trigger: "ascending-y" | "right-x" | "descending-y";
  at: number;
};

function flyWithTimedBlasts(bombs: Bomb[]): GameSimulation {
  const sim = new GameSimulation(level16);
  for (const bomb of bombs) {
    sim.enqueue({ type: "place", x: bomb.x, y: bomb.y });
  }
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const pending = bombs.map((bomb, index) => ({ ...bomb, id: `b${index + 1}`, done: false }));
  const limit = Math.ceil((level16.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    for (const bomb of pending) {
      const reachedTrigger =
        (bomb.trigger === "ascending-y" && sim.state.ship.position.y <= bomb.at) ||
        (bomb.trigger === "right-x" &&
          sim.state.ship.position.y < 250 &&
          sim.state.ship.position.x >= bomb.at) ||
        (bomb.trigger === "descending-y" &&
          sim.state.ship.velocity.y > 0 &&
          sim.state.ship.position.y >= bomb.at);
      if (!bomb.done && reachedTrigger) {
        sim.enqueue({ type: "detonate", id: bomb.id });
        bomb.done = true;
      }
    }
    sim.updateFixed(FIXED_DT);
  }
  return sim;
}

function runToEnd(sim: GameSimulation): void {
  const limit = Math.ceil((level16.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    sim.updateFixed(FIXED_DT);
  }
}

function bounds(points: { x: number; y: number }[]): {
  left: number;
  right: number;
  top: number;
  bottom: number;
} {
  return {
    left: Math.min(...points.map((point) => point.x)),
    right: Math.max(...points.map((point) => point.x)),
    top: Math.min(...points.map((point) => point.y)),
    bottom: Math.max(...points.map((point) => point.y)),
  };
}
