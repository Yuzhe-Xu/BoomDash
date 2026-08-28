import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { level20 } from "../src/level/level20";
import { level21, level21DustBelt } from "../src/level/level21";
import { level22, level22DustRings } from "../src/level/level22";
import { level23 } from "../src/level/level23";
import type { LevelDefinition } from "../src/level/LevelDefinition";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { isInsideAnyGoal, shipTouchesRegion } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("levels 21-22 catalog and geometry", () => {
  it("appends both sectors in stable order without locks", () => {
    expect(findLevel(level21.id)).toBe(level21);
    expect(findLevel(level22.id)).toBe(level22);
    expect(nextLevel(level20.id)).toBe(level21);
    expect(nextLevel(level21.id)).toBe(level22);
    expect(nextLevel(level22.id)).toBe(level23);
  });

  it("places sector twenty-one's rounded dust belt between spawn and goal", () => {
    const dustBounds = bounds(goalPolygon(level21DustBelt, 390, level21.worldHeight));
    const goalBounds = bounds(goalPolygon(level21.goals[0], 390, level21.worldHeight));

    expect(level21.hazards).toEqual([]);
    expect(level21.dustRegions).toEqual([level21DustBelt]);
    expect(dustBounds).toMatchObject({ left: 58, right: 332, top: 355, bottom: 510 });
    expect(goalBounds.bottom).toBeLessThan(dustBounds.top);
    expect(dustBounds.bottom).toBeLessThan(level21.start.cy);
  });

  it("builds sector twenty-two from three non-overlapping top-left quarter rings", () => {
    const radii = level22DustRings.map((region) =>
      region.curve
        .filter((command) => command.kind === "arc")
        .map((command) => command.radius)
        .sort((a, b) => a - b),
    );

    expect(level22.goals).toHaveLength(1);
    expect(level22.hazards).toEqual([]);
    expect(level22DustRings).toHaveLength(3);
    expect(radii).toEqual([
      [78, 105],
      [160, 202],
      [346, 380],
    ]);
    expect(radii[0][1]).toBeLessThan(radii[1][0]);
    expect(radii[1][1]).toBeLessThan(radii[2][0]);
  });
});

describe("levels 21-22 dust routes", () => {
  it.each([level21, level22])("slows a straight flight until sector %s times out", (level) => {
    const sim = new GameSimulation(level);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim, level);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("timeout");
    expect(level.dustRegions.some((region) => shipTouchesRegion(sim.state.ship, region))).toBe(true);
  });

  it("uses one reserved blast to cross sector twenty-one's dust belt", () => {
    const sim = flyWithBlasts(level21, [{ x: 195, y: 470, at: 470 }]);

    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level21.goals, level21.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(1);
  });

  it("crosses sector twenty-two's concentric dust rings and reaches the corner goal", () => {
    const sim = flyWithBlasts(level22, [
      { x: 206.01, y: 789.95, at: 742 },
      { x: 184.05, y: 590.6, at: 572.5 },
      { x: 129.65, y: 322.27, at: 306 },
      { x: 57.15, y: 159.98, at: 158 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level22.goals, level22.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(4);
  });
});

type Bomb = { x: number; y: number; at: number };

function flyWithBlasts(level: LevelDefinition, bombs: Bomb[]): GameSimulation {
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

function runToEnd(sim: GameSimulation, level: LevelDefinition): void {
  const limit = Math.ceil((level.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    sim.updateFixed(FIXED_DT);
  }
}

function bounds(points: { x: number; y: number }[]) {
  return {
    left: Math.min(...points.map((point) => point.x)),
    right: Math.max(...points.map((point) => point.x)),
    top: Math.min(...points.map((point) => point.y)),
    bottom: Math.max(...points.map((point) => point.y)),
  };
}

function expectPhaseToBeSuccess(sim: GameSimulation): void {
  expect(
    sim.state.phase,
    JSON.stringify({
      reason: sim.state.failReason,
      position: sim.state.ship.position,
      velocity: sim.state.ship.velocity,
    }),
  ).toBe("success");
}
