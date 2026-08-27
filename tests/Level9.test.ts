import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, levels, nextLevel } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level2 } from "../src/level/level2";
import { level8 } from "../src/level/level8";
import { level9, level9RightGateAsteroid } from "../src/level/level9";
import { level10 } from "../src/level/level10";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal, isInsideAnyHazard } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 9 catalog", () => {
  it("is registered after sector eight and stays unlocked", () => {
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
    expect(findLevel(level9.id)).toBe(level9);
    expect(nextLevel(level8.id)).toBe(level9);
    expect(nextLevel(level9.id)).toBe(level10);
  });

  it("splits a medium map into a left corner and a gated right circle", () => {
    const [leftGoal, rightGoal] = level9.goals;
    const [mid, gate] = level9.hazards;
    const midPoly = goalPolygon(mid, 390, level9.worldHeight);
    const gatePoly = goalPolygon(gate, 390, level9.worldHeight);
    const rightPoly = goalPolygon(rightGoal, 390, level9.worldHeight);
    const midXs = midPoly.map((point) => point.x);
    const midYs = midPoly.map((point) => point.y);
    const gateXs = gatePoly.map((point) => point.x);
    const gateYs = gatePoly.map((point) => point.y);
    const rightXs = rightPoly.map((point) => point.x);
    const rightYs = rightPoly.map((point) => point.y);

    expect(level9.worldHeight).toBeGreaterThan(level1.worldHeight);
    expect(level9.worldHeight).toBeLessThan(level2.worldHeight);
    expect(level9.goals).toHaveLength(2);
    expect(leftGoal.closeEdges).toEqual(["left", "top"]);
    expect(rightGoal.closeEdges).toEqual([]);
    expect(rightGoal.curve.every((command) => command.kind === "cubic")).toBe(true);
    expect(level9.hazards).toHaveLength(2);
    expect(mid.closeEdges).toEqual([]);
    expect(gate.closeEdges).toEqual([]);
    expect((Math.min(...midXs) + Math.max(...midXs)) / 2).toBeCloseTo(195, 0);
    expect(Math.min(...midYs)).toBeGreaterThan(500);
    expect(Math.max(...midYs)).toBeLessThan(level9.start.cy);
    expect(Math.min(...gateYs)).toBeGreaterThan(Math.max(...rightYs));
    expect(Math.max(...gateXs)).toBeLessThan(Math.max(...rightXs));
    expect(Math.min(...rightXs)).toBeGreaterThan(250);
  });
});

describe("level 9 split routes", () => {
  it("fails a straight flight when the ship enters the mid belt", () => {
    const sim = new GameSimulation(level9);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, level9.hazards, level9.worldHeight)).toBe(true);
    expect(sim.state.ship.position.y).toBeGreaterThan(600);
  });

  it("can finish through the left corner along the left corridor", () => {
    const sim = flyWithBlasts([
      { x: 260, y: 960 },
      { x: 0, y: 680 },
    ]);
    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level9.goals, level9.worldHeight)).toBe(true);
    expect(sim.state.ship.position.x).toBeLessThan(120);
  });

  it("can finish through the right circle above the gate", () => {
    const sim = flyWithBlasts([
      { x: 130, y: 960 },
      { x: 390, y: 680 },
    ]);
    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level9.goals, level9.worldHeight)).toBe(true);
    expect(sim.state.ship.position.x).toBeGreaterThan(250);
  });

  it("fails when a left dodge is overcorrected into the right gate", () => {
    const sim = flyWithBlasts([
      { x: 260, y: 960 },
      { x: 0, y: 640 },
    ]);
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, [level9RightGateAsteroid], level9.worldHeight)).toBe(
      true,
    );
  });
});

function flyWithBlasts(bombs: { x: number; y: number }[]): GameSimulation {
  const sim = new GameSimulation(level9);
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
  const limit = Math.ceil((level9.timeLimit + 1) / FIXED_DT);
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
  const limit = Math.ceil((level9.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    sim.updateFixed(FIXED_DT);
  }
}
