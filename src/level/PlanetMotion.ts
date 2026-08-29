import type { PlanetDefinition, Point } from "./LevelDefinition";

export function planetAtTime(planet: PlanetDefinition, elapsed: number): PlanetDefinition {
  const motion = planet.motion;
  if (!motion || elapsed === 0) {
    return planet;
  }

  if (motion.linearVelocity) {
    return {
      ...planet,
      center: {
        x: planet.center.x + motion.linearVelocity.x * elapsed,
        y: planet.center.y + motion.linearVelocity.y * elapsed,
      },
    };
  }

  const angle = (motion.initialAngle ?? 0) + motion.angularVelocity * elapsed;
  const offsetX = planet.center.x - motion.center.x;
  const offsetY = planet.center.y - motion.center.y;
  const center: Point = {
    x: motion.center.x + offsetX * Math.cos(angle) - offsetY * Math.sin(angle),
    y: motion.center.y + offsetX * Math.sin(angle) + offsetY * Math.cos(angle),
  };
  return { ...planet, center };
}

export function planetsAtTime(
  planets: PlanetDefinition[] | undefined,
  elapsed: number,
): PlanetDefinition[] {
  return (planets ?? []).map((planet) => planetAtTime(planet, elapsed));
}
