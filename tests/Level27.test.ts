import { describe, expect, it } from "vitest";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { level26, level26HazardMotion, level26RotatingRings } from "../src/level/level26";
import { LEVEL27_WORLD_HEIGHT, level27 } from "../src/level/level27";
import { level28 } from "../src/level/level28";
import type { LevelDefinition } from "../src/level/LevelDefinition";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 27 longer rotating rings", () => {
  it("is appended after sector twenty-six without a lock", () => {
    expect(findLevel(level27.id)).toBe(level27);
    expect(nextLevel(level26.id)).toBe(level27);
    expect(nextLevel(level27.id)).toBe(level28);
  });

  it("reuses the same equal rings with a longer map and farther goal", () => {
    expect(level27.worldHeight).toBe(LEVEL27_WORLD_HEIGHT);
    expect(level27.worldHeight).toBeGreaterThan(level26.worldHeight);
    expect(level27.start.cy - level27.goals[0]!.start.y).toBeGreaterThan(
      level26.start.cy - level26.goals[0]!.start.y,
    );
    expect(level27.goals).toEqual(level26.goals);
    expect(level27.hazards).toEqual(level26RotatingRings);
    expect(level27.hazardMotion).toEqual(level26HazardMotion);
    expect(level27.maxBombs).toBe(8);
  });

  it("rejects a straight flight after the ring rotates across the approach", () => {
    const sim = flyWithImmediateBlasts(level27, 0);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
  });

  it("can boost through the farther rotating gap and enter the center goal", () => {
    const sim = flyWithImmediateBlasts(level27, 3);

    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        elapsed: sim.state.elapsed,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(sim.state.usedBombs).toBe(3);
    expect(isInsideAnyGoal(sim.state.ship, level27.goals, level27.worldHeight)).toBe(true);
  });
});

function flyWithImmediateBlasts(level: LevelDefinition, blastCount: number): GameSimulation {
  const sim = new GameSimulation(level);
  for (let index = 0; index < blastCount; index += 1) {
    sim.enqueue({ type: "place", x: level.start.cx, y: level.start.cy - 8 });
  }
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  for (let index = 0; index < blastCount; index += 1) {
    sim.enqueue({ type: "detonate", id: `b${index + 1}` });
  }

  const limit = Math.ceil((level.timeLimit + 1) / FIXED_DT);
  for (let tick = 0; tick < limit && sim.state.phase === "flying"; tick += 1) {
    sim.updateFixed(FIXED_DT);
  }
  return sim;
}
