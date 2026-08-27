import { describe, expect, it } from "vitest";
import { findLevel, levels, nextLevel } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level2 } from "../src/level/level2";
import { level3 } from "../src/level/level3";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 3 catalog", () => {
  it("is registered after sector two and stays unlocked", () => {
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
    ]);
    expect(findLevel("level-3")).toBe(level3);
    expect(nextLevel(level2.id)).toBe(level3);
    expect(nextLevel(level3.id)?.id).toBe("level-4");
  });

  it("uses a first-sector-length map with two smaller corner goals", () => {
    expect(level3.worldHeight).toBe(level1.worldHeight);
    expect(level3.goals).toHaveLength(2);
    expect(level3.goals[0]?.closeEdges).toEqual(["left", "top"]);
    expect(level3.goals[1]?.closeEdges).toEqual(["right", "top"]);
    expect(level3.goals[0]?.start.x).toBeLessThan(100);
    expect(level3.goals[1]?.start.x).toBeGreaterThan(290);
  });
});

describe("level 3 reachability", () => {
  it("can finish through the left corner with one timed blast", () => {
    const sim = flyWithBlast(229, 120);
    expect(sim.state.phase).toBe("success");
    expect(sim.state.ship.position.x).toBeLessThan(120);
  });

  it("can finish through the right corner with one timed blast", () => {
    const sim = flyWithBlast(161, 120);
    expect(sim.state.phase).toBe("success");
    expect(sim.state.ship.position.x).toBeGreaterThan(270);
  });

  it("overshoots if the ship flies straight through the center gap", () => {
    const sim = new GameSimulation(level3);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    const limit = Math.ceil((level3.timeLimit + 1) / FIXED_DT);
    for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
      sim.updateFixed(FIXED_DT);
    }
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("overshoot");
  });
});

function flyWithBlast(bombX: number, bombY: number): GameSimulation {
  const sim = new GameSimulation(level3);
  sim.enqueue({ type: "place", x: bombX, y: bombY });
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const limit = Math.ceil((level3.timeLimit + 1) / FIXED_DT);
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
