import { describe, expect, it } from "vitest";
import { regionsAtTime } from "../src/level/GoalGeometry";
import { findLevel, nextLevel } from "../src/level/LevelCatalog";
import { goalBonus } from "../src/level/StarRating";
import type { CurveRegion } from "../src/level/LevelDefinition";
import { level29 } from "../src/level/level29";
import {
  LEVEL30_BONUS_ORBIT_RADIUS,
  LEVEL30_BONUS_SCORE,
  LEVEL30_BONUS_START_ANGLE,
  level30,
  level30BonusGoal,
  level30GoalMotion,
} from "../src/level/level30";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

describe("level 30 rotating bonus goal", () => {
  it("is appended after sector twenty-nine without a lock", () => {
    expect(findLevel(level30.id)).toBe(level30);
    expect(nextLevel(level29.id)).toBe(level30);
    expect(nextLevel(level30.id)).toBeUndefined();
  });

  it("keeps sector twenty-nine and adds a rotating bonus goal", () => {
    expect(level30.hazards).toEqual(level29.hazards);
    expect(level30.hazardMotion).toEqual(level29.hazardMotion);
    expect(level30.dustRegions).toEqual(level29.dustRegions);
    expect(level30.goals).toEqual([level29.goals[0], level30BonusGoal]);
    expect(goalBonus(level30.goals, level30BonusGoal.id)).toBe(LEVEL30_BONUS_SCORE);

    const elapsed = 2;
    const [centerGoal, movedBonus] = regionsAtTime(level30.goals, level30.goalMotion, elapsed);
    expect(circleCenter(centerGoal)).toEqual(circleCenter(level29.goals[0]));
    const angle = LEVEL30_BONUS_START_ANGLE + level30GoalMotion.angularVelocity * elapsed;
    expect(circleCenter(movedBonus).x).toBeCloseTo(
      level30GoalMotion.center.x + LEVEL30_BONUS_ORBIT_RADIUS * Math.cos(angle),
      4,
    );
    expect(circleCenter(movedBonus).y).toBeCloseTo(
      level30GoalMotion.center.y + LEVEL30_BONUS_ORBIT_RADIUS * Math.sin(angle),
      4,
    );
  });

  it("can still complete through the ordinary center goal", () => {
    const sim = flyWithImmediateBombs([
      { x: 195, y: 802 },
      { x: 195, y: 802 },
      { x: 195, y: 802 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(sim.state.successGoalId).toBe(level29.goals[0].id);
  });

  it("can intercept the rotating bonus goal and assigns its bonus", () => {
    const sim = flyWithImmediateBombs([
      { x: 195, y: 802 },
      { x: 195, y: 802 },
      { x: 195, y: 802 },
      { x: 155, y: 802 },
    ]);

    expectPhaseToBeSuccess(sim);
    expect(sim.state.successGoalId).toBe(level30BonusGoal.id);
    expect(goalBonus(level30.goals, sim.state.successGoalId)).toBe(LEVEL30_BONUS_SCORE);
  });
});

function flyWithImmediateBombs(positions: Array<{ x: number; y: number }>): GameSimulation {
  const sim = new GameSimulation(level30);
  for (const position of positions) {
    sim.enqueue({ type: "place", ...position });
  }
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  for (let index = 0; index < positions.length; index += 1) {
    sim.enqueue({ type: "detonate", id: `b${index + 1}` });
  }
  const limit = Math.ceil((level30.timeLimit + 1) / FIXED_DT);
  for (let tick = 0; tick < limit && sim.state.phase === "flying"; tick += 1) {
    sim.updateFixed(FIXED_DT);
  }
  return sim;
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
      goal: sim.state.successGoalId,
    }),
  ).toBe("success");
}
