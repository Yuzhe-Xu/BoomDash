import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, levels, nextLevel } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level2 } from "../src/level/level2";
import { level6 } from "../src/level/level6";
import { level7 } from "../src/level/level7";
import { level8 } from "../src/level/level8";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal, isInsideAnyHazard } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 7 catalog", () => {
  it("is registered after sector six and stays unlocked", () => {
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
      "level-36",
      "level-37",
      "level-38",
      "level-39",
      "level-40",
      "level-41",
      "level-42",
      "level-43",
      "level-44",
      "level-45",
      "level-46",
      "level-47",
      "level-48",
    ]);
    expect(findLevel(level7.id)).toBe(level7);
    expect(nextLevel(level6.id)).toBe(level7);
    expect(nextLevel(level7.id)).toBe(level8);
  });

  it("uses a longer map with a centered top goal and two spaced center-axis belts", () => {
    const [lower, upper] = level7.hazards;
    const lowerPoly = goalPolygon(lower, 390, level7.worldHeight);
    const upperPoly = goalPolygon(upper, 390, level7.worldHeight);
    const lowerXs = lowerPoly.map((point) => point.x);
    const upperXs = upperPoly.map((point) => point.x);
    const lowerYs = lowerPoly.map((point) => point.y);
    const upperYs = upperPoly.map((point) => point.y);

    expect(level7.worldHeight).toBeGreaterThan(level1.worldHeight);
    expect(level7.worldHeight).toBeLessThan(level2.worldHeight);
    expect(level7.goals).toEqual(level1.goals);
    expect(level7.hazards).toHaveLength(2);
    expect(lower.closeEdges).toEqual([]);
    expect(upper.closeEdges).toEqual([]);
    expect((Math.min(...lowerXs) + Math.max(...lowerXs)) / 2).toBeCloseTo(195, 0);
    expect((Math.min(...upperXs) + Math.max(...upperXs)) / 2).toBeCloseTo(195, 0);
    expect(Math.min(...lowerYs)).toBeGreaterThan(Math.max(...upperYs) + 250);
    expect(Math.max(...lowerYs)).toBeLessThan(level7.start.cy);
    expect(Math.min(...upperYs)).toBeGreaterThan(90);
  });
});

describe("level 7 asteroid belts", () => {
  it("fails a straight flight when the ship enters the lower belt", () => {
    const sim = new GameSimulation(level7);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, level7.hazards, level7.worldHeight)).toBe(true);
  });

  it("can finish with two timed blasts along the left corridor", () => {
    const sim = flyWithBlasts([
      { x: 260, y: 1060 },
      { x: 10, y: 800 },
    ]);

    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level7.goals, level7.worldHeight)).toBe(true);
    expect(sim.state.ship.position.x).toBeLessThan(140);
  });
});

function flyWithBlasts(bombs: { x: number; y: number }[]): GameSimulation {
  const sim = new GameSimulation(level7);
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
  const limit = Math.ceil((level7.timeLimit + 1) / FIXED_DT);
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
  const limit = Math.ceil((level7.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    sim.updateFixed(FIXED_DT);
  }
}
