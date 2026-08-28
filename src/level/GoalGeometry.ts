import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type CurveCommand,
  type GoalRegion,
  type MapEdge,
  type Point,
} from "./LevelDefinition";

const SAMPLE_STEPS = 24;
const TWO_PI = Math.PI * 2;

export function topClosedCircularArc(
  id: string,
  leftX: number,
  rightX: number,
  depth: number,
): GoalRegion {
  const cx = (leftX + rightX) / 2;
  const half = (rightX - leftX) / 2;
  const radius = (depth * depth + half * half) / (2 * depth);
  const cy = depth - radius;
  return {
    id,
    start: { x: leftX, y: 0 },
    curve: [
      {
        kind: "arc",
        cx,
        cy,
        radius,
        startAngle: Math.atan2(-cy, leftX - cx),
        endAngle: Math.atan2(-cy, rightX - cx),
        counterclockwise: true,
        to: { x: rightX, y: 0 },
      },
    ],
    closeEdges: ["top"],
  };
}

export function topClosedSemicircle(id: string, leftX: number, rightX: number): GoalRegion {
  return topClosedCircularArc(id, leftX, rightX, (rightX - leftX) / 2);
}

export function cornerQuarterCircle(
  id: string,
  corner: "top-left" | "top-right",
  radius: number,
  worldWidth = LOGICAL_WIDTH,
): GoalRegion {
  if (corner === "top-left") {
    return {
      id,
      start: { x: radius, y: 0 },
      curve: [
        {
          kind: "arc",
          cx: 0,
          cy: 0,
          radius,
          startAngle: 0,
          endAngle: Math.PI / 2,
          to: { x: 0, y: radius },
        },
      ],
      closeEdges: ["left", "top"],
    };
  }
  return {
    id,
    start: { x: worldWidth - radius, y: 0 },
    curve: [
      {
        kind: "arc",
        cx: worldWidth,
        cy: 0,
        radius,
        startAngle: Math.PI,
        endAngle: Math.PI / 2,
        counterclockwise: true,
        to: { x: worldWidth, y: radius },
      },
    ],
    closeEdges: ["right", "top"],
  };
}

export function cornerQuarterRing(
  id: string,
  corner: "top-left" | "top-right",
  innerRadius: number,
  outerRadius: number,
  worldWidth = LOGICAL_WIDTH,
): GoalRegion {
  if (innerRadius <= 0 || outerRadius <= innerRadius) {
    throw new Error("Quarter ring radii must satisfy 0 < innerRadius < outerRadius");
  }
  if (corner === "top-left") {
    return {
      id,
      start: { x: outerRadius, y: 0 },
      curve: [
        {
          kind: "arc",
          cx: 0,
          cy: 0,
          radius: outerRadius,
          startAngle: 0,
          endAngle: Math.PI / 2,
          to: { x: 0, y: outerRadius },
        },
        { kind: "line", to: { x: 0, y: innerRadius } },
        {
          kind: "arc",
          cx: 0,
          cy: 0,
          radius: innerRadius,
          startAngle: Math.PI / 2,
          endAngle: 0,
          counterclockwise: true,
          to: { x: innerRadius, y: 0 },
        },
      ],
      closeEdges: [],
    };
  }
  return {
    id,
    start: { x: worldWidth - outerRadius, y: 0 },
    curve: [
      {
        kind: "arc",
        cx: worldWidth,
        cy: 0,
        radius: outerRadius,
        startAngle: Math.PI,
        endAngle: Math.PI / 2,
        counterclockwise: true,
        to: { x: worldWidth, y: outerRadius },
      },
      { kind: "line", to: { x: worldWidth, y: innerRadius } },
      {
        kind: "arc",
        cx: worldWidth,
        cy: 0,
        radius: innerRadius,
        startAngle: Math.PI / 2,
        endAngle: Math.PI,
        to: { x: worldWidth - innerRadius, y: 0 },
      },
    ],
    closeEdges: [],
  };
}

export function circleRegion(id: string, cx: number, cy: number, radius: number): GoalRegion {
  return {
    id,
    start: { x: cx, y: cy - radius },
    curve: [
      {
        kind: "arc",
        cx,
        cy,
        radius,
        startAngle: -Math.PI / 2,
        endAngle: -Math.PI / 2 + TWO_PI,
        to: { x: cx, y: cy - radius },
      },
    ],
    closeEdges: [],
  };
}

