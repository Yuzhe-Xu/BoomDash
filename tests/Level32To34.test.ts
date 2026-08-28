import { describe, expect, it } from "vitest";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { runScore } from "../src/level/StarRating";
import type { LevelDefinition } from "../src/level/LevelDefinition";
import { level31 } from "../src/level/level31";
import { level32, level32Planet } from "../src/level/level32";
import {
  LEVEL33_WORLD_HEIGHT,
  level33,
  level33LowerPlanet,
  level33UpperPlanet,
} from "../src/level/level33";
import { level34, level34Planet } from "../src/level/level34";
import { level35 } from "../src/level/level35";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { shipHitsAnyPlanet } from "../src/simulation/GravitySystem";
import { isInsideAnyGoal } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("levels 32-34 catalog and geometry", () => {
  it("appends three planet sectors after thirty-one without locks", () => {
    expect(findLevel(level32.id)).toBe(level32);
    expect(findLevel(level33.id)).toBe(level33);
    expect(findLevel(level34.id)).toBe(level34);
    expect(nextLevel(level31.id)).toBe(level32);
    expect(nextLevel(level32.id)).toBe(level33);
    expect(nextLevel(level33.id)).toBe(level34);
    expect(nextLevel(level34.id)).toBe(level35);
  });

  it("uses a right-side planet to guard sector thirty-two's corner goal", () => {
    expect(level32.hazards).toEqual([]);
    expect(level32.planets).toEqual([level32Planet]);
    expect(level32.maxBombs).toBe(8);
    expect(level32Planet.center.x).toBeGreaterThan(240);
    expect(level32Planet.center.y).toBeGreaterThan(180);
    expect(level32Planet.center.y).toBeLessThan(300);
    expect(level32.goals[0]?.closeEdges).toEqual(["right", "top"]);
  });

  it("staggers two planets on a taller sector-thirty-three map", () => {
    expect(level33.worldHeight).toBe(LEVEL33_WORLD_HEIGHT);
    expect(level33.planets).toEqual([level33LowerPlanet, level33UpperPlanet]);
    expect(level33LowerPlanet.center.x).toBeGreaterThan(level33UpperPlanet.center.x);
    expect(level33LowerPlanet.center.y).toBeGreaterThan(level33UpperPlanet.center.y);
    expect(level33LowerPlanet.center.y).toBeLessThan(level33.start.cy);
    expect(level33.goals[0]?.closeEdges).toEqual(["right", "top"]);
  });

  it("places sector thirty-four's goal above a central gravity well", () => {
    expect(level34.planets).toEqual([level34Planet]);
    expect(level34Planet.center.x).toBe(195);
    expect(level34.goals[0]?.id).toBe("goal-above-planet");
    const goalBottom = 90 + 40;
    const planetTop = level34Planet.center.y - level34Planet.radius;
    expect(planetTop).toBeGreaterThan(goalBottom);
  });
});

describe("levels 32-34 gravity routes", () => {
  it.each([level32, level33, level34])("rejects a straight flight into %s's planet", (level) => {
    const sim = flyWithBlasts(level, []);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("planet");
    expect(shipHitsAnyPlanet(sim.state.ship, level.planets)).toBe(true);
  });

  it("turns under sector thirty-two's planet into the corner goal", () => {
    const sim = flyWithBlasts(level32, [
      { x: 245, y: 680, at: 680 },
      { x: 0, y: 220, at: 220 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level32.goals, level32.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(2);
    expect(runScore(sim.state.elapsed, sim.state.usedBombs, level32)).toBeGreaterThanOrEqual(
      level32.star3Score,
    );
  });

  it("cannot finish sector thirty-three with only the first leftward blast", () => {
    const sim = flyWithBlasts(level33, [{ x: 228, y: 1040, at: 1040 }]);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("planet");
  });

  it("threads sector thirty-three's staggered wells into the corner", () => {
    const sim = flyWithBlasts(level33, [
      { x: 228, y: 1040, at: 1040 },
      { x: 80, y: 560, at: 560 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level33.goals, level33.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(2);
    expect(runScore(sim.state.elapsed, sim.state.usedBombs, level33)).toBeGreaterThanOrEqual(
      level33.star3Score,
    );
  });

  it("wraps sector thirty-four's well and enters the floating goal", () => {
    const sim = flyWithBlasts(level34, [
      { x: 228, y: 660, at: 660 },
      { x: 30, y: 560, at: 560 },
      { x: 0, y: 210, at: 210 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(isInsideAnyGoal(sim.state.ship, level34.goals, level34.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(3);
    expect(runScore(sim.state.elapsed, sim.state.usedBombs, level34)).toBeGreaterThanOrEqual(
      level34.star3Score,
    );
  });
});

type Blast = { x: number; y: number; at: number };

function flyWithBlasts(level: LevelDefinition, bombs: Blast[]): GameSimulation {
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
