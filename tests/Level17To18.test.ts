import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { level16 } from "../src/level/level16";
import { level17, level17Asteroids } from "../src/level/level17";
import { level18, level18LowerAsteroid, level18UpperAsteroid } from "../src/level/level18";
import { level19 } from "../src/level/level19";
import type { LevelDefinition } from "../src/level/LevelDefinition";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal, isInsideAnyHazard } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("levels 17-18 catalog and geometry", () => {
  it("appends both sectors in stable order without locks", () => {
    expect(findLevel(level17.id)).toBe(level17);
    expect(findLevel(level18.id)).toBe(level18);
    expect(nextLevel(level16.id)).toBe(level17);
    expect(nextLevel(level17.id)).toBe(level18);
    expect(nextLevel(level18.id)).toBe(level19);
  });

  it("builds sector seventeen as two aligned rows of three regular asteroids", () => {
    const asteroidBounds = level17Asteroids.map((asteroid) =>
      bounds(goalPolygon(asteroid, 390, level17.worldHeight)),
    );

    expect(level17.worldHeight).toBe(844);
    expect(level17.maxBombs).toBe(8);
    expect(level17Asteroids).toHaveLength(6);
    expect(new Set(asteroidBounds.map((box) => box.left))).toHaveProperty("size", 3);
    expect(new Set(asteroidBounds.map((box) => box.top))).toHaveProperty("size", 2);
    expect(asteroidBounds.every((box) => box.width === 56 && box.height === 58)).toBe(true);
    expect(Math.max(...asteroidBounds.map((box) => box.top))).toBeLessThan(level17.start.cy);
  });

  it("places sector eighteen's goal between two wide horizontal asteroid bars", () => {
    const goalBounds = bounds(goalPolygon(level18.goals[0], 390, level18.worldHeight));
    const upperBounds = bounds(goalPolygon(level18UpperAsteroid, 390, level18.worldHeight));
    const lowerBounds = bounds(goalPolygon(level18LowerAsteroid, 390, level18.worldHeight));

    expect(level18.worldHeight).toBe(844);
    expect(level18.maxBombs).toBe(8);
    expect(level18.hazards).toHaveLength(2);
    expect(upperBounds.bottom).toBeLessThan(goalBounds.top);
    expect(lowerBounds.top).toBeGreaterThan(goalBounds.bottom);
    expect(upperBounds.left).toBeLessThan(goalBounds.left);
    expect(upperBounds.right).toBeGreaterThan(goalBounds.right);
    expect(lowerBounds.left).toBeLessThan(goalBounds.left);
    expect(lowerBounds.right).toBeGreaterThan(goalBounds.right);
  });
});

describe("levels 17-18 routes", () => {
  it.each([
    [level17, [level17Asteroids[4]]],
    [level18, [level18LowerAsteroid]],
  ])("rejects a straight flight through %s", (level, expectedHazards) => {
    const sim = new GameSimulation(level);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim, level);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, expectedHazards, level.worldHeight)).toBe(true);
  });

  it("threads sector seventeen through a gap between asteroid columns", () => {
    const sim = flyWithBlasts(level17, [
      { x: 205, y: 725, trigger: "ascending-y", at: 720 },
      { x: 113, y: 655, trigger: "left-x", at: 130 },
      { x: 120, y: 260, trigger: "ascending-y", at: 260 },
    ]);

    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level17.goals, level17.worldHeight)).toBe(true);
    expect(sim.state.ship.position.x).toBeLessThan(195);
    expect(sim.state.usedBombs).toBe(3);
  });

  it("rounds sector eighteen's lower bar and enters the slot from the right", () => {
    const sim = flyWithBlasts(level18, [
      { x: 185, y: 705, trigger: "ascending-y", at: 700 },
      { x: 367, y: 539, trigger: "right-x", at: 350 },
      { x: 349, y: 393, trigger: "ascending-y", at: 405 },
      { x: 361, y: 405, trigger: "ascending-y", at: 405 },
    ]);

    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level18.goals, level18.worldHeight)).toBe(true);
    expect(sim.state.ship.position.x).toBeGreaterThan(235);
    expect(sim.state.usedBombs).toBe(4);
  });
});

type Trigger = "ascending-y" | "left-x" | "right-x";
type Bomb = { x: number; y: number; trigger: Trigger; at: number };

function flyWithBlasts(level: LevelDefinition, bombs: Bomb[]): GameSimulation {
  const sim = new GameSimulation(level);
  for (const bomb of bombs) {
    sim.enqueue({ type: "place", x: bomb.x, y: bomb.y });
  }
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const pending = bombs.map((bomb, index) => ({ ...bomb, id: `b${index + 1}`, done: false }));
  const limit = Math.ceil((level.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    for (const bomb of pending) {
      const reachedTrigger =
        (bomb.trigger === "ascending-y" && sim.state.ship.position.y <= bomb.at) ||
        (bomb.trigger === "left-x" && sim.state.ship.position.x <= bomb.at) ||
        (bomb.trigger === "right-x" && sim.state.ship.position.x >= bomb.at);
      if (!bomb.done && reachedTrigger) {
        sim.enqueue({ type: "detonate", id: bomb.id });
        bomb.done = true;
      }
    }
    sim.updateFixed(FIXED_DT);
  }
  return sim;
}

function runToEnd(sim: GameSimulation, level: LevelDefinition): void {
  const limit = Math.ceil((level.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    sim.updateFixed(FIXED_DT);
  }
}

function bounds(points: { x: number; y: number }[]): {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
} {
  const left = Math.min(...points.map((point) => point.x));
  const right = Math.max(...points.map((point) => point.x));
  const top = Math.min(...points.map((point) => point.y));
  const bottom = Math.max(...points.map((point) => point.y));
  return { left, right, top, bottom, width: right - left, height: bottom - top };
}