export function roundedRectRegion(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  cornerRadius: number,
): GoalRegion {
  const r = Math.max(0, Math.min(cornerRadius, width / 2, height / 2));
  const x2 = x + width;
  const y2 = y + height;
  return {
    id,
    start: { x: x + r, y },
    curve: [
      { kind: "line", to: { x: x2 - r, y } },
      {
        kind: "arc",
        cx: x2 - r,
        cy: y + r,
        radius: r,
        startAngle: -Math.PI / 2,
        endAngle: 0,
        to: { x: x2, y: y + r },
      },
      { kind: "line", to: { x: x2, y: y2 - r } },
      {
        kind: "arc",
        cx: x2 - r,
        cy: y2 - r,
        radius: r,
        startAngle: 0,
        endAngle: Math.PI / 2,
        to: { x: x2 - r, y: y2 },
      },
      { kind: "line", to: { x: x + r, y: y2 } },
      {
        kind: "arc",
        cx: x + r,
        cy: y2 - r,
        radius: r,
        startAngle: Math.PI / 2,
        endAngle: Math.PI,
        to: { x: x, y: y2 - r },
      },
      { kind: "line", to: { x: x, y: y + r } },
      {
        kind: "arc",
        cx: x + r,
        cy: y + r,
        radius: r,
        startAngle: Math.PI,
        endAngle: (Math.PI * 3) / 2,
        to: { x: x + r, y },
      },
    ],
    closeEdges: [],
  };
}

export function roundedRectCentered(
  id: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  cornerRadius = Math.min(rx, ry) * 0.55,
): GoalRegion {
  return roundedRectRegion(id, cx - rx, cy - ry, rx * 2, ry * 2, cornerRadius);
}

export function triangleRegion(id: string, a: Point, b: Point, c: Point): GoalRegion {
  return {
    id,
    start: { ...a },
    curve: [
      { kind: "line", to: { ...b } },
      { kind: "line", to: { ...c } },
    ],
    closeEdges: [],
  };
}

export function closurePoints(
  to: Point,
  edges: MapEdge[],
  worldWidth: number,
  worldHeight: number,
): Point[] {
  if (edges.length === 0) {
    return [to];
  }
  const points: Point[] = [];
  for (let i = 0; i < edges.length - 1; i += 1) {
    points.push(cornerBetween(edges[i], edges[i + 1], worldWidth, worldHeight));
  }
  points.push(to);
  return points;
}

function cornerBetween(a: MapEdge, b: MapEdge, worldWidth: number, worldHeight: number): Point {
  const names = new Set([a, b]);
  return {
    x: names.has("right") ? worldWidth : 0,
    y: names.has("bottom") ? worldHeight : 0,
  };
}

export function goalPolygon(
  region: GoalRegion,
  worldWidth = LOGICAL_WIDTH,
  worldHeight = LOGICAL_HEIGHT,
  steps = SAMPLE_STEPS,
): Point[] {
  const points: Point[] = [{ ...region.start }];
  let current = region.start;
  for (const command of region.curve) {
    appendCommand(points, current, command, steps);
    current = command.to;
  }
  for (const point of closurePoints(region.start, region.closeEdges, worldWidth, worldHeight)) {
    const last = points[points.length - 1];
    if (last.x !== point.x || last.y !== point.y) {
      points.push(point);
    }
  }
  const first = points[0];
  const last = points[points.length - 1];
  if (points.length > 1 && last.x === first.x && last.y === first.y) {
    points.pop();
  }
  return points;
}

function appendCommand(points: Point[], current: Point, command: CurveCommand, steps: number): void {
  if (command.kind === "line") {
    points.push({ ...command.to });
    return;
  }
  if (command.kind === "quadratic") {
    for (let i = 1; i <= steps; i += 1) {
      points.push(quadraticPoint(current, command.control, command.to, i / steps));
    }
    return;
  }
  if (command.kind === "cubic") {
    for (let i = 1; i <= steps; i += 1) {
      points.push(cubicPoint(current, command.c1, command.c2, command.to, i / steps));
    }
    return;
  }
  const delta = canvasArcDelta(command.startAngle, command.endAngle, command.counterclockwise === true);
  const count = Math.max(8, Math.ceil((steps * Math.abs(delta)) / (Math.PI / 2)));
  for (let i = 1; i <= count; i += 1) {
    const angle = command.startAngle + delta * (i / count);
    points.push({
      x: command.cx + command.radius * Math.cos(angle),
      y: command.cy + command.radius * Math.sin(angle),
    });
  }
  const last = points[points.length - 1];
  last.x = command.to.x;
  last.y = command.to.y;
}

