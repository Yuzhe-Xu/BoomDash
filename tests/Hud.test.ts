import { describe, expect, it } from "vitest";
import { isCountdownWarning, remainingTime } from "../src/ui/Hud";

describe("countdown HUD", () => {
  it("counts remaining time down to zero", () => {
    expect(remainingTime(0, 15)).toBe(15);
    expect(remainingTime(4.5, 15)).toBe(10.5);
    expect(remainingTime(15, 15)).toBe(0);
    expect(remainingTime(18, 15)).toBe(0);
  });

  it("warns in the last three seconds", () => {
    expect(isCountdownWarning(3)).toBe(true);
    expect(isCountdownWarning(2.4)).toBe(true);
    expect(isCountdownWarning(3.1)).toBe(false);
    expect(isCountdownWarning(0)).toBe(false);
  });
});
