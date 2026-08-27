import { describe, expect, it } from "vitest";
import { Camera } from "../src/input/Camera";
import { LOGICAL_HEIGHT } from "../src/level/LevelDefinition";

describe("Camera", () => {
  it("starts at the bottom of a tall world", () => {
    const camera = new Camera();
    camera.reset(1688);
    expect(camera.offsetY).toBe(1688 - LOGICAL_HEIGHT);
  });

  it("clamps scrolling to the world bounds", () => {
    const camera = new Camera();
    camera.reset(1688);
    camera.panBy(-2000, 1688);
    expect(camera.offsetY).toBe(0);
    camera.panBy(2000, 1688);
    expect(camera.offsetY).toBe(1688 - LOGICAL_HEIGHT);
  });

  it("converts viewport points into world points", () => {
    const camera = new Camera();
    camera.reset(1688);
    expect(camera.worldPoint({ x: 40, y: 10 })).toEqual({ x: 40, y: 854 });
  });

  it("follows a flying ship while respecting the top and bottom bounds", () => {
    const camera = new Camera();
    camera.reset(1688);
    camera.follow(900, 1688);
    expect(camera.offsetY).toBeCloseTo(410.48);
    camera.follow(20, 1688);
    expect(camera.offsetY).toBe(0);
  });
});
