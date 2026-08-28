import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { level18 } from "../src/level/level18";
import { level19, level19Asteroids } from "../src/level/level19";
import { level20, level20Asteroids } from "../src/level/level20";
import { level21 } from "../src/level/level21";
import type { LevelDefinition } from "../src/level/LevelDefinition";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal, isInsideAnyHazard } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("levels 19-20 catalog and geometry", () => {
  it("appends both sectors in stable order without locks", () => {
    expect(findLevel(level19.id)).toBe(level19);
    expect(findLevel(level20.id)).toBe(level20);
    expect(nextLevel(level18.id)).toBe(level19);
    expect(nextLevel(level19.id)).toBe(level20);
    expect(nextLevel(level20.id)).toBe(level21);
  });

  it("builds sector nineteen as three aligned rows of four circular asteroids", () => {
    const centers = level19Asteroids.map(regionCenter);

    expect(level19.worldHeight).toBe(844);
    expect(level19.maxBombs).toBe(8);
    expect(level19Asteroids).toHaveLength(12);
    expect(new Set(centers.map((center) => center.x))).toHaveProperty("size", 4);
    expect(new Set(centers.map((center) => center.y))).toHaveProperty("size", 3);
    expect(level19Asteroids.every(isCircle)).toBe(true);
  });

  it("builds sector twenty as staggered rows of three, four, and three circles", () => {
    const rowYs = [...new Set(level20Asteroids.map((asteroid) => regionCenter(asteroid).y))];

    expect(level20.worldHeight).toBe(844);
    expect(level20.maxBombs).toBe(8);
    expect(level20Asteroids).toHaveLength(10);
    expect(
      rowYs.map(
        (y) => level20Asteroids.filter((asteroid) => regionCenter(asteroid).y === y).length,
      ),
    ).toEqual([3, 4, 3]);
    expect(level20Asteroids.every(isCircle)).toBe(true);
  });
});

describe("levels 19-20 routes", () => {
  it.each([
    [level19, level19Asteroids.slice(8, 12)],
    [level20, [level20Asteroids[8]]],
  ])("rejects a straight flight through %s", (level, expectedHazards) => {
    const sim = new GameSimulation(level);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim, level);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, expectedHazards, level.worldHeight)).toBe(true);
  });

  it("crosses sector nineteen through a side lane and returns to the goal", () => {
    const sim = flyWithBlasts(level19, [
      { x: 252, y: 700 },
      { x: 40, y: 535 },
      { x: 52, y: 320 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level19.goals, level19.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(3);
  });

  it("weaves sector twenty through the alternating gaps", () => {
    const sim = flyWithBlasts(level20, [
      { x: 260, y: 700 },
      { x: 88, y: 530 },
      { x: 235, y: 435 },
      { x: 100, y: 310 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level20.goals, level20.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(4);
  });
});

type Bomb = { x: number; y: number };

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
      if (!bomb.done && sim.state.ship.position.y <= bomb.y) {
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

function regionCenter(region: (typeof level19Asteroids)[number]): { x: number; y: number } {
  const points = goalPolygon(region, 390, 844);
  return {
    x:
      (Math.min(...points.map((point) => point.x)) + Math.max(...points.map((point) => point.x))) /
      2,
    y:
      (Math.min(...points.map((point) => point.y)) + Math.max(...points.map((point) => point.y))) /
      2,
  };
}

function isCircle(region: (typeof level19Asteroids)[number]): boolean {
  return region.curve.length === 1 && region.curve[0].kind === "arc";
}

function expectPhaseToBeSuccess(sim: GameSimulation): void {
  expect(
    sim.state.phase,
    JSON.stringify({
      reason: sim.state.failReason,
      position: sim.state.ship.position,
      velocity: sim.state.ship.velocity,
    }),
  ).toBe("success");
}
