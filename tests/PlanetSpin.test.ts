import { describe, expect, it } from "vitest";
import type { PlanetDefinition } from "../src/level/LevelDefinition";
import { level31Planet } from "../src/level/level31";
import { level33LowerPlanet, level33UpperPlanet } from "../src/level/level33";
import {
  DEFAULT_PLANET_SPIN_RATE,
  planetSpinAngle,
  planetSpinRate,
} from "../src/rendering/planetSpin";

const sample: PlanetDefinition = {
  id: "planet-a",
  center: { x: 0, y: 0 },
  radius: 40,
  gravitationalParameter: 1,
};

describe("planet spin", () => {
  it("uses an explicit spin rate and phase", () => {
    const planet = { ...sample, spinRate: 0.5, spinPhase: 0.1 };
    expect(planetSpinRate(planet)).toBe(0.5);
    expect(planetSpinAngle(planet, 2)).toBeCloseTo(1.1, 10);
  });

  it("gives a stable non-zero default that differs between planets", () => {
    expect(planetSpinRate(sample)).not.toBe(0);
    expect(Math.abs(planetSpinRate(sample))).toBeGreaterThan(0.1);
    expect(planetSpinRate(level31Planet)).not.toBe(0);
    expect(planetSpinRate(level33LowerPlanet)).not.toBe(planetSpinRate(level33UpperPlanet));
    expect(planetSpinAngle(sample, 0)).toBe(0);
    expect(planetSpinAngle(sample, 10)).toBe(planetSpinRate(sample) * 10);
  });

  it("keeps the default rate in a slow visible range", () => {
    expect(DEFAULT_PLANET_SPIN_RATE).toBeGreaterThan(0.1);
    expect(DEFAULT_PLANET_SPIN_RATE).toBeLessThan(0.4);
  });
});
