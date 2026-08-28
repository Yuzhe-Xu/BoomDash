import { describe, expect, it } from "vitest";
import { goalPolygon, hazardsAtTime } from "../src/level/GoalGeometry";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level25 } from "../src/level/level25";
import {
  LEVEL26_RING_CENTER,
  LEVEL26_RING_FIRST_START,
  LEVEL26_RING_SEGMENT_ANGLE,
  LEVEL26_RING_SPACING,
  level26,
  level26HazardMotion,
  level26RotatingRings,
} from "../src/level/level26";
import { level27 } from "../src/level/level27";
import type { HazardRegion, LevelDefinition } from "../src/level/LevelDefinition";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal, isInsideAnyHazard } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 26 rotating asteroid rings", () => {
  it("is appended after sector twenty-five without a lock", () => {
    expect(findLevel(level26.id)).toBe(level26);
    expect(nextLevel(level25.id)).toBe(level26);
    expect(nextLevel(level26.id)).toBe(level27);
  });

  it("uses a first-sector-length map with three equal, evenly spaced rings", () => {
    expect(level26.worldHeight).toBe(level1.worldHeight);
    expect(level26.goals).toHaveLength(1);
    expect(level26.hazards).toEqual(level26RotatingRings);
    expect(level26.hazards).toHaveLength(3);
    expect(level26.maxBombs).toBe(8);

    const spans = level26.hazards.map(outerArcSpan);
    const starts = level26.hazards.map(outerArcStart);
    for (const span of spans) {
      expect(span).toBeCloseTo(LEVEL26_RING_SEGMENT_ANGLE, 6);
    }
    expect(starts[1] - starts[0]).toBeCloseTo(LEVEL26_RING_SPACING, 6);
    expect(starts[2] - starts[1]).toBeCloseTo(LEVEL26_RING_SPACING, 6);

    for (const region of level26.hazards) {
      expect(region.closeEdges).toEqual([]);
      expect(region.curve.filter((command) => command.kind === "arc")).toHaveLength(2);
      const distances = goalPolygon(region, 390, level26.worldHeight).map((point) =>
        Math.hypot(point.x - LEVEL26_RING_CENTER.x, point.y - LEVEL26_RING_CENTER.y),
      );
      expect(Math.min(...distances)).toBeCloseTo(78, 4);
      expect(Math.max(...distances)).toBeCloseTo(108, 4);
    }
  });

  it("rotates collision geometry at the configured fixed-time angle", () => {
    const elapsed = 2;
    const rotated = hazardsAtTime(level26.hazards, level26.hazardMotion, elapsed);
    const angle = level26HazardMotion.angularVelocity * elapsed;
    const localAngle = LEVEL26_RING_FIRST_START + 0.05;
    const radius = 92;
    const initialPoint = {
      x: LEVEL26_RING_CENTER.x + radius * Math.cos(localAngle),
      y: LEVEL26_RING_CENTER.y + radius * Math.sin(localAngle),
    };
    const rotatedPoint = {
      x: LEVEL26_RING_CENTER.x + radius * Math.cos(localAngle + angle),
      y: LEVEL26_RING_CENTER.y + radius * Math.sin(localAngle + angle),
    };

    expect(isInsideAnyHazard(shipAt(initialPoint.x, initialPoint.y, 0), level26.hazards, level26.worldHeight)).toBe(true);
    expect(isInsideAnyHazard(shipAt(rotatedPoint.x, rotatedPoint.y, 0), rotated, level26.worldHeight)).toBe(true);
    expect(isInsideAnyHazard(shipAt(initialPoint.x, initialPoint.y, 0), rotated, level26.worldHeight)).toBe(false);
  });

  it("rejects a straight flight after the ring rotates across the approach", () => {
    const sim = flyWithImmediateBlasts(level26, 0);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
  });

  it("can boost through a rotating gap and enter the center goal", () => {
    const sim = flyWithImmediateBlasts(level26, 3);

    expectPhaseToBeSuccess(sim);
    expect(sim.state.usedBombs).toBe(3);
    expect(isInsideAnyGoal(sim.state.ship, level26.goals, level26.worldHeight)).toBe(true);
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

function outerArcSpan(region: HazardRegion): number {
  const command = region.curve[0];
  if (command?.kind !== "arc") {
    throw new Error("expected an outer arc");
  }
  return command.endAngle - command.startAngle;
}

function outerArcStart(region: HazardRegion): number {
  const command = region.curve[0];
  if (command?.kind !== "arc") {
    throw new Error("expected an outer arc");
  }
  return command.startAngle;
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

function shipAt(x: number, y: number, radius: number) {
  return {
    position: { x, y },
    prevPosition: { x, y },
    velocity: { x: 0, y: 0 },
    radius,
  };
}
