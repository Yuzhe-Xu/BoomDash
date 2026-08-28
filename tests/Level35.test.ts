import { describe, expect, it } from "vitest";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { level34 } from "../src/level/level34";
import {
  LEVEL35_ASTEROID_INNER_RADIUS,
  LEVEL35_ASTEROID_OUTER_RADIUS,
  LEVEL35_CENTER,
  LEVEL35_DUST_INNER_RADIUS,
  LEVEL35_DUST_OUTER_RADIUS,
  LEVEL35_PLANET_RADIUS,
  level35,
  level35AsteroidRing,
  level35DustRing,
  level35Planet,
} from "../src/level/level35";
import { goalPolygon, pointInGoalRegion } from "../src/level/GoalGeometry";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { shipHitsAnyPlanet } from "../src/simulation/GravitySystem";
import { isInsideAnyHazard } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("sector thirty-five", () => {
  it("appends a concentric planet, asteroid ring, and dust ring", () => {
    expect(nextLevel(level34.id)).toBe(level35);
    expect(findLevel(level35.id)).toBe(level35);
    expect(level35.planets).toEqual([level35Planet]);
    expect(level35.hazards).toEqual([level35AsteroidRing]);
    expect(level35.dustRegions).toEqual([level35DustRing]);
    expect(level35Planet.center).toEqual(LEVEL35_CENTER);
    expect(level35Planet.radius).toBe(LEVEL35_PLANET_RADIUS);
    expect(level35AsteroidRing.curve).toHaveLength(3);
    expect(level35DustRing.dragPerSecond).toBeGreaterThan(0);
  });

  it("keeps the goal above the outer ring and uses the specified radii", () => {
    const asteroid = goalPolygon(level35AsteroidRing);
    const dust = goalPolygon(level35DustRing);
    const asteroidRadii = asteroid.map((point) =>
      Math.hypot(point.x - LEVEL35_CENTER.x, point.y - LEVEL35_CENTER.y),
    );
    const dustRadii = dust.map((point) =>
      Math.hypot(point.x - LEVEL35_CENTER.x, point.y - LEVEL35_CENTER.y),
    );
    expect(Math.max(...asteroidRadii)).toBeCloseTo(LEVEL35_ASTEROID_OUTER_RADIUS, 0);
    expect(Math.min(...asteroidRadii)).toBeCloseTo(LEVEL35_ASTEROID_INNER_RADIUS, 0);
    expect(Math.max(...dustRadii)).toBeCloseTo(LEVEL35_DUST_OUTER_RADIUS, 0);
    expect(Math.min(...dustRadii)).toBeCloseTo(LEVEL35_DUST_INNER_RADIUS, 0);
    expect(pointInGoalRegion(LEVEL35_CENTER.x, 92, level35.goals[0])).toBe(true);
    expect(level35.goals[0].start.y).toBeLessThan(LEVEL35_CENTER.y - LEVEL35_DUST_OUTER_RADIUS);
  });

  it("fails a straight flight into the planet", () => {
    const sim = flyWithBlasts(level35, []);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(shipHitsAnyPlanet(sim.state.ship, level35.planets)).toBe(false);
  });

  it("leaves a safe left-side corridor around both rings", () => {
    const corridor = [
      { x: 20, y: 700 },
      { x: 20, y: 430 },
      { x: 20, y: 240 },
    ];

    for (const point of corridor) {
      const ship = { position: point, prevPosition: point, velocity: { x: 0, y: 0 }, radius: level35.shipRadius };
      expect(shipHitsAnyPlanet(ship, level35.planets)).toBe(false);
      expect(isInsideAnyHazard(ship, level35.hazards, level35.worldHeight)).toBe(false);
    }
    expect(pointInGoalRegion(LEVEL35_CENTER.x, 92, level35.goals[0])).toBe(true);
  });
});

type Blast = { x: number; y: number; at: number };

function flyWithBlasts(level: typeof level35, bombs: Blast[]): GameSimulation {
  const sim = new GameSimulation(level);
  for (const bomb of bombs) {
    sim.enqueue({ type: "place", x: bomb.x, y: bomb.y });
  }
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const pending = bombs.map((bomb, index) => ({ ...bomb, id: `b${index + 1}`, done: false }));
  const limit = Math.ceil((level.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    for (const bomb of pending) {
      if (!bomb.done && sim.state.ship.position.y <= bomb.at) {
        sim.enqueue({ type: "detonate", id: bomb.id });
        bomb.done = true;
      }
    }
    sim.updateFixed(FIXED_DT);
  }
  return sim;
}
