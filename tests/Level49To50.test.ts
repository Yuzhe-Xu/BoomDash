import { describe, expect, it } from "vitest";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { goalPolygon, hazardsAtTime } from "../src/level/GoalGeometry";
import { level48 } from "../src/level/level48";
import {
  LEVEL49_ORBIT_CENTER,
  LEVEL49_ORBIT_RADIUS,
  level49,
  level49Hazards,
  level49LeftPlanet,
  level49RightPlanet,
  level49TopPlanet,
} from "../src/level/level49";
import {
  LEVEL50_CORE_CENTER,
  level50,
  level50HazardMotion,
  level50RotatingHazards,
} from "../src/level/level50";
import type { LevelDefinition } from "../src/level/LevelDefinition";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("sectors 49-50 catalog and reference layouts", () => {
  it("appends both supplied sectors in order", () => {
    expect(nextLevel(level48.id)).toBe(level49);
    expect(nextLevel(level49.id)).toBe(level50);
    expect(findLevel(level50.id)).toBe(level50);
  });

  it("uses three counterclockwise planets on one orbit in sector 49", () => {
    expect(level49.planets).toEqual([level49TopPlanet, level49LeftPlanet, level49RightPlanet]);
    for (const planet of level49.planets ?? []) {
      expect(planet.motion?.angularVelocity).toBeLessThan(0);
      expect(Math.hypot(planet.center.x - LEVEL49_ORBIT_CENTER.x, planet.center.y - LEVEL49_ORBIT_CENTER.y)).toBeCloseTo(
        LEVEL49_ORBIT_RADIUS,
      );
    }
    expect(level49.hazards).toEqual(level49Hazards);
    expect(level49.goals).toHaveLength(1);
  });

  it("uses two corner goals and a counterclockwise rotating asteroid assembly in sector 50", () => {
    expect(level50.goals).toHaveLength(2);
    expect(level50.goals.map((goal) => goal.closeEdges)).toEqual([
      ["left", "top"],
      ["right", "top"],
    ]);
    expect(level50.planets?.[0]?.center).toEqual(LEVEL50_CORE_CENTER);
    expect(level50.hazards).toEqual(level50RotatingHazards);
    expect(level50HazardMotion.center).toEqual(LEVEL50_CORE_CENTER);
    expect(level50HazardMotion.angularVelocity).toBeLessThan(0);
    expect(goalPolygon(level50.goals[0]!, 390, level50.worldHeight).length).toBeGreaterThan(10);
  });

  it("moves sector 50 hazards around the central planet", () => {
    const [initial, moved] = [0, 2].map((elapsed) => hazardsAtTime(level50.hazards, level50.hazardMotion, elapsed)[0]);
    expect(moved?.curve[0]).not.toEqual(initial?.curve[0]);
    expect(hazardsAtTime(level50.hazards, level50.hazardMotion, 0)).toEqual(level50.hazards);
    expect(hazardsAtTime(level50.hazards, level50.hazardMotion, 2).at(-1)?.curve).toEqual(
      level50.hazards.at(-1)?.curve,
    );
  });
});

describe("sectors 49-50 direct flight failures", () => {
  it("rejects an unassisted sector 49 flight at the orbital planets", () => {
    expect(flyWithoutBombs(level49).state.failReason).toBe("planet");
  });

  it("rejects an unassisted sector 50 flight at the rotating core hazard", () => {
    expect(["planet", "asteroid"]).toContain(flyWithoutBombs(level50).state.failReason);
  });

  it("can route around sector 49's orbital bodies", () => {
    const sim = flyWithBlasts(level49, [
      { x: 140, y: 650, at: 650 },
      { x: 140, y: 500, at: 500 },
      { x: 210, y: 300, at: 300 },
      { x: 50, y: 230, at: 230 },
    ]);
    expect(sim.state.phase).toBe("success");
  });

  it("can reach a top corner through sector 50's rotating hazard", () => {
    const sim = flyWithBlasts(level50, [
      { x: 175, y: 620, at: 620 },
      { x: 340, y: 550, at: 550 },
      { x: 220, y: 450, at: 450 },
      { x: 300, y: 250, at: 250 },
    ]);
    expect(sim.state.phase).toBe("success");
  });
});

function flyWithoutBombs(level: LevelDefinition): GameSimulation {
  const sim = new GameSimulation(level);
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const limit = Math.ceil((level.timeLimit + 1) / FIXED_DT);
  for (let tick = 0; tick < limit && sim.state.phase === "flying"; tick += 1) {
    sim.updateFixed(FIXED_DT);
  }
  return sim;
}

function flyWithBlasts(
  level: LevelDefinition,
  blasts: { x: number; y: number; at: number }[],
): GameSimulation {
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
