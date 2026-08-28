import { describe, expect, it } from "vitest";
import { level1 } from "../src/level/level1";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("GamePhase", () => {
  it("starts in planning and launches into flying", () => {
    const sim = new GameSimulation(level1);
    expect(sim.state.phase).toBe("planning");
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    expect(sim.state.phase).toBe("flying");
    expect(sim.state.ship.velocity.y).toBe(level1.launchVelocity);
  });

  it("freezes position and timer while paused", () => {
    const sim = new GameSimulation(level1);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    sim.enqueue({ type: "pause" });
    sim.updateFixed(FIXED_DT);
    const paused = sim.snapshot();
    sim.updateFixed(FIXED_DT);
    sim.updateFixed(FIXED_DT);
    expect(sim.state.phase).toBe("paused");
    expect(sim.state.elapsed).toBe(paused.elapsed);
    expect(sim.state.ship.position).toEqual(paused.ship.position);
  });

  it("redeploy restores planning and keeps bomb layout", () => {
    const sim = new GameSimulation(level1);
    sim.enqueue({ type: "place", x: 100, y: 100 });
    sim.enqueue({ type: "place", x: 220, y: 480 });
    sim.updateFixed(FIXED_DT);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    sim.enqueue({ type: "detonate", id: "b1" });
    sim.updateFixed(FIXED_DT);
    sim.enqueue({ type: "redeploy" });
    sim.updateFixed(FIXED_DT);
    expect(sim.state.phase).toBe("planning");
    expect(sim.state.ship.velocity).toEqual({ x: 0, y: 0 });
    expect(sim.state.bombs).toHaveLength(2);
    expect(sim.state.bombs[0]).toMatchObject({
      id: "b1",
      position: { x: 100, y: 100 },
      state: "armed",
    });
    expect(sim.state.bombs[1]).toMatchObject({
      id: "b2",
      position: { x: 220, y: 480 },
      state: "armed",
    });
  });

  it("places bombs on exact click positions without snapping", () => {
    const sim = new GameSimulation(level1);
    sim.enqueue({ type: "place", x: 12.5, y: 33.25 });
    sim.enqueue({ type: "place", x: 12.5, y: 33.25 });
    sim.updateFixed(FIXED_DT);
    expect(sim.state.bombs).toHaveLength(2);
    expect(sim.state.bombs[0].position).toEqual({ x: 12.5, y: 33.25 });
    expect(sim.state.bombs[1].position).toEqual({ x: 12.5, y: 33.25 });
  });

  it("resumes from pause and keeps simulating", () => {
    const sim = new GameSimulation(level1);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    sim.enqueue({ type: "pause" });
    sim.updateFixed(FIXED_DT);
    sim.enqueue({ type: "resume" });
    sim.flushEvents();
    expect(sim.state.phase).toBe("flying");
    const y = sim.state.ship.position.y;
    sim.updateFixed(FIXED_DT);
    expect(sim.state.ship.position.y).toBeLessThan(y);
  });

  it("replays the same inputs to the same result", () => {
    const events = [
      { tick: 0, event: { type: "place" as const, x: 160, y: 620 } },
      { tick: 0, event: { type: "place" as const, x: 230, y: 480 } },
      { tick: 0, event: { type: "launch" as const } },
      { tick: 40, event: { type: "detonate" as const, id: "b1" } },
      { tick: 90, event: { type: "detonate" as const, id: "b2" } },
    ];
    const a = new GameSimulation(level1);
    const b = new GameSimulation(level1);
    a.replay(events, 200, FIXED_DT);
    b.replay(events, 200, FIXED_DT);
    expect(a.state.ship.position).toEqual(b.state.ship.position);
    expect(a.state.ship.velocity).toEqual(b.state.ship.velocity);
    expect(a.state.phase).toEqual(b.state.phase);
  });
});
