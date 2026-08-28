import { describe, expect, it } from "vitest";
import { goalPolygon } from "../src/level/GoalGeometry";
import { findLevel, levels, nextLevel } from "../src/level/LevelCatalog";
import { level10 } from "../src/level/level10";
import { level11, level11LowerAsteroid, level11UpperAsteroid } from "../src/level/level11";
import { level12 } from "../src/level/level12";
import { level13 } from "../src/level/level13";
import { level14, LEVEL14_RIGHT_BONUS } from "../src/level/level14";
import { level15, LEVEL15_RIGHT_BONUS } from "../src/level/level15";
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
];

describe("levels 11-15 catalog", () => {
  it("appends the new sectors without adding locks", () => {
    expect(levels.map((level) => level.id)).toEqual(levelIds);
    expect(findLevel(level15.id)).toBe(level15);
    expect(nextLevel(level10.id)).toBe(level11);
    expect(nextLevel(level14.id)).toBe(level15);
    expect(nextLevel(level15.id)).toBeUndefined();
  });

  it("uses progressively longer maps and only existing geometry", () => {
    expect(level11.worldHeight).toBeGreaterThan(level10.worldHeight);
    expect(level12.worldHeight).toBeGreaterThan(level11.worldHeight);
    expect(level13.worldHeight).toBe(level11.worldHeight);
    expect(level14.worldHeight).toBeGreaterThan(level13.worldHeight);
    expect(level15.worldHeight).toBeGreaterThan(level14.worldHeight);

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

    expect(Math.max(...lowerXs) - Math.min(...lowerXs)).toBeGreaterThan(200);
    expect(Math.max(...lowerXs) - Math.min(...lowerXs)).toBeLessThan(280);
    expect(Math.max(...upperXs) - Math.min(...upperXs)).toBeGreaterThan(200);
    expect(Math.max(...upperXs) - Math.min(...upperXs)).toBeLessThan(300);
    expect(Math.max(...lowerXs)).toBe(390);
    expect(Math.min(...upperXs)).toBe(0);
    expect(Math.max(...lowerYs) - Math.min(...lowerYs)).toBeLessThan(150);
    expect(Math.max(...upperYs) - Math.min(...upperYs)).toBeLessThan(150);
    expect(Math.min(...lowerYs)).toBeGreaterThan(Math.max(...upperYs) + 400);
    expect(level11LowerAsteroid.curve.some((command) => command.kind === "line")).toBe(true);
    expect(level11UpperAsteroid.curve.some((command) => command.kind === "line")).toBe(true);
  });

  it("keeps the difficult upper route as the bonus branch in sectors 14 and 15", () => {
    const [sector14Regular, sector14Bonus] = level14.goals;
    const [sector15Regular, sector15Bonus] = level15.goals;
    expect(sector14Regular.closeEdges).toEqual([]);
    expect(sector14Bonus.bonusScore).toBe(LEVEL14_RIGHT_BONUS);
    expect(sector15Regular.closeEdges).toEqual([]);
    expect(sector15Bonus.bonusScore).toBe(LEVEL15_RIGHT_BONUS);
    expect(goalPolygon(sector15Bonus, 390, level15.worldHeight).length).toBeGreaterThan(20);
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
    [level14, [
      { x: 140, y: 1050 },
      { x: 330, y: 1000 },
      { x: 330, y: 950 },
    ]],
    [level15, [
      { x: 140, y: 1450 },
      { x: 300, y: 1400 },
      { x: 390, y: 1100 },
    ]],
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

  it.each([level11, level12, level13, level14, level15])(
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

  it("preserves the bonus outcome for the sector 15 right branch", () => {
    const sim = flyWithBlasts(level15, [
      { x: 140, y: 1450 },
      { x: 300, y: 1400 },
      { x: 390, y: 1100 },
    ]);
    expect(goalBonus(level15.goals, sim.state.successGoalId)).toBe(LEVEL15_RIGHT_BONUS);
  });
});

type Level = typeof level11;
type Bomb = { x: number; y: number };

function flyWithBlasts(level: Level, bombs: Bomb[]): GameSimulation {
  const sim = new GameSimulation(level);
  for (const bomb of bombs) {
    sim.enqueue({ type: "place", x: bomb.x, y: bomb.y });
  }
  sim.enqueue({ type: "launch" });
  sim.updateFixed(FIXED_DT);
  const pending = bombs.map((bomb, index) => ({
    id: `b${index + 1}`,
    y: bomb.y,
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
