import type { LevelDefinition } from "../level/LevelDefinition";
import { computeImpulse } from "./ExplosionSystem";
import type { Bomb, ExplosionFx, RunState, Ship } from "./GameState";
import { length } from "./Vec2";

export const FIXED_DT = 1 / 120;
export const EXPLOSION_DURATION = 0.26;

export function applyImpulse(ship: Ship, impulse: { x: number; y: number }, speedCap: number): Ship {
  const velocity = {
    x: ship.velocity.x + impulse.x,
    y: ship.velocity.y + impulse.y,
  };
  const speed = length(velocity);
  if (speed > speedCap) {
    const k = speedCap / speed;
    velocity.x *= k;
    velocity.y *= k;
  }
  return { ...ship, velocity };
}

export function integrateShip(ship: Ship, dt: number): Ship {
  return {
    ...ship,
    prevPosition: { ...ship.position },
    position: {
      x: ship.position.x + ship.velocity.x * dt,
      y: ship.position.y + ship.velocity.y * dt,
    },
  };
}

export function applyDrag(ship: Ship, dragPerSecond: number, dt: number): Ship {
  if (dragPerSecond <= 0 || dt <= 0) {
    return ship;
  }
  const multiplier = Math.exp(-dragPerSecond * dt);
  return {
    ...ship,
    velocity: {
      x: ship.velocity.x * multiplier,
      y: ship.velocity.y * multiplier,
    },
  };
}

export function detonateBomb(
  state: RunState,
  bombId: string,
  level: LevelDefinition,
): { bombs: Bomb[]; ship: Ship; effect: ExplosionFx | null; usedBombs: number } {
  const bomb = state.bombs.find((item) => item.id === bombId);
  if (!bomb || bomb.state === "detonated") {
    return { bombs: state.bombs, ship: state.ship, effect: null, usedBombs: state.usedBombs };
  }

  const impulse = computeImpulse(
    state.ship.position,
    bomb.position,
    level.blastRadius,
    level.maxImpulse,
  );
  const hit = length(impulse) > 0;
  const ship = applyImpulse(state.ship, impulse, level.speedCap);
  const bombs = state.bombs.map((item) =>
    item.id === bombId ? { ...item, state: "detonated" as const } : item,
  );

  return {
    bombs,
    ship,
    usedBombs: state.usedBombs + 1,
    effect: {
      id: bomb.id,
      position: { ...bomb.position },
      age: 0,
      duration: EXPLOSION_DURATION,
      hit,
      impulse,
    },
  };
}

export function ageEffects(effects: ExplosionFx[], dt: number): ExplosionFx[] {
  return effects
    .map((fx) => ({ ...fx, age: fx.age + dt }))
    .filter((fx) => fx.age < fx.duration);
}

export function launchShip(ship: Ship, launchVelocity: number): Ship {
  return {
    ...ship,
    prevPosition: { ...ship.position },
    velocity: { x: 0, y: launchVelocity },
  };
}

export function remainingBombs(state: RunState): number {
  return state.bombs.filter((bomb) => bomb.state === "armed").length;
}

export function rearmBombs(bombs: Bomb[]): Bomb[] {
  return bombs.map((bomb) => ({ ...bomb, state: "armed" as const }));
}
