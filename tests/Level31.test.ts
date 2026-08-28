import { describe, expect, it } from "vitest";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { runScore } from "../src/level/StarRating";
import { level1 } from "../src/level/level1";
import { level6 } from "../src/level/level6";
import { level30 } from "../src/level/level30";
import {
  LEVEL31_GRAVITY,
  LEVEL31_PLANET_RADIUS,
  level31,
  level31Planet,
} from "../src/level/level31";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { shipHitsAnyPlanet } from "../src/simulation/GravitySystem";
import { isInsideAnyGoal } from "../src/simulation/LifecycleBounds";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 31 catalog", () => {
  it("is appended after sector thirty without a lock", () => {
    expect(findLevel(level31.id)).toBe(level31);
    expect(nextLevel(level30.id)).toBe(level31);
    expect(nextLevel(level31.id)?.id).toBe("level-32");
  });

  it("keeps sector six layout and replaces the asteroid with a circular planet", () => {
    expect(level31.worldHeight).toBe(level6.worldHeight);
    expect(level31.start).toEqual(level6.start);
    expect(level31.goals).toEqual(level6.goals);
    expect(level31.dustRegions).toEqual([]);
    expect(level31.hazards).toEqual([]);
    expect(level31.blastRadius).toBe(level6.blastRadius);
    expect(level31.maxImpulse).toBe(level6.maxImpulse);
    expect(level31.launchVelocity).toBe(level6.launchVelocity);
    expect(level31.timeLimit).toBe(level6.timeLimit);
    expect(level31.maxBombs).toBe(8);
    expect(level31.planets).toEqual([level31Planet]);
    expect(level31Planet.center).toEqual({ x: 195, y: 438 });
    expect(level31Planet.radius).toBe(LEVEL31_PLANET_RADIUS);
    expect(level31Planet.gravitationalParameter).toBe(LEVEL31_GRAVITY);
    expect(level31Planet.appearance).toBe("rocky");
  });
});

describe("level 31 gravity routes", () => {
  it("fails a straight flight when the ship hits the planet", () => {
    const sim = new GameSimulation(level31);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim);

    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("planet");
    expect(shipHitsAnyPlanet(sim.state.ship, level31.planets)).toBe(true);
  });

  it("does not keep the sector-six left bypass after gravity is added", () => {
    const sim = flyLevel6Bypass();
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("planet");
  });

  it("can finish with two timed blasts that graze the gravity well", () => {
    const sim = flyRecommended();
    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        elapsed: sim.state.elapsed,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    expect(isInsideAnyGoal(sim.state.ship, level31.goals, level31.worldHeight)).toBe(true);
    expect(sim.state.usedBombs).toBe(2);
    expect(runScore(sim.state.elapsed, sim.state.usedBombs, level31)).toBeGreaterThanOrEqual(
      level31.star3Score,
    );
  });

  it("freezes gravity while paused", () => {
    const sim = new GameSimulation(level31);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    sim.enqueue({ type: "pause" });
    sim.updateFixed(FIXED_DT);
    const paused = sim.snapshot();
    sim.updateFixed(FIXED_DT);
    sim.updateFixed(FIXED_DT);
    expect(sim.state.elapsed).toBe(paused.elapsed);
    expect(sim.state.ship.position).toEqual(paused.ship.position);
    expect(sim.state.ship.velocity).toEqual(paused.ship.velocity);
  });

  it("leaves sector one unchanged when no planets are defined", () => {
    const sim = new GameSimulation(level1);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    expect(sim.state.ship.velocity).toEqual({ x: 0, y: level1.launchVelocity });
  });
});

function flyLevel6Bypass(): GameSimulation {
  return flyTimed([
    { x: 245, y: 650, whenY: 650 },
    { x: 0, y: 425, whenY: 420 },
  ]);
}

function flyRecommended(): GameSimulation {
  return flyTimed([
    { x: 230, y: 650, whenY: 650 },
    { x: 0, y: 300, whenY: 300 },
  ]);
}

function flyTimed(bombs: Array<{ x: number; y: number; whenY: number }>): GameSimulation {
  const sim = new GameSimulation(level31);
  for (const bomb of bombs) {
    sim.enqueue({ type: "place", x: bomb.x, y: bomb.y });
  }
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const detonated = bombs.map(() => false);
  const limit = Math.ceil((level31.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    bombs.forEach((bomb, index) => {
      if (!detonated[index] && sim.state.ship.position.y <= bomb.whenY) {
        sim.enqueue({ type: "detonate", id: `b${index + 1}` });
        detonated[index] = true;
      }
    });
    sim.updateFixed(FIXED_DT);
  }
  return sim;
}

function runToEnd(sim: GameSimulation): void {
  const limit = Math.ceil((level31.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    sim.updateFixed(FIXED_DT);
  }
}
