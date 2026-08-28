import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { level22 } from "../src/level/level22";
import { level23, level23DustBelt } from "../src/level/level23";
import { level24, level24DustField } from "../src/level/level24";
import { level25, level25DustField } from "../src/level/level25";
import { level26 } from "../src/level/level26";
import type { LevelDefinition } from "../src/level/LevelDefinition";
import { GameSimulation } from "../src/simulation/GameSimulation";
import {
  isInsideAnyGoal,
  isInsideAnyHazard,
} from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("levels 23-25 catalog and geometry", () => {
  it("appends all three sectors in stable order without locks", () => {
    expect(findLevel(level23.id)).toBe(level23);
    expect(findLevel(level24.id)).toBe(level24);
    expect(findLevel(level25.id)).toBe(level25);
    expect(nextLevel(level22.id)).toBe(level23);
    expect(nextLevel(level23.id)).toBe(level24);
    expect(nextLevel(level24.id)).toBe(level25);
    expect(nextLevel(level25.id)).toBe(level26);
  });

  it("adds a full-width dust belt below sector twenty-three's central asteroid", () => {
    const dust = bounds(goalPolygon(level23DustBelt, 390, level23.worldHeight));
    const asteroid = bounds(goalPolygon(level23.hazards[0], 390, level23.worldHeight));

    expect(level23.maxBombs).toBe(8);
    expect(level23.dustRegions).toEqual([level23DustBelt]);
    expect(dust).toMatchObject({ left: 0, right: 390, top: 530, bottom: 638 });
    expect(asteroid.bottom).toBeLessThan(dust.top);
    expect(dust.bottom).toBeLessThan(level23.start.cy);
  });

  it("fills the left side of sector twenty-four's asteroid-height approach with dust", () => {
    const dust = bounds(goalPolygon(level24DustField, 390, level24.worldHeight));
    const asteroid = bounds(goalPolygon(level24.hazards[0], 390, level24.worldHeight));

    expect(level24.maxBombs).toBe(8);
    expect(dust).toMatchObject({ left: 0, right: 218, top: 125, bottom: 225 });
    expect(dust.right).toBeLessThan(asteroid.right);
    expect(dust.top).toBeLessThan(asteroid.bottom);
    expect(dust.bottom).toBeGreaterThan(asteroid.top);
  });

  it("fills the complete vertical interval between sector twenty-five's asteroids", () => {
    const dust = bounds(goalPolygon(level25DustField, 390, level25.worldHeight));
    const lower = bounds(goalPolygon(level25.hazards[0], 390, level25.worldHeight));
    const upper = bounds(goalPolygon(level25.hazards[1], 390, level25.worldHeight));

    expect(level25.maxBombs).toBe(8);
    expect(dust).toMatchObject({ left: 0, right: 390, top: 292, bottom: 1036 });
    expect(dust.top).toBe(upper.bottom);
    expect(dust.bottom).toBe(lower.top);
  });
});

describe("levels 23-25 dust and asteroid routes", () => {
  it.each([level23, level25])("rejects a straight flight through %s's asteroid", (level) => {
    const sim = flyWithBlasts(level, []);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
    expect(isInsideAnyHazard(sim.state.ship, level.hazards, level.worldHeight)).toBe(true);
  });

  it("slows sector twenty-four's straight route in dust until it times out", () => {
    const sim = flyWithBlasts(level24, []);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("timeout");
    expect(sim.state.ship.position.y).toBeGreaterThan(0);
  });

  it("crosses sector twenty-three's dust and rounds the central asteroid", () => {
    const sim = flyWithBlasts(level23, [
      { x: 220, y: 650, at: 650 },
      { x: 113, y: 620, at: 600 },
      { x: 0, y: 425, at: 420 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level23.goals, level23.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(3);
  });

  it("boosts through sector twenty-four's dust before turning into the corner goal", () => {
    const sim = flyWithBlasts(level24, [
      { x: 195, y: 235, at: 200 },
      { x: 165, y: 120, at: 122 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level24.goals, level24.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(2);
  });

  it("maintains speed through sector twenty-five's long dust-filled s-curve", () => {
    const sim = flyWithBlasts(level25, [
      { x: 285, y: 1300, at: 1300 },
      { x: 167, y: 1010, at: 990 },
      { x: 160, y: 820, at: 800 },
      { x: 157, y: 630, at: 610 },
      { x: 90, y: 560, at: 550 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level25.goals, level25.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(5);
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
