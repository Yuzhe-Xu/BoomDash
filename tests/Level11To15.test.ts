import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, levels, nextLevel } from "../src/level/LevelCatalog";
import { level1 } from "../src/level/level1";
import { level10 } from "../src/level/level10";
import { level11, level11LowerAsteroid, level11UpperAsteroid } from "../src/level/level11";
import { level12 } from "../src/level/level12";
import { level13 } from "../src/level/level13";
import { level14, level14BonusAsteroid, LEVEL14_RIGHT_BONUS } from "../src/level/level14";
import {
  level15,
  level15GoalAsteroidBottom,
  level15GoalAsteroidLeft,
  level15GoalAsteroidRight,
} from "../src/level/level15";
import { goalBonus } from "../src/level/StarRating";
import { GameSimulation } from "../src/simulation/GameSimulation";
import { FIXED_DT } from "../src/simulation/ShipSimulator";

const levelIds = [
  "level-1",
  "level-2",
  "level-3",
  "level-4",
  "level-5",
  "level-6",
  "level-7",
  "level-8",
  "level-9",
  "level-10",
  "level-11",
  "level-12",
  "level-13",
  "level-14",
  "level-15",
  "level-16",
  "level-17",
  "level-18",
  "level-19",
  "level-20",
  "level-21",
  "level-22",
  "level-23",
  "level-24",
  "level-25",
  "level-26",
  "level-27",
  "level-28",
  "level-29",
  "level-30",
  "level-31",
  "level-32",
  "level-33",
  "level-34",
  "level-35",
  "level-36",
  "level-37",
  "level-38",
  "level-39",
  "level-40",
  "level-41",
  "level-42",
  "level-43",
  "level-44",
  "level-45",
  "level-46",
  "level-47",
  "level-48",
];

describe("levels 11-15 catalog", () => {
  it("appends the new sectors without adding locks", () => {
    expect(levels.map((level) => level.id)).toEqual(levelIds);
    expect(findLevel(level15.id)).toBe(level15);
    expect(nextLevel(level10.id)).toBe(level11);
    expect(nextLevel(level14.id)).toBe(level15);
    expect(nextLevel(level15.id)?.id).toBe("level-16");
  });

  it("uses progressively longer maps and only existing geometry", () => {
    expect(level11.worldHeight).toBeGreaterThan(level10.worldHeight);
    expect(level12.worldHeight).toBeGreaterThan(level11.worldHeight);
    expect(level13.worldHeight).toBe(level11.worldHeight);
    expect(level14.worldHeight).toBeGreaterThan(level13.worldHeight);
    expect(level15.worldHeight).toBe(level1.worldHeight);

    for (const level of [level11, level12, level13, level14, level15]) {
      expect(level.maxBombs).toBe(8);
      expect(level.unlimitedBombs).toBe(false);
      expect(level.hazards.every((hazard) => hazard.curve.length > 0)).toBe(true);
      expect(level.goals.every((goal) => goal.closeEdges.length === 0 || goal.closeEdges.includes("top"))).toBe(
        true,
      );
    }
  });

  it("makes sector 11 a pair of wide alternating asteroid belts", () => {
    const lower = goalPolygon(level11LowerAsteroid, 390, level11.worldHeight);
    const upper = goalPolygon(level11UpperAsteroid, 390, level11.worldHeight);
    const lowerXs = lower.map((point) => point.x);
    const upperXs = upper.map((point) => point.x);
    const lowerYs = lower.map((point) => point.y);
    const upperYs = upper.map((point) => point.y);

    expect(Math.max(...lowerXs) - Math.min(...lowerXs)).toBe(195);
    expect(Math.max(...upperXs) - Math.min(...upperXs)).toBe(195);
    expect(Math.max(...lowerXs)).toBe(390);
    expect(Math.min(...upperXs)).toBe(0);
    expect(Math.max(...lowerYs) - Math.min(...lowerYs)).toBeLessThan(150);
    expect(Math.max(...upperYs) - Math.min(...upperYs)).toBeLessThan(150);
    expect(Math.min(...lowerYs)).toBeGreaterThan(Math.max(...upperYs) + 400);
    expect(level11LowerAsteroid.curve.some((command) => command.kind === "line")).toBe(true);
    expect(level11UpperAsteroid.curve.some((command) => command.kind === "line")).toBe(true);
  });

  it("puts a belt under sector 14's bonus goal to force a narrow approach", () => {
    const [, bonus] = level14.goals;
    const bonusPoly = goalPolygon(bonus, 390, level14.worldHeight);
    const beltPoly = goalPolygon(level14BonusAsteroid, 390, level14.worldHeight);
    const bonusXs = bonusPoly.map((point) => point.x);
    const bonusYs = bonusPoly.map((point) => point.y);
    const beltXs = beltPoly.map((point) => point.x);
    const beltYs = beltPoly.map((point) => point.y);
    expect(bonus.bonusScore).toBe(LEVEL14_RIGHT_BONUS);
    expect(Math.min(...beltYs)).toBeGreaterThan(Math.max(...bonusYs));
    expect(Math.min(...beltXs)).toBeGreaterThan(Math.min(...bonusXs));
    expect(Math.max(...beltXs)).toBeGreaterThan(360);
    expect(level14.hazards).toHaveLength(2);
  });

  it("makes sector 15 a short reverse-entry cup around one mid-left goal", () => {
    const [goal] = level15.goals;
    const goalPoly = goalPolygon(goal, 390, level15.worldHeight);
    const bottomPoly = goalPolygon(level15GoalAsteroidBottom, 390, level15.worldHeight);
    const leftPoly = goalPolygon(level15GoalAsteroidLeft, 390, level15.worldHeight);
    const rightPoly = goalPolygon(level15GoalAsteroidRight, 390, level15.worldHeight);
    const goalXs = goalPoly.map((point) => point.x);
    const goalYs = goalPoly.map((point) => point.y);
    const bottomYs = bottomPoly.map((point) => point.y);
    const leftXs = leftPoly.map((point) => point.x);
    const rightXs = rightPoly.map((point) => point.x);
    expect(level15.goals).toHaveLength(1);
    expect(goal.bonusScore).toBeUndefined();
    expect(Math.max(...goalXs)).toBeLessThan(195);
    expect(Math.min(...bottomYs)).toBeGreaterThan(Math.max(...goalYs) - 4);
    expect(Math.max(...leftXs)).toBeLessThanOrEqual(Math.min(...goalXs) + 2);
    expect(Math.min(...rightXs)).toBeGreaterThanOrEqual(Math.max(...goalXs) - 2);
    expect(level15.hazards).toHaveLength(3);
  });
});

