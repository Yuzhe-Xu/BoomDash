import type { GameEvent } from "../app/GameEvents";

export function eventFromKey(key: string, selectedId: string | null): GameEvent | null {
  if (key === " " || key === "Enter") {
    return { type: "launch" };
  }
  if (key === "Escape" || key === "p" || key === "P") {
    return { type: "pause" };
  }
  if (key === "Delete" || key === "Backspace") {
    return { type: "delete" };
  }
  if (key === "r" || key === "R") {
    return { type: "retry" };
  }
  if (key === "n" || key === "N") {
    return { type: "redeploy" };
  }
  if (selectedId && (key === "x" || key === "X")) {
    return { type: "detonate", id: selectedId };
  }
  return null;
}
