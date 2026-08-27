export type GameEvent =
  | { type: "place"; x: number; y: number }
  | { type: "select"; id: string }
  | { type: "move"; id: string; x: number; y: number }
  | { type: "delete" }
  | { type: "clear" }
  | { type: "launch" }
  | { type: "detonate"; id: string }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "retry" }
  | { type: "redeploy" };

export type RecordedInput = {
  tick: number;
  event: GameEvent;
};
