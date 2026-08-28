import { describe, expect, it } from "vitest";
import {
  circleRegion,
  cornerQuarterCircle,
  goalPolygon,
  pointInGoalRegion,
  roundedRectRegion,
  topClosedCircularArc,
  topClosedSemicircle,
  triangleRegion,
} from "../src/level/GoalGeometry";

describe("regular region geometry", () => {
  it("builds a top circular arc closed by the map edge", () => {
    const region = topClosedCircularArc("arc", 70, 320, 92);
    expect(region.curve[0]?.kind).toBe("arc");
    expect(region.closeEdges).toEqual(["top"]);
    expect(pointInGoalRegion(195, 50, region)).toBe(true);
    expect(pointInGoalRegion(10, 50, region)).toBe(false);
  });

  it("builds a top semicircle when depth equals half the chord", () => {
    const region = topClosedSemicircle("semi", 70, 320);
    const command = region.curve[0];
    expect(command?.kind).toBe("arc");
    if (command?.kind === "arc") {
      expect(command.radius).toBeCloseTo(125);
      expect(command.cy).toBeCloseTo(0);
    }
    expect(pointInGoalRegion(195, 80, region)).toBe(true);
  });

  it("builds a corner quarter circle", () => {
    const region = cornerQuarterCircle("corner", "top-left", 78);
    expect(region.closeEdges).toEqual(["left", "top"]);
    expect(pointInGoalRegion(28, 24, region)).toBe(true);
    expect(pointInGoalRegion(195, 20, region)).toBe(false);
  });

  it("builds a self-closed circle", () => {
    const region = circleRegion("circle", 195, 120, 44);
    expect(region.closeEdges).toEqual([]);
    expect(pointInGoalRegion(195, 120, region)).toBe(true);
    expect(pointInGoalRegion(195, 20, region)).toBe(false);
  });

  it("builds a rounded rectangle", () => {
    const region = roundedRectRegion("rect", 100, 400, 180, 80, 24);
    const polygon = goalPolygon(region);
    const xs = polygon.map((point) => point.x);
    const ys = polygon.map((point) => point.y);
    expect(region.curve.some((command) => command.kind === "arc")).toBe(true);
    expect(region.curve.some((command) => command.kind === "line")).toBe(true);
    expect(Math.min(...xs)).toBe(100);
    expect(Math.max(...xs)).toBe(280);
    expect(Math.min(...ys)).toBe(400);
    expect(Math.max(...ys)).toBe(480);
    expect(pointInGoalRegion(190, 440, region)).toBe(true);
    expect(pointInGoalRegion(90, 440, region)).toBe(false);
  });

  it("builds a triangle", () => {
    const region = triangleRegion(
      "tri",
      { x: 195, y: 400 },
      { x: 240, y: 480 },
      { x: 150, y: 480 },
    );
    expect(region.curve.every((command) => command.kind === "line")).toBe(true);
    expect(pointInGoalRegion(195, 450, region)).toBe(true);
    expect(pointInGoalRegion(100, 450, region)).toBe(false);
  });
});
