import type { FailReason, GamePhase } from "../app/GamePhase";
import type { LevelDefinition } from "../level/LevelDefinition";
import type { Vec2 } from "./Vec2";
import { clone, vec2 } from "./Vec2";

export type Bomb = {
  id: string;
  position: Vec2;
  state: "armed" | "detonated";
  order: number;
};

export type Ship = {
  position: Vec2;
  prevPosition: Vec2;
  velocity: Vec2;
  radius: number;
};

export type ExplosionFx = {
  id: string;
  position: Vec2;
  age: number;
  duration: number;
  hit: boolean;
  impulse: Vec2;
};

export type RunState = {
  phase: GamePhase;
  resumePhase: GamePhase;
  elapsed: number;
  tick: number;
  ship: Ship;
  bombs: Bomb[];
  selectedId: string | null;
  nextBombId: number;
  failReason: FailReason | null;
  effects: ExplosionFx[];
  lastImpulse: Vec2;
  usedBombs: number;
};

export function createInitialState(level: LevelDefinition): RunState {
  return {
    phase: "planning",
    resumePhase: "planning",
    elapsed: 0,
    tick: 0,
    ship: resetShip(level),
    bombs: [],
    selectedId: null,
    nextBombId: 1,
    failReason: null,
    effects: [],
    lastImpulse: vec2(0, 0),
    usedBombs: 0,
  };
}

export function resetShip(level: LevelDefinition): Ship {
  const position = vec2(level.start.cx, level.start.cy - 8);
  return {
    position,
    prevPosition: clone(position),
    velocity: vec2(0, 0),
    radius: level.shipRadius,
  };
}
