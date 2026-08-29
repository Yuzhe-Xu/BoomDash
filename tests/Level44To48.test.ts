import { describe, expect, it } from "vitest";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { goalPolygon } from "../src/level/GoalGeometry";
import { level43 } from "../src/level/level43";
import {
  LEVEL44_INNER_ORBIT_RADIUS,
  LEVEL44_ORBIT_CENTER,
  level44,
  level44InnerPlanet,
  level44OuterPlanet,
} from "../src/level/level44";
import { level45, level45LeftArc, level45RightArc } from "../src/level/level45";
import { level46, level46DiagonalDust, level46MovingPlanet } from "../src/level/level46";
import { level47, level47VerticalAsteroid, level47VerticalDust } from "../src/level/level47";
import { level48, level48DustField, level48Hazards } from "../src/level/level48";
import { planetsAtTime } from "../src/level/PlanetMotion";
import type { LevelDefinition } from "../src/level/LevelDefinition";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("sectors 44-48 catalog and reference layouts", () => {
  it("appends the five supplied sectors in order", () => {
    expect(nextLevel(level43.id)).toBe(level44);
    expect(nextLevel(level44.id)).toBe(level45);
    expect(nextLevel(level45.id)).toBe(level46);
    expect(nextLevel(level46.id)).toBe(level47);
    expect(nextLevel(level47.id)).toBe(level48);
    expect(findLevel(level48.id)).toBe(level48);
  });

  it("uses two counterclockwise concentric planet orbits in sector 44", () => {
    expect(level44.planets).toEqual([level44InnerPlanet, level44OuterPlanet]);
    expect(level44InnerPlanet.motion?.angularVelocity).toBeLessThan(0);
    expect(level44OuterPlanet.motion?.angularVelocity).toBeLessThan(0);
    expect(Math.hypot(level44InnerPlanet.center.x - LEVEL44_ORBIT_CENTER.x, level44InnerPlanet.center.y - LEVEL44_ORBIT_CENTER.y)).toBeCloseTo(
      LEVEL44_INNER_ORBIT_RADIUS,
    );
  });

  it("uses two large arc walls and a top-left boundary goal in sector 45", () => {
    expect(level45.hazards).toEqual([level45LeftArc, level45RightArc]);
    expect(level45.goals[0]?.closeEdges).toEqual(["left", "top"]);
    expect(goalPolygon(level45LeftArc, 390, level45.worldHeight).length).toBeGreaterThan(20);
    expect(goalPolygon(level45RightArc, 390, level45.worldHeight).length).toBeGreaterThan(20);
  });

  it("uses diagonal rounded regions and a linear crossing planet in sector 46", () => {
    expect(level46.dustRegions).toEqual([level46DiagonalDust]);
    expect(level46MovingPlanet.motion?.linearVelocity).toEqual({ x: 15, y: -15 });
    expect(planetsAtTime([level46MovingPlanet], 4)[0]?.center).toEqual({ x: 118, y: 1030 });
  });

  it("places a bottom-left boundary goal beside the vertical wall in sector 47", () => {
    expect(level47.goals[0]?.closeEdges).toEqual(["left", "bottom"]);
    expect(level47.hazards).toEqual([level47VerticalAsteroid]);
    expect(level47.dustRegions).toEqual([level47VerticalDust]);
    expect(level47.planets?.[0]?.center.x).toBeGreaterThan(200);
  });

  it("fills sector 48 with dust around two planets and four rounded hazards", () => {
    expect(level48.dustRegions).toEqual([level48DustField]);
    expect(level48.dustRegions[0]?.dragPerSecond).toBeGreaterThan(0);
    expect(level48.planets).toHaveLength(2);
    expect(level48.hazards).toEqual(level48Hazards);
  });
});

describe("sectors 44-48 direct flight failures", () => {
  it("can cross sector 44's moving orbital gap with four timed blasts", () => {
    const sim = flyWithBlasts(level44, [
      { x: 336.7, y: 1108.8, at: 1050 },
      { x: 207.9, y: 1009.8, at: 950 },
      { x: 143.7, y: 809.4, at: 850 },
      { x: 334.2, y: 725, at: 750 },
    ]);
    expect(sim.state.phase).toBe("success");
    expect(sim.state.usedBombs).toBe(4);
  });

  it("rejects an unassisted sector 44 flight in the outer gravity well", () => {
    expect(flyWithoutBombs(level44).state.failReason).toBe("planet");
  });

  it("rejects an unassisted sector 45 flight at an arc wall", () => {
    expect(flyWithoutBombs(level45).state.failReason).toBe("asteroid");
  });

  it("rejects an unassisted sector 46 flight in the diagonal challenge", () => {
    expect(["planet", "asteroid", "timeout"]).toContain(flyWithoutBombs(level46).state.failReason);
  });

  it("does not let an unassisted sector 47 flight finish the bottom-left gate", () => {
    expect(flyWithoutBombs(level47).state.phase).not.toBe("success");
  });

  it("rejects an unassisted sector 48 flight in the lower gravity well", () => {
    expect(flyWithoutBombs(level48).state.failReason).toBe("planet");
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
