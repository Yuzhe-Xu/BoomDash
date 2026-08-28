import { describe, expect, it } from "vitest";
import type { PlanetDefinition } from "../src/level/LevelDefinition";
import { evaluateLifecycle } from "../src/simulation/LifecycleBounds";
import {
  gravityAcceleration,
  shipHitsAnyPlanet,
  shipHitsPlanet,
} from "../src/simulation/GravitySystem";
import type { Ship } from "../src/simulation/GameState";
import { applyAcceleration, FIXED_DT, integrateShip } from "../src/simulation/ShipSimulator";
import { length, vec2 } from "../src/simulation/Vec2";
import { level1 } from "../src/level/level1";

function planetAt(
  x: number,
  y: number,
  radius = 40,
  gravitationalParameter = 640000,
): PlanetDefinition {
  return {
    id: "test-planet",
    center: { x, y },
    radius,
    gravitationalParameter,
  };
}

function shipAt(
  x: number,
  y: number,
  vx = 0,
  vy = 0,
  prevX = x,
  prevY = y,
): Ship {
  return {
    position: vec2(x, y),
    prevPosition: vec2(prevX, prevY),
    velocity: vec2(vx, vy),
    radius: 14,
  };
}

describe("gravityAcceleration", () => {
  it("points toward the planet and follows the inverse-square law", () => {
    const planet = planetAt(0, 0, 20, 10000);
    const near = gravityAcceleration({ x: 10, y: 0 }, [planet]);
    const far = gravityAcceleration({ x: 20, y: 0 }, [planet]);

    expect(near.x).toBeLessThan(0);
    expect(near.y).toBeCloseTo(0, 10);
    expect(near.x).toBeCloseTo(-100, 8);
    expect(far.x).toBeCloseTo(near.x / 4, 8);
  });

  it("sums multiple planets and cancels symmetric fields", () => {
    const left = planetAt(-30, 0, 10, 8000);
    const right = planetAt(30, 0, 10, 8000);
    const summed = gravityAcceleration({ x: 0, y: 0 }, [left, right]);
    const onlyLeft = gravityAcceleration({ x: 0, y: 0 }, [left]);

    expect(summed.x).toBeCloseTo(0, 10);
    expect(summed.y).toBeCloseTo(0, 10);
    expect(onlyLeft.x).toBeLessThan(0);
  });

  it("does not use ship velocity and stays finite at the center", () => {
    const planet = planetAt(40, 80, 20, 50000);
    const position = { x: 10, y: 20 };
    const a = gravityAcceleration(position, [planet]);
    const same = gravityAcceleration(position, [planet]);
    const atCenter = gravityAcceleration(planet.center, [planet]);
    const invalid = gravityAcceleration(position, [
      { ...planet, gravitationalParameter: -8 },
      { ...planet, gravitationalParameter: Number.NaN },
    ]);

    expect(a).toEqual(same);
    expect(atCenter).toEqual({ x: 0, y: 0 });
    expect(invalid).toEqual({ x: 0, y: 0 });
    expect(gravityAcceleration(position, [])).toEqual({ x: 0, y: 0 });
    expect(Number.isFinite(a.x)).toBe(true);
    expect(Number.isFinite(a.y)).toBe(true);
  });
});

describe("planet collision", () => {
  it("detects exterior, tangent, interior and swept hits", () => {
    const planet = planetAt(100, 100, 40);
    expect(shipHitsPlanet(shipAt(200, 100), planet)).toBe(false);
    expect(shipHitsPlanet(shipAt(154, 100), planet)).toBe(true);
    expect(shipHitsPlanet(shipAt(100, 100), planet)).toBe(true);
    expect(shipHitsPlanet(shipAt(200, 100, 0, 0, -20, 100), planet)).toBe(true);
    expect(shipHitsAnyPlanet(shipAt(200, 100), [planet])).toBe(false);
  });
});

describe("gravity integration", () => {
  it("keeps the same acceleration at one point but splits later paths by velocity", () => {
    const planet = planetAt(0, 0, 20, 640000);
    const slow = shipAt(120, 0, 0, 20);
    const fast = shipAt(120, 0, 0, 90);
    expect(gravityAcceleration(slow.position, [planet])).toEqual(
      gravityAcceleration(fast.position, [planet]),
    );

    let slowShip = slow;
    let fastShip = fast;
    for (let i = 0; i < 120; i += 1) {
      slowShip = applyAcceleration(
        slowShip,
        gravityAcceleration(slowShip.position, [planet]),
        FIXED_DT,
      );
      slowShip = integrateShip(slowShip, FIXED_DT);
      fastShip = applyAcceleration(
        fastShip,
        gravityAcceleration(fastShip.position, [planet]),
        FIXED_DT,
      );
      fastShip = integrateShip(fastShip, FIXED_DT);
    }

    expect(Math.hypot(slowShip.position.x - fastShip.position.x, slowShip.position.y - fastShip.position.y)).toBeGreaterThan(8);
  });

  it("keeps a circular orbit from diverging over two periods", () => {
    const mu = 640000;
    const radius = 100;
    const speed = Math.sqrt(mu / radius);
    const planet = planetAt(0, 0, 20, mu);
    let ship = shipAt(radius, 0, 0, speed);
    const period = (2 * Math.PI * Math.sqrt(radius ** 3 / mu)) / FIXED_DT;
    const steps = Math.round(period * 2);

    for (let i = 0; i < steps; i += 1) {
      ship = applyAcceleration(ship, gravityAcceleration(ship.position, [planet]), FIXED_DT);
      ship = integrateShip(ship, FIXED_DT);
    }

    const drifted = Math.hypot(ship.position.x, ship.position.y);
    expect(drifted).toBeGreaterThan(radius * 0.82);
    expect(drifted).toBeLessThan(radius * 1.18);
    expect(length(ship.velocity)).toBeGreaterThan(speed * 0.82);
    expect(length(ship.velocity)).toBeLessThan(speed * 1.18);
  });
});

describe("planet lifecycle", () => {
  it("fails on planet contact before a simultaneous goal entry", () => {
    const planet = planetAt(195, 50, 40);
    const overlapping = shipAt(195, 50);
    expect(
      evaluateLifecycle(overlapping, level1.goals, 1, 15, 844, [], [planet]),
    ).toEqual({ kind: "failed", reason: "planet" });
    expect(evaluateLifecycle(shipAt(195, 400), level1.goals, 1, 15)).toEqual({ kind: "alive" });
  });
});
