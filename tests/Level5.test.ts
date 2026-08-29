import { describe, expect, it } from "vitest";
import { findLevel, levels, nextLevel } from "../src/level/LevelCatalog";
import { LOGICAL_WIDTH } from "../src/level/LevelDefinition";
import { level1 } from "../src/level/level1";
import { level4 } from "../src/level/level4";
import { level5 } from "../src/level/level5";
import { level6 } from "../src/level/level6";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

const CENTER_X = LOGICAL_WIDTH * 0.5;

describe("level 5 catalog", () => {
  it("is registered after sector four and stays unlocked", () => {
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
    expect(findLevel("level-5")).toBe(level5);
    expect(nextLevel(level4.id)).toBe(level5);
    expect(nextLevel(level5.id)).toBe(level6);
  });

  it("uses a slightly taller map with a centered self-closed circle", () => {
    const [goal] = level5.goals;
    const first = level1.goals[0];
    expect(level5.worldHeight).toBeGreaterThan(level1.worldHeight);
    expect(level5.worldHeight).toBeLessThan(level1.worldHeight * 1.2);
    expect(level5.goals).toHaveLength(1);
    expect(goal?.closeEdges).toEqual([]);
    expect(goal?.curve).toHaveLength(1);
    expect(goal?.curve[0]?.kind).toBe("arc");
    if (goal && first?.curve[0]?.kind === "arc" && goal.curve[0]?.kind === "arc") {
      const diameter = goal.curve[0].radius * 2;
      expect(diameter).toBeCloseTo((first.curve[0].to.x - first.start.x) / 4, 5);
      expect(goal.start.x).toBeCloseTo(CENTER_X);
      expect(goal.curve[0].cy).toBeGreaterThan(0);
      expect(goal.curve[0].cy + goal.curve[0].radius).toBeLessThan(200);
    }
  });
});

describe("level 5 reachability", () => {
  it("can finish by flying straight through the circle", () => {
    const sim = new GameSimulation(level5);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    const limit = Math.ceil((level5.timeLimit + 1) / FIXED_DT);
    for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
      sim.updateFixed(FIXED_DT);
    }
    expect(sim.state.phase).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level5.goals, level5.worldHeight)).toBe(true);
  });

  it("times out in the gap above if a side blast makes the ship graze past the circle", () => {
    const sim = flyWithBlast(250, 200);
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("timeout");
    expect(sim.state.ship.position.y).toBeLessThan(80);
    expect(Math.abs(sim.state.ship.position.x - CENTER_X)).toBeGreaterThan(40);
  });
});

function flyWithBlast(bombX: number, bombY: number): GameSimulation {
  const sim = new GameSimulation(level5);
  sim.enqueue({ type: "place", x: bombX, y: bombY });
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const limit = Math.ceil((level5.timeLimit + 1) / FIXED_DT);
  let detonated = false;
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    if (!detonated && sim.state.ship.position.y <= bombY + 2) {
      sim.enqueue({ type: "detonate", id: "b1" });
      detonated = true;
    }
    sim.updateFixed(FIXED_DT);
  }
  return sim;
}
