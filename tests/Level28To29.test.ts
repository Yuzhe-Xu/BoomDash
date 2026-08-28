import { describe, expect, it } from "vitest";
import { goalPolygon, regionsAtTime } from "../src/level/GoalGeometry";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import type { CurveRegion, LevelDefinition } from "../src/level/LevelDefinition";
import { level27 } from "../src/level/level27";
import {
  level28,
  level28DustMotion,
  level28DustSegments,
  level28HazardMotion,
} from "../src/level/level28";
import {
  LEVEL29_ASTEROID_START_ANGLE,
  LEVEL29_ASTEROID_RADIUS,
  LEVEL29_CENTER,
  LEVEL29_DUST_RADIUS,
  LEVEL29_ORBIT_RADIUS,
  LEVEL29_ORBIT_MIN_ANGLE,
  level29,
  level29HazardMotion,
  level29MovingAsteroid,
} from "../src/level/level29";
import { level30 } from "../src/level/level30";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("levels 28-29 catalog and motion geometry", () => {
  it("appends both sectors in stable order without locks", () => {
    expect(findLevel(level28.id)).toBe(level28);
    expect(findLevel(level29.id)).toBe(level29);
    expect(nextLevel(level27.id)).toBe(level28);
    expect(nextLevel(level28.id)).toBe(level29);
    expect(nextLevel(level29.id)).toBe(level30);
  });

  it("combines three rotating asteroids with four rotating outer dust segments", () => {
    expect(level28.hazards).toHaveLength(3);
    expect(level28.dustRegions).toEqual(level28DustSegments);
    expect(level28.dustRegions).toHaveLength(4);
    expect(level28HazardMotion.angularVelocity).toBeLessThan(0);
    expect(level28DustMotion.angularVelocity).toBeLessThan(0);

    for (const region of level28.dustRegions) {
      const radii = goalPolygon(region, 390, level28.worldHeight).map((point) =>
        Math.hypot(point.x - level28DustMotion.center.x, point.y - level28DustMotion.center.y),
      );
      expect(Math.min(...radii)).toBeCloseTo(225, 4);
      expect(Math.max(...radii)).toBeCloseTo(260, 4);
    }

    const moved = regionsAtTime(level28.dustRegions, level28.dustMotion, 1);
    expect(arcStart(moved[0])).toBeCloseTo(arcStart(level28.dustRegions[0]) - 0.1, 6);
  });

  it("places the sector twenty-nine goal inside circular dust and moves its asteroid along an arc", () => {
    expect(level29.hazards).toEqual([level29MovingAsteroid]);
    const dustRadii = goalPolygon(level29.dustRegions[0], 390, level29.worldHeight).map((point) =>
      Math.hypot(point.x - LEVEL29_CENTER.x, point.y - LEVEL29_CENTER.y),
    );
    expect(Math.min(...dustRadii)).toBeCloseTo(LEVEL29_DUST_RADIUS, 4);
    expect(Math.max(...dustRadii)).toBeCloseTo(LEVEL29_DUST_RADIUS, 4);

    const elapsed = 2;
    const [moved] = regionsAtTime(level29.hazards, level29.hazardMotion, elapsed);
    const center = circleCenter(moved);
    const expectedAngle = LEVEL29_ASTEROID_START_ANGLE + level29HazardMotion.angularVelocity * elapsed;
    expect(center.x).toBeCloseTo(LEVEL29_CENTER.x + LEVEL29_ORBIT_RADIUS * Math.cos(expectedAngle), 4);
    expect(center.y).toBeCloseTo(LEVEL29_CENTER.y + LEVEL29_ORBIT_RADIUS * Math.sin(expectedAngle), 4);

    const exitTime =
      (LEVEL29_ASTEROID_START_ANGLE - LEVEL29_ORBIT_MIN_ANGLE) /
      Math.abs(level29HazardMotion.angularVelocity);
    const rightExit = circleCenter(
      regionsAtTime(level29.hazards, level29.hazardMotion, exitTime - 0.01)[0],
    );
    const leftReset = circleCenter(
      regionsAtTime(level29.hazards, level29.hazardMotion, exitTime + 0.01)[0],
    );
    const leftEntry = circleCenter(
      regionsAtTime(level29.hazards, level29.hazardMotion, exitTime + 0.3)[0],
    );
    expect(rightExit.x - LEVEL29_ASTEROID_RADIUS).toBeGreaterThan(390);
    expect(leftReset.x + LEVEL29_ASTEROID_RADIUS).toBeLessThan(0);
    expect(leftEntry.x).toBeLessThan(0);
    expect(leftEntry.x + LEVEL29_ASTEROID_RADIUS).toBeGreaterThan(0);
  });
});

describe("levels 28-29 routes", () => {
  it.each([
    [level28, "asteroid"],
    [level29, "timeout"],
  ] as const)("rejects an unassisted straight flight through %s", (level, reason) => {
    const sim = flyWithImmediateBlasts(level, 0);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe(reason);
  });

  it.each([level28, level29])("can reach %s with three immediate boosts", (level) => {
    const sim = flyWithImmediateBlasts(level, 3);

    expectPhaseToBeSuccess(sim);
    expect(sim.state.usedBombs).toBe(3);
    expect(isInsideAnyGoal(sim.state.ship, level.goals, level.worldHeight)).toBe(true);
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

function arcStart(region: CurveRegion): number {
  const command = region.curve[0];
  if (command?.kind !== "arc") {
    throw new Error("expected arc region");
  }
  return command.startAngle;
}

function circleCenter(region: CurveRegion): { x: number; y: number } {
  const command = region.curve[0];
  if (command?.kind !== "arc") {
    throw new Error("expected circle region");
  }
  return { x: command.cx, y: command.cy };
}

function expectPhaseToBeSuccess(sim: GameSimulation): void {
  expect(
    sim.state.phase,
    JSON.stringify({
      reason: sim.state.failReason,
      elapsed: sim.state.elapsed,
      position: sim.state.ship.position,
      velocity: sim.state.ship.velocity,
    }),
  ).toBe("success");
}
