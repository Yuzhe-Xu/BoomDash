import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, levels, nextLevel } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level7 } from "../src/level/level7";
import { level8 } from "../src/level/level8";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal, isInsideAnyHazard } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 8 catalog", () => {
  it("is registered after sector seven and stays unlocked", () => {
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
    ]);
    expect(findLevel(level8.id)).toBe(level8);
    expect(nextLevel(level7.id)).toBe(level8);
    expect(nextLevel(level8.id)?.id).toBe("level-9");
  });

  it("uses a top-right goal with a belt sitting below the entry window", () => {
    const [goal] = level8.goals;
    const [hazard] = level8.hazards;
    const goalPoly = goalPolygon(goal, 390, level8.worldHeight);
    const hazardPoly = goalPolygon(hazard, 390, level8.worldHeight);
    const goalXs = goalPoly.map((point) => point.x);
    const hazardXs = hazardPoly.map((point) => point.x);
    const hazardYs = hazardPoly.map((point) => point.y);

    expect(level8.worldHeight).toBe(level1.worldHeight);
    expect(level8.goals).toHaveLength(1);
    expect(goal.closeEdges).toEqual(["right", "top"]);
    expect(Math.max(...goalXs)).toBe(390);
    expect(level8.hazards).toHaveLength(1);
    expect(hazard.closeEdges).toEqual([]);
    expect(Math.min(...hazardYs)).toBeGreaterThan(100);
    expect(Math.min(...hazardYs)).toBeLessThan(160);
    expect(Math.max(...hazardXs)).toBeGreaterThan(350);
    expect(Math.min(...hazardXs)).toBeGreaterThan(200);
    expect(Math.min(...hazardXs)).toBeLessThan(260);
  });
});

describe("level 8 approach window", () => {
  it("overshoots if the ship flies straight through the center", () => {
    const sim = new GameSimulation(level8);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim);
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("overshoot");
  });

  it("fails when a late right turn clips the belt below the goal", () => {
    const sim = flyWithBlast(165, 280);
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, level8.hazards, level8.worldHeight)).toBe(true);
  });

  it("can finish by turning into the corner above the belt", () => {
    const sim = flyWithBlast(165, 120);
    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level8.goals, level8.worldHeight)).toBe(true);
    expect(sim.state.ship.position.x).toBeGreaterThan(250);
  });
});

function flyWithBlast(bombX: number, bombY: number): GameSimulation {
  const sim = new GameSimulation(level8);
  sim.enqueue({ type: "place", x: bombX, y: bombY });
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const limit = Math.ceil((level8.timeLimit + 1) / FIXED_DT);
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

function runToEnd(sim: GameSimulation): void {
  const limit = Math.ceil((level8.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    sim.updateFixed(FIXED_DT);
  }
}