function canvasArcDelta(startAngle: number, endAngle: number, counterclockwise: boolean): number {
  if (counterclockwise) {
    let delta = endAngle - startAngle;
    while (delta >= 0) {
      delta -= TWO_PI;
    }
    if (delta === 0) {
      delta = -TWO_PI;
    }
    return delta;
  }
  let delta = endAngle - startAngle;
  while (delta <= 0) {
    delta += TWO_PI;
  }
  if (delta === 0) {
    delta = TWO_PI;
  }
  return delta;
}

export function pointInPolygon(x: number, y: number, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    const crosses = a.y > y !== b.y > y;
    if (crosses && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

export function distanceToPolygon(x: number, y: number, polygon: Point[]): number {
  if (polygon.length === 0) {
    return Number.POSITIVE_INFINITY;
  }
  if (pointInPolygon(x, y, polygon)) {
    return 0;
  }
  let min = Number.POSITIVE_INFINITY;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    min = Math.min(min, distanceToSegment({ x, y }, polygon[j], polygon[i]));
  }
  return min;
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) {
    return Math.hypot(p.x - a.x, p.y - a.y);
  }
  const t = Math.min(1, Math.max(0, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

export function pointInGoalRegion(
  x: number,
  y: number,
  region: GoalRegion,
  worldWidth = LOGICAL_WIDTH,
  worldHeight = LOGICAL_HEIGHT,
): boolean {
  return pointInPolygon(x, y, goalPolygon(region, worldWidth, worldHeight));
}

export function circleHitsGoalRegion(
  x: number,
  y: number,
  radius: number,
  region: GoalRegion,
  worldWidth = LOGICAL_WIDTH,
  worldHeight = LOGICAL_HEIGHT,
): boolean {
  return distanceToPolygon(x, y, goalPolygon(region, worldWidth, worldHeight)) <= radius;
}

export function referenceGoalY(
  goals: GoalRegion[],
  worldWidth = LOGICAL_WIDTH,
  worldHeight = LOGICAL_HEIGHT,
): number {
  let minY = worldHeight;
  for (const region of goals) {
    for (const point of goalPolygon(region, worldWidth, worldHeight)) {
      minY = Math.min(minY, point.y);
    }
  }
  return minY;
}

export type PathTrace = {
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
  closePath(): void;
};

function traceCommand(ctx: Omit<PathTrace, "closePath">, command: CurveCommand): void {
  if (command.kind === "line") {
    ctx.lineTo(command.to.x, command.to.y);
    return;
  }
  if (command.kind === "quadratic") {
    ctx.quadraticCurveTo(command.control.x, command.control.y, command.to.x, command.to.y);
    return;
  }
  if (command.kind === "cubic") {
    ctx.bezierCurveTo(
      command.c1.x,
      command.c1.y,
      command.c2.x,
      command.c2.y,
      command.to.x,
      command.to.y,
    );
    return;
  }
  ctx.arc(
    command.cx,
    command.cy,
    command.radius,
    command.startAngle,
    command.endAngle,
    command.counterclockwise === true,
  );
}

export function traceGoalRegion(
  ctx: PathTrace,
  region: GoalRegion,
  worldWidth = LOGICAL_WIDTH,
  worldHeight = LOGICAL_HEIGHT,
): void {
  ctx.moveTo(region.start.x, region.start.y);
  for (const command of region.curve) {
    traceCommand(ctx, command);
  }
  for (const point of closurePoints(region.start, region.closeEdges, worldWidth, worldHeight)) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.closePath();
}

export function traceGoalCurve(
  ctx: Omit<PathTrace, "closePath">,
  region: GoalRegion,
): void {
  ctx.moveTo(region.start.x, region.start.y);
  for (const command of region.curve) {
    traceCommand(ctx, command);
  }
}

function quadraticPoint(p0: Point, c: Point, p1: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * c.x + t * t * p1.x,
    y: mt * mt * p0.y + 2 * mt * t * c.y + t * t * p1.y,
  };
}

function cubicPoint(p0: Point, c1: Point, c2: Point, p1: Point, t: number): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x: mt2 * mt * p0.x + 3 * mt2 * t * c1.x + 3 * mt * t2 * c2.x + t2 * t * p1.x,
    y: mt2 * mt * p0.y + 3 * mt2 * t * c1.y + 3 * mt * t2 * c2.y + t2 * t * p1.y,
  };
}
