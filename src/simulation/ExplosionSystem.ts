import { EPSILON, length, scale, sub, type Vec2, zero } from "./Vec2";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function computeImpulse(
  shipPosition: Vec2,
  bombPosition: Vec2,
  blastRadius: number,
  maxImpulse: number,
): Vec2 {
  const delta = sub(shipPosition, bombPosition);
  const distance = length(delta);

  if (distance > blastRadius) {
    return zero();
  }

  const direction =
    distance > EPSILON ? { x: delta.x / distance, y: delta.y / distance } : { x: 0, y: -1 };

  const falloff = Math.pow(clamp(1 - distance / blastRadius, 0, 1), 2);
  return scale(direction, maxImpulse * falloff);
}
