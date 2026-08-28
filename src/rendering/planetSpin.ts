import type { PlanetDefinition } from "../level/LevelDefinition";

export const DEFAULT_PLANET_SPIN_RATE = 0.22;

export function planetSpinRate(planet: PlanetDefinition): number {
  if (planet.spinRate !== undefined) {
    return planet.spinRate;
  }
  let hash = 0;
  for (let index = 0; index < planet.id.length; index += 1) {
    hash = (Math.imul(hash, 31) + planet.id.charCodeAt(index)) | 0;
  }
  const sign = (hash & 1) === 0 ? 1 : -1;
  const magnitude = 0.14 + ((Math.abs(hash) >>> 1) % 17) * 0.01;
  return sign * magnitude;
}

export function planetSpinAngle(planet: PlanetDefinition, elapsed: number): number {
  return (planet.spinPhase ?? 0) + planetSpinRate(planet) * elapsed;
}
