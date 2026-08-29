import { describe, expect, it } from "vitest";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { goalPolygon } from "../src/level/GoalGeometry";
import { level35 } from "../src/level/level35";
import {
  LEVEL36_ASTEROID_INNER_RADIUS,
  LEVEL36_ASTEROID_OUTER_RADIUS,
  LEVEL36_GOAL_CENTER,
  LEVEL36_PLANET_CENTER,
  level36,
  level36AsteroidCup,
} from "../src/level/level36";
import { level37 } from "../src/level/level37";
import { level38, level38DustField, level38Triangle } from "../src/level/level38";
import {
  LEVEL39_CENTER,
  level39,
  level39DustField,
  level39HazardMotion,
  level39MovingAsteroid,
  level39Planet,
} from "../src/level/level39";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("sectors 36-39 catalog and reference layouts", () => {
  it("appends all four sectors after the existing sector 35", () => {
    expect(nextLevel(level35.id)).toBe(level36);
    expect(nextLevel(level36.id)).toBe(level37);
    expect(nextLevel(level37.id)).toBe(level38);
    expect(nextLevel(level38.id)).toBe(level39);
    expect(findLevel(level39.id)).toBe(level39);
  });

  it("models sector 36 as a planet, goal, and lower open asteroid cup", () => {
    expect(level36.planets).toHaveLength(1);
    expect(level36.hazards).toEqual([level36AsteroidCup]);
    expect(level36.goals[0]?.start.x).toBe(LEVEL36_GOAL_CENTER.x);
    const radii = goalPolygon(level36AsteroidCup).map((point) =>
      Math.hypot(point.x - LEVEL36_GOAL_CENTER.x, point.y - LEVEL36_GOAL_CENTER.y),
    );
    expect(Math.min(...radii)).toBeCloseTo(LEVEL36_ASTEROID_INNER_RADIUS, 0);
    expect(Math.max(...radii)).toBeCloseTo(LEVEL36_ASTEROID_OUTER_RADIUS, 0);
    expect(LEVEL36_PLANET_CENTER.y).toBeLessThan(LEVEL36_GOAL_CENTER.y);
  });

  it("models sector 37 as a clear channel between two planets", () => {
    expect(level37.hazards).toEqual([]);
    expect(level37.dustRegions).toEqual([]);
    expect(level37.planets).toHaveLength(2);
    expect(level37.goals[0]?.curve[0]?.kind).toBe("arc");
  });

  it("models sector 38's triangle and lower dust bar", () => {
    expect(level38.planets).toHaveLength(2);
    expect(level38.hazards).toEqual([level38Triangle]);
    expect(level38.dustRegions).toEqual([level38DustField]);
    expect(level38Triangle.curve.every((command) => command.kind === "line")).toBe(true);
    expect(level38DustField.dragPerSecond).toBeGreaterThan(0);
  });

  it("models sector 39's offset dust field, planet, and moving asteroid", () => {
    expect(level39.planets).toEqual([level39Planet]);
    expect(level39.dustRegions).toEqual([level39DustField]);
    expect(level39.hazards).toEqual([level39MovingAsteroid]);
    expect(level39HazardMotion.center).toEqual(LEVEL39_CENTER);
    expect(level39HazardMotion.angularVelocity).toBeGreaterThan(0);
    expect(level39.goals[0]?.curve).toHaveLength(8);
  });
});

describe("sectors 36-39 fixed-step routes", () => {
  it.each([level36, level38])("rejects a straight flight through %s's asteroid geometry", (level) => {
    const sim = flyWithBlasts(level, []);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
  });

  it("rejects an unassisted sector 39 flight in the planet-orbit challenge", () => {
    const sim = flyWithBlasts(level39, []);

    expect(sim.state.phase).toBe("failed");
    expect(["planet", "asteroid", "timeout"]).toContain(sim.state.failReason);
  });

  it("uses the clear middle channel in sector 37", () => {
    const sim = flyWithBlasts(level37, []);

    expect(sim.state.phase).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level37.goals, level37.worldHeight)).toBe(true);
  });

});

type Blast = { x: number; y: number; at: number };

function flyWithBlasts(level: typeof level36, bombs: Blast[]): GameSimulation {
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
