import type { PlanetDefinition } from "../level/LevelDefinition";
import type { Ship } from "./GameState";
import { EPSILON, type Vec2 } from "./Vec2";

export function planetsOf(planets: PlanetDefinition[] | undefined): PlanetDefinition[] {
  return planets ?? [];
}

export function gravityAcceleration(position: Vec2, planets: PlanetDefinition[] | undefined): Vec2 {
  let ax = 0;
  let ay = 0;
  for (const planet of planetsOf(planets)) {
    const mu = planet.gravitationalParameter;
    if (!Number.isFinite(mu) || mu <= 0) {
      continue;
    }
    const dx = planet.center.x - position.x;
    const dy = planet.center.y - position.y;
    const distSq = dx * dx + dy * dy;
    if (distSq <= EPSILON * EPSILON) {
      continue;
    }
    const invDist = 1 / Math.sqrt(distSq);
    const scale = mu * invDist * invDist * invDist;
    if (!Number.isFinite(scale)) {
      continue;
    }
    ax += dx * scale;
    ay += dy * scale;
  }
  return {
    x: Number.isFinite(ax) ? ax : 0,
    y: Number.isFinite(ay) ? ay : 0,
  };
}

export function shipHitsPlanet(ship: Ship, planet: PlanetDefinition): boolean {
  const radius = Math.max(0, planet.radius) + ship.radius;
  if (pointHitsCircle(ship.position, planet.center, radius)) {
    return true;
  }
  if (pointHitsCircle(ship.prevPosition, planet.center, radius)) {
    return true;
  }
  return segmentHitsCircle(ship.prevPosition, ship.position, planet.center, radius);
}

export function shipHitsAnyPlanet(ship: Ship, planets: PlanetDefinition[] | undefined): boolean {
  return planetsOf(planets).some((planet) => shipHitsPlanet(ship, planet));
}

function pointHitsCircle(point: Vec2, center: Vec2, radius: number): boolean {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return dx * dx + dy * dy <= radius * radius;
}

function segmentHitsCircle(start: Vec2, end: Vec2, center: Vec2, radius: number): boolean {
  const abx = end.x - start.x;
  const aby = end.y - start.y;
  const acx = center.x - start.x;
  const acy = center.y - start.y;
  const abLenSq = abx * abx + aby * aby;
  if (abLenSq <= EPSILON * EPSILON) {
    return pointHitsCircle(start, center, radius);
  }
  const t = Math.max(0, Math.min(1, (acx * abx + acy * aby) / abLenSq));
  return pointHitsCircle({ x: start.x + abx * t, y: start.y + aby * t }, center, radius);
}
