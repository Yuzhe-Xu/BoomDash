export type GamePhase = "planning" | "flying" | "paused" | "success" | "failed";

export type FailReason = "out-of-bounds" | "overshoot" | "timeout" | "asteroid" | "planet";

export type BombState = "armed" | "detonated";

export function canPlace(phase: GamePhase): boolean {
  return phase === "planning";
}

export function canDetonate(phase: GamePhase): boolean {
  return phase === "flying";
}

export function isFrozen(phase: GamePhase): boolean {
  return phase === "paused" || phase === "success" || phase === "failed";
}

export function isSimulating(phase: GamePhase): boolean {
  return phase === "flying";
}
