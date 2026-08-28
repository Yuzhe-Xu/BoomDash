import { describe, expect, it } from "vitest";
import { findLevel, levels, nextLevel } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level3 } from "../src/level/level3";
import { level4 } from "../src/level/level4";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 4 catalog", () => {
  it("is registered after sector three and stays unlocked", () => {
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
    ]);
    expect(findLevel("level-4")).toBe(level4);
    expect(nextLevel(level3.id)).toBe(level4);
    expect(nextLevel(level4.id)?.id).toBe("level-5");
  });

  it("uses a first-sector-length map with a smaller left-biased top goal", () => {
    const [goal] = level4.goals;
    const first = level1.goals[0];
    expect(level4.worldHeight).toBe(level1.worldHeight);
    expect(level4.goals).toHaveLength(1);
    expect(goal?.closeEdges).toEqual(["top"]);
    expect(goal?.start.x).toBe(40);
    expect(goal?.curve[0]?.kind).toBe("quadratic");
    if (goal?.curve[0]?.kind === "quadratic" && first?.curve[0]?.kind === "quadratic") {
      expect(goal.curve[0].to.x - goal.start.x).toBeCloseTo((first.curve[0].to.x - first.start.x) / 3, 0);
      expect(goal.curve[0].control.y / 2).toBeCloseTo(first.curve[0].control.y / 6, 0);
      expect((goal.start.x + goal.curve[0].to.x) / 2).toBeLessThan(LOGICAL_CENTER);
    }
  });
});

const LOGICAL_CENTER = 195;

describe("level 4 reachability", () => {
  it("can finish through the left goal with one timed blast", () => {
    const sim = flyWithBlast(236, 148);
    expect(sim.state.phase).toBe("success");
    expect(sim.state.ship.position.x).toBeLessThan(140);
  });

  it("overshoots if the ship flies straight through the center", () => {
    const sim = new GameSimulation(level4);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    const limit = Math.ceil((level4.timeLimit + 1) / FIXED_DT);
    for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
      sim.updateFixed(FIXED_DT);
    }
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("overshoot");
  });
});

function flyWithBlast(bombX: number, bombY: number): GameSimulation {
  const sim = new GameSimulation(level4);
  sim.enqueue({ type: "place", x: bombX, y: bombY });
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const limit = Math.ceil((level4.timeLimit + 1) / FIXED_DT);
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
