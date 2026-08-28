import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, levels, nextLevel } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level2 } from "../src/level/level2";
import { level4 } from "../src/level/level4";
import { level7 } from "../src/level/level7";
import { level9 } from "../src/level/level9";
import { level10, level10LowerAsteroid, level10UpperAsteroid } from "../src/level/level10";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal, isInsideAnyHazard } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 10 catalog", () => {
  it("is registered after sector nine and stays unlocked", () => {
    expect(levels.map((level) => level.id)).toEqual([
      "level-1",
      "level-2",
      "level-3",
      "level-4",
      "level-5",
      "level-6",
      "level-7",
      "level-8",
      "level-9",
      "level-10",
      "level-11",
      "level-12",
      "level-13",
      "level-14",
      "level-15",
      "level-16",
      "level-17",
      "level-18",
      "level-19",
      "level-20",
      "level-21",
      "level-22",
      "level-23",
      "level-24",
      "level-25",
      "level-26",
      "level-27",
      "level-28",
      "level-29",
      "level-30",
      "level-31",
      "level-32",
      "level-33",
      "level-34",
      "level-35",
    ]);
    expect(findLevel(level10.id)).toBe(level10);
    expect(nextLevel(level9.id)).toBe(level10);
    expect(nextLevel(level10.id)).toBeDefined();
    expect(nextLevel(level10.id)?.id).toBe("level-11");
  });

  it("uses a long map with staggered belts and a small right-biased top goal", () => {
    const [goal] = level10.goals;
    const [lower, upper] = level10.hazards;
    const first = level4.goals[0];
    const lowerPoly = goalPolygon(lower, 390, level10.worldHeight);
    const upperPoly = goalPolygon(upper, 390, level10.worldHeight);
    const lowerXs = lowerPoly.map((point) => point.x);
    const upperXs = upperPoly.map((point) => point.x);
    const lowerYs = lowerPoly.map((point) => point.y);
    const upperYs = upperPoly.map((point) => point.y);

    expect(level10.worldHeight).toBeGreaterThan(level7.worldHeight);
    expect(level10.worldHeight).toBeLessThan(level2.worldHeight);
    expect(level10.worldHeight).toBeGreaterThan(level1.worldHeight);
    expect(level10.goals).toHaveLength(1);
    expect(goal.closeEdges).toEqual(["top"]);
    expect(goal.curve[0]?.kind).toBe("arc");
    if (goal.curve[0]?.kind === "arc" && first?.curve[0]?.kind === "arc") {
      expect(goal.curve[0].to.x - goal.start.x).toBeCloseTo(first.curve[0].to.x - first.start.x, 0);
      expect(goal.curve[0].radius).toBeCloseTo(first.curve[0].radius, 0);
      expect((goal.start.x + goal.curve[0].to.x) / 2).toBeGreaterThan(195);
    }
    expect(level10.hazards).toHaveLength(2);
    expect(lower.closeEdges).toEqual([]);
    expect(upper.closeEdges).toEqual([]);
    expect((Math.min(...lowerXs) + Math.max(...lowerXs)) / 2).toBeGreaterThan(195);
    expect((Math.min(...upperXs) + Math.max(...upperXs)) / 2).toBeLessThan(195);
    expect(Math.min(...lowerYs)).toBeGreaterThan(Math.max(...upperYs) + 400);
    expect(Math.max(...lowerYs)).toBeLessThan(level10.start.cy);
    expect(Math.min(...upperYs)).toBeGreaterThan(150);
  });
});

describe("level 10 s-curve", () => {
  it("fails a straight flight when the ship enters the lower belt", () => {
    const sim = new GameSimulation(level10);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, [level10LowerAsteroid], level10.worldHeight)).toBe(true);
  });

  it("fails if a left dodge never turns back and clips the upper belt", () => {
    const sim = flyWithBlasts([{ x: 280, y: 1280 }]);
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, [level10UpperAsteroid], level10.worldHeight)).toBe(true);
    expect(sim.state.ship.position.x).toBeLessThan(120);
  });

  it("fails when the return blast is too late and hits the upper belt", () => {
    const sim = flyWithBlasts([
      { x: 285, y: 1300 },
      { x: 60, y: 240 },
    ]);
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, [level10UpperAsteroid], level10.worldHeight)).toBe(true);
  });

  it("can finish with two timed blasts along the s-curve into the right goal", () => {
    const sim = flyWithBlasts([
      { x: 285, y: 1300 },
      { x: 60, y: 500 },
    ]);
    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level10.goals, level10.worldHeight)).toBe(true);
    expect(sim.state.ship.position.x).toBeGreaterThan(240);
  });
});

function flyWithBlasts(bombs: { x: number; y: number }[]): GameSimulation {
  const sim = new GameSimulation(level10);
  for (const bomb of bombs) {
    sim.enqueue({ type: "place", x: bomb.x, y: bomb.y });
  }
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const pending = bombs.map((bomb, index) => ({
    id: `b${index + 1}`,
    y: bomb.y,
    done: false,
  }));
  const limit = Math.ceil((level10.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    for (const bomb of pending) {
      if (!bomb.done && sim.state.ship.position.y <= bomb.y + 2) {
        sim.enqueue({ type: "detonate", id: bomb.id });
        bomb.done = true;
      }
    }
    sim.updateFixed(FIXED_DT);
  }
  return sim;
}

function runToEnd(sim: GameSimulation): void {
  const limit = Math.ceil((level10.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    sim.updateFixed(FIXED_DT);
  }
}
