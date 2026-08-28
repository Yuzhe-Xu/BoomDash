import { describe, expect, it } from "vitest";
import { level21, level21DustBelt } from "../src/level/level21";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { dustDragAtShip, shipTouchesRegion } from "../src/simulation/LifecycleBounds";
import { applyDrag, FIXED_DT } from "../src/simulation/ShipSimulator";

describe("interstellar dust", () => {
  it("applies frame-rate-independent exponential drag without changing direction", () => {
    const ship = {
      position: { x: 0, y: 0 },
      prevPosition: { x: 0, y: 0 },
      velocity: { x: 120, y: -80 },
      radius: 14,
    };
    const oneStep = applyDrag(ship, 0.45, 1);
    let fixedSteps = ship;
    for (let i = 0; i < 120; i += 1) {
      fixedSteps = applyDrag(fixedSteps, 0.45, FIXED_DT);
    }

    expect(fixedSteps.velocity.x).toBeCloseTo(oneStep.velocity.x, 10);
    expect(fixedSteps.velocity.y).toBeCloseTo(oneStep.velocity.y, 10);
    expect(fixedSteps.velocity.x / fixedSteps.velocity.y).toBeCloseTo(-1.5, 10);
  });

  it("derives drag from the same region geometry used by the level", () => {
    const sim = new GameSimulation(level21);
    sim.state.ship.position = { x: 195, y: 430 };

    expect(shipTouchesRegion(sim.state.ship, level21DustBelt, level21.worldHeight)).toBe(true);
    expect(dustDragAtShip(sim.state.ship, level21.dustRegions, level21.worldHeight)).toBe(0.45);

    sim.state.ship.position = { x: 195, y: 650 };
    expect(shipTouchesRegion(sim.state.ship, level21DustBelt, level21.worldHeight)).toBe(false);
    expect(dustDragAtShip(sim.state.ship, level21.dustRegions, level21.worldHeight)).toBe(0);
  });

  it("slows a ship continuously while it remains in dust", () => {
    const sim = new GameSimulation(level21);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    while (sim.state.ship.position.y > 480) {
      sim.updateFixed(FIXED_DT);
    }
    const speedOnEntry = Math.abs(sim.state.ship.velocity.y);
    for (let i = 0; i < 120; i += 1) {
      sim.updateFixed(FIXED_DT);
    }

    expect(shipTouchesRegion(sim.state.ship, level21DustBelt, level21.worldHeight)).toBe(true);
    expect(Math.abs(sim.state.ship.velocity.y)).toBeLessThan(speedOnEntry * 0.65);
  });
});