describe("levels 11-15 routes", () => {
  it.each([
    [level11, [
      { x: 260, y: 1480 },
      { x: 200, y: 1400 },
      { x: 20, y: 1360 },
      { x: 10, y: 1320 },
      { x: 48, y: 950 },
      { x: 380, y: 760 },
    ]],
    [level12, [{ x: 260, y: 1548 }, { x: 22, y: 1288 }, { x: 250, y: 950 }]],
    [level13, [
      { x: 260, y: 1480 },
      { x: 200, y: 1400 },
      { x: 20, y: 1360 },
      { x: 10, y: 1320 },
      { x: 48, y: 950 },
      { x: 380, y: 760 },
    ]],
    [level14, [{ x: 125, y: 1050 }]],
    [level15, [{ x: 206, y: 270, atY: 305 }]],
  ])("can complete %s with its intended timed blasts", (level, bombs) => {
    const sim = flyWithBlasts(level, bombs);
    expect(
      sim.state.phase,
      JSON.stringify({
        reason: sim.state.failReason,
        position: sim.state.ship.position,
        velocity: sim.state.ship.velocity,
      }),
    ).toBe("success");
    if (level.id === "level-14") {
      expect(goalBonus(level14.goals, sim.state.successGoalId)).toBe(LEVEL14_RIGHT_BONUS);
    }
  });

  it.each([level11, level12, level13, level14])(
    "rejects a straight flight through the first hazard in %s",
    (level) => {
      const sim = new GameSimulation(level);
      sim.enqueue({ type: "launch" });
      sim.updateFixed(FIXED_DT);
      runToEnd(sim, level.timeLimit);
      expect(sim.state.phase).toBe("failed");
      expect(sim.state.failReason).toBe("asteroid");
    },
  );

  it("rejects a late right turn into sector 14's bonus belt", () => {
    const sim = flyWithBlasts(level14, [
      { x: 140, y: 1050 },
      { x: 330, y: 1000 },
      { x: 330, y: 950 },
    ]);
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
  });

  it("rejects flying into sector 15's cup from below", () => {
    const sim = flyWithBlasts(level15, [{ x: 250, y: 650 }]);
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("asteroid");
  });

  it("overshoots sector 15 if the ship never reverses", () => {
    const sim = new GameSimulation(level15);
    sim.enqueue({ type: "launch" });
    sim.updateFixed(FIXED_DT);
    runToEnd(sim, level15.timeLimit);
    expect(sim.state.phase).toBe("failed");
    expect(sim.state.failReason).toBe("overshoot");
  });
});

type Level = typeof level11;
type Bomb = { x: number; y: number; atY?: number };

function flyWithBlasts(level: Level, bombs: Bomb[]): GameSimulation {
  const sim = new GameSimulation(level);
  for (const bomb of bombs) {
    sim.enqueue({ type: "place", x: bomb.x, y: bomb.y });
  }
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const pending = bombs.map((bomb, index) => ({
    id: `b${index + 1}`,
    y: bomb.atY ?? bomb.y,
    done: false,
  }));
  const limit = Math.ceil((level.timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    for (const bomb of pending) {
      if (!bomb.done && sim.state.ship.position.y <= bomb.y + 2) {
        sim.enqueue({ type: "detonate", id: bomb.id });
        bomb.done = true;
      }
    }
    sim.updateFixed(FIXED_DT);
  }
  return sim;
}

function runToEnd(sim: GameSimulation, timeLimit: number): void {
  const limit = Math.ceil((timeLimit + 1) / FIXED_DT);
  for (let i = 0; i < limit && sim.state.phase === "flying"; i += 1) {
    sim.updateFixed(FIXED_DT);
  }
}
