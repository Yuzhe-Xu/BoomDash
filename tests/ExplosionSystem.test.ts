import { describe, expect, it } from "vitest";
import { computeImpulse } from "../src/simulation/ExplosionSystem";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { length, vec2 } from "../src/simulation/Vec2";
import { level1 } from "../src/level/level1";

describe("ExplosionSystem", () => {
  it("pushes the ship away from the bomb", () => {
    const impulse = computeImpulse(vec2(10, 0), vec2(0, 0), 100, 150);
    expect(impulse.x).toBeGreaterThan(0);
    expect(impulse.y).toBeCloseTo(0);
  });

  it("falls off with distance", () => {
    const near = length(computeImpulse(vec2(10, 0), vec2(0, 0), 100, 150));
    const far = length(computeImpulse(vec2(80, 0), vec2(0, 0), 100, 150));
    expect(near).toBeGreaterThan(far);
  });

  it("returns zero outside the blast radius", () => {
    expect(computeImpulse(vec2(200, 0), vec2(0, 0), 100, 150)).toEqual({ x: 0, y: 0 });
  });

  it("uses up when bomb and ship overlap", () => {
    const impulse = computeImpulse(vec2(5, 5), vec2(5, 5), 100, 150);
    expect(impulse.x).toBe(0);
    expect(impulse.y).toBeLessThan(0);
    expect(Number.isFinite(impulse.x)).toBe(true);
    expect(Number.isFinite(impulse.y)).toBe(true);
  });

  it("detonates a bomb only once", () => {
    const sim = new GameSimulation(level1);
    sim.enqueue({ type: "place", x: 195, y: 700 });
    sim.updateFixed(1 / 120);
    const id = sim.state.bombs[0].id;
    sim.enqueue({ type: "launch" });
    sim.updateFixed(1 / 120);
    sim.enqueue({ type: "detonate", id });
    sim.updateFixed(1 / 120);
    const afterFirst = { ...sim.state.ship.velocity };
    sim.enqueue({ type: "detonate", id });
    sim.updateFixed(1 / 120);
    expect(sim.state.bombs[0].state).toBe("detonated");
    expect(sim.state.usedBombs).toBe(1);
    expect(sim.state.ship.velocity).toEqual(afterFirst);
  });
});
