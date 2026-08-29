import { describe, expect, it } from "vitest";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { goalPolygon } from "../src/level/GoalGeometry";
import { planetsAtTime } from "../src/level/PlanetMotion";
import { level39 } from "../src/level/level39";
import {
  LEVEL40_CORE_CENTER,
  level40,
  level40CorePlanet,
  level40OrbitingPlanet,
} from "../src/level/level40";
import { level41, level41LeftPlanet, level41RightPlanet } from "../src/level/level41";
import { level42, level42RightPlanet } from "../src/level/level42";
import { level43, level43CorePlanet, level43LeftPlanet, level43UpperPlanet } from "../src/level/level43";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("sectors 40-43 catalog and layouts", () => {
  it("appends all four sectors in image order", () => {
    expect(nextLevel(level39.id)).toBe(level40);
    expect(nextLevel(level40.id)).toBe(level41);
    expect(nextLevel(level41.id)).toBe(level42);
    expect(nextLevel(level42.id)).toBe(level43);
    expect(findLevel(level43.id)).toBe(level43);
  });

  it("uses a core planet and a counterclockwise scout orbit in sector 40", () => {
    expect(level40.planets).toEqual([level40CorePlanet, level40OrbitingPlanet]);
    expect(level40OrbitingPlanet.motion?.center).toEqual(LEVEL40_CORE_CENTER);
    expect(level40OrbitingPlanet.motion?.angularVelocity).toBeLessThan(0);
    expect(level40.goals[0]?.curve).toHaveLength(8);
  });

  it("uses mirrored converging orbits in sector 41", () => {
    expect(level41.planets).toEqual([level41LeftPlanet, level41RightPlanet]);
    expect(level41LeftPlanet.motion?.center).toEqual(level41RightPlanet.motion?.center);
    expect(level41LeftPlanet.motion?.angularVelocity).toBeGreaterThan(0);
    expect(level41RightPlanet.motion?.angularVelocity).toBeLessThan(0);
  });

  it("stages the right planet above the left planet in sector 42", () => {
    expect(level42RightPlanet.center.y).toBeLessThan(level42.start.cy);
    expect(level42.planets?.[0]?.center.y).toBeGreaterThan(level42RightPlanet.center.y);
    expect(level42.planets?.every((planet) => planet.motion)).toBe(true);
  });

  it("uses a corner goal and two orbital guards around the sector 43 core", () => {
    expect(level43.planets).toEqual([level43CorePlanet, level43LeftPlanet, level43UpperPlanet]);
    expect(level43.goals[0]?.closeEdges).toEqual(["right", "top"]);
    expect(level43.goals[0]?.start.x).toBeGreaterThan(280);
    expect(goalPolygon(level43.goals[0]).every((point) => point.x >= 284)).toBe(true);
  });

  it("moves orbiting planets without changing their orbit radius", () => {
    const planet = level40OrbitingPlanet;
    const initialRadius = Math.hypot(
      planet.center.x - LEVEL40_CORE_CENTER.x,
      planet.center.y - LEVEL40_CORE_CENTER.y,
    );
    const moved = planetsAtTime([planet], 3)[0];
    expect(moved).toBeDefined();
    expect(moved?.center).not.toEqual(planet.center);
    expect(
      Math.hypot(moved!.center.x - LEVEL40_CORE_CENTER.x, moved!.center.y - LEVEL40_CORE_CENTER.y),
    ).toBeCloseTo(initialRadius, 8);
  });
});

describe("sectors 40-43 fixed-step routes", () => {
  it("fails an unassisted sector 40 flight into the core", () => {
    expect(flyWithBlasts(level40, []).state.failReason).toBe("planet");
    const sim = flyWithBlasts(level40, [
      { x: 0, y: 700, at: 700 },
      { x: 165, y: 620, at: 620 },
    ]);
    expectPhaseToBeSuccess(sim);
    expect(sim.state.usedBombs).toBe(2);
  });

  it("keeps sector 41's central channel open", () => {
    const sim = flyWithBlasts(level41, []);
    expect(sim.state.phase).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level41.goals, level41.worldHeight)).toBe(true);
  });

  it("requires a correction when sector 42's right guard crosses the route", () => {
    expect(flyWithBlasts(level42, []).state.failReason).toBe("planet");
    const sim = flyWithBlasts(level42, [
      { x: 0, y: 700, at: 700 },
      { x: 120, y: 460, at: 460 },
    ]);
    expectPhaseToBeSuccess(sim);
    expect(sim.state.usedBombs).toBe(2);
  });

  it("wraps sector 43's core and enters the top-right boundary goal", () => {
    expect(flyWithBlasts(level43, []).state.failReason).toBe("planet");
    const sim = flyWithBlasts(level43, [
      { x: 165, y: 700, at: 700 },
      { x: 270, y: 300, at: 300 },
    ]);
    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level43.goals, level43.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(2);
  });

  it("freezes moving planets while paused", () => {
    const sim = new GameSimulation(level42);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    sim.enqueue({ type: "pause" });
    sim.updateFixed(FIXED_DT);
    const paused = sim.snapshot();
    sim.updateFixed(FIXED_DT);
    expect(sim.state.elapsed).toBe(paused.elapsed);
    expect(sim.state.ship.position).toEqual(paused.ship.position);
  });
});

type Blast = { x: number; y: number; at: number };

function flyWithBlasts(level: typeof level40, blasts: Blast[]): GameSimulation {
  const sim = new GameSimulation(level);
  for (const blast of blasts) {
    sim.enqueue({ type: "place", x: blast.x, y: blast.y });
  }
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const pending = blasts.map((blast, index) => ({ ...blast, id: `b${index + 1}`, done: false }));
  const limit = Math.ceil((level.timeLimit + 1) / FIXED_DT);
  for (let tick = 0; tick < limit && sim.state.phase === "flying"; tick += 1) {
    for (const blast of pending) {
      if (!blast.done && sim.state.ship.position.y <= blast.at) {
        sim.enqueue({ type: "detonate", id: blast.id });
        blast.done = true;
      }
    }
    sim.updateFixed(FIXED_DT);
  }
  return sim;
}

function expectPhaseToBeSuccess(sim: GameSimulation): void {
  expect(
    sim.state.phase,
    JSON.stringify({
      reason: sim.state.failReason,
      elapsed: sim.state.elapsed,
      position: sim.state.ship.position,
    }),
  ).toBe("success");
}
