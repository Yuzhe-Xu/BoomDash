import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, levels, nextLevel } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level5 } from "../src/level/level5";
import { level6 } from "../src/level/level6";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal, isInsideAnyHazard } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 6 catalog", () => {
  it("is registered after sector five and stays unlocked", () => {
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
    expect(findLevel(level6.id)).toBe(level6);
    expect(nextLevel(level5.id)).toBe(level6);
    expect(nextLevel(level6.id)?.id).toBe("level-7");
  });

  it("adds one self-closed asteroid belt to the first-sector layout", () => {
    const [hazard] = level6.hazards;
    const polygon = goalPolygon(hazard, 390, level6.worldHeight);
    const xs = polygon.map((point) => point.x);
    const ys = polygon.map((point) => point.y);

    expect(level6.worldHeight).toBe(level1.worldHeight);
    expect(level6.start).toEqual(level1.start);
    expect(level6.goals).toEqual(level1.goals);
    expect(level6.hazards).toHaveLength(1);
    expect(hazard.closeEdges).toEqual([]);
    expect(hazard.curve).toHaveLength(4);
    expect(hazard.curve.every((command) => command.kind === "cubic")).toBe(true);
    expect(Math.min(...ys)).toBeGreaterThan(300);
    expect(Math.max(...ys)).toBeLessThan(level6.start.cy);
    expect(Math.min(...xs)).toBeGreaterThan(50);
    expect(Math.max(...xs)).toBeLessThan(340);
  });
});

describe("level 6 asteroid belt", () => {
  it("fails a straight flight when the ship enters the belt", () => {
    const sim = new GameSimulation(level6);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, level6.hazards, level6.worldHeight)).toBe(true);
  });

  it("can finish by using two timed blasts to pass the left side", () => {
    const sim = new GameSimulation(level6);
    sim.enqueue({ type: "place", x: 245, y: 650 });
    sim.enqueue({ type: "place", x: 0, y: 425 });
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    let firstDetonated = false;
    let secondDetonated = false;
    const limit = Math.ceil((level6.timeLimit + 1) / FIXED_DT);

    for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
      if (!firstDetonated && sim.state.ship.position.y <= 650) {
        sim.enqueue({ type: "detonate", id: "b1" });
        firstDetonated = true;
      }
      if (!secondDetonated && sim.state.ship.position.y <= 420) {
        sim.enqueue({ type: "detonate", id: "b2" });
        secondDetonated = true;
      }
      sim.updateFixed(FIXED_DT);
    }

    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level6.goals, level6.worldHeight)).toBe(true);
  });
});

function runToEnd(sim: GameSimulation): void {
  const limit = Math.ceil((level6.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    sim.updateFixed(FIXED_DT);
  }
}
