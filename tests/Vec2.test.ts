import { describe, expect, it } from "vitest";
import { add, length, normalize, scale, sub, vec2, zero } from "../src/simulation/Vec2";

describe("Vec2", () => {
  it("adds and subtracts", () => {
    expect(add(vec2(1, 2), vec2(3, 4))).toEqual({ x: 4, y: 6 });
    expect(sub(vec2(3, 4), vec2(1, 2))).toEqual({ x: 2, y: 2 });
  });

  it("computes length and scale", () => {
    expect(length(vec2(3, 4))).toBe(5);
    expect(scale(vec2(2, -1), 3)).toEqual({ x: 6, y: -3 });
  });

  it("normalizes and handles zero", () => {
    expect(normalize(vec2(0, -8))).toEqual({ x: 0, y: -1 });
    expect(normalize(zero())).toEqual({ x: 0, y: 0 });
  });
});
