import {
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  type CurveCommand,
  type GoalRegion,
  type MapEdge,
  type Point,
} from "./LevelDefinition";

const SAMPLE_STEPS = 24;

export function topClosedQuadraticGoal(
  id: string,
  leftX: number,
  rightX: number,
  depth: number,
): GoalRegion {
  return {
    id,
    start: { x: leftX, y: 0 },
    curve: [
      {
        kind: "quadratic",
        control: { x: (leftX + rightX) / 2, y: depth * 2 },
        to: { x: rightX, y: 0 },
      },
    ],
    closeEdges: ["top"],
  };
}

export function cornerQuadraticGoal(
  id: string,
  corner: "top-left" | "top-right",
  alongTop: number,
  alongSide: number,
  control: number,
  worldWidth = LOGICAL_WIDTH,
): GoalRegion {
  if (corner === "top-left") {
    return {
      id,
      start: { x: alongTop, y: 0 },
      curve: [
        {
          kind: "quadratic",
          control: { x: control, y: control },
          to: { x: 0, y: alongSide },
        },
      ],
      closeEdges: ["left", "top"],
    };
  }
  return {
    id,
    start: { x: worldWidth - alongTop, y: 0 },
    curve: [
      {
        kind: "quadratic",
        control: { x: worldWidth - control, y: control },
        to: { x: worldWidth, y: alongSide },
      },
    ],
    closeEdges: ["right", "top"],
  };
}

const CIRCLE_KAPPA = 0.5522847498307936;

export function closedCubicCircleGoal(
  id: string,
  cx: number,
  cy: number,
  radius: number,
): GoalRegion {
  const k = radius * CIRCLE_KAPPA;
  return {
    id,
    start: { x: cx, y: cy - radius },
    curve: [
      {
        kind: "cubic",
        c1: { x: cx + k, y: cy - radius },
        c2: { x: cx + radius, y: cy - k },
        to: { x: cx + radius, y: cy },
      },
      {
        kind: "cubic",
        c1: { x: cx + radius, y: cy + k },
        c2: { x: cx + k, y: cy + radius },
        to: { x: cx, y: cy + radius },
      },
      {
        kind: "cubic",
        c1: { x: cx - k, y: cy + radius },
        c2: { x: cx - radius, y: cy + k },
        to: { x: cx - radius, y: cy },
      },
      {
        kind: "cubic",
        c1: { x: cx - radius, y: cy - k },
        c2: { x: cx - k, y: cy - radius },
        to: { x: cx, y: cy - radius },
      },
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
  for (let i = 1; i <= steps; i += 1) {
    points.push(cubicPoint(current, command.c1, command.c2, command.to, i / steps));
  }
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
  closePath(): void;
};

export function traceGoalRegion(
  ctx: PathTrace,
  region: GoalRegion,
  worldWidth = LOGICAL_WIDTH,
  worldHeight = LOGICAL_HEIGHT,
): void {
  ctx.moveTo(region.start.x, region.start.y);
  for (const command of region.curve) {
    if (command.kind === "line") {
      ctx.lineTo(command.to.x, command.to.y);
    } else if (command.kind === "quadratic") {
      ctx.quadraticCurveTo(command.control.x, command.control.y, command.to.x, command.to.y);
    } else {
      ctx.bezierCurveTo(
        command.c1.x,
        command.c1.y,
        command.c2.x,
        command.c2.y,
        command.to.x,
        command.to.y,
      );
    }
  }
  for (const point of closurePoints(region.start, region.closeEdges, worldWidth, worldHeight)) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.closePath();
}

export function traceGoalCurve(
  ctx: Pick<PathTrace, "moveTo" | "lineTo" | "quadraticCurveTo" | "bezierCurveTo">,
  region: GoalRegion,
): void {
  ctx.moveTo(region.start.x, region.start.y);
  for (const command of region.curve) {
    if (command.kind === "line") {
      ctx.lineTo(command.to.x, command.to.y);
    } else if (command.kind === "quadratic") {
      ctx.quadraticCurveTo(command.control.x, command.control.y, command.to.x, command.to.y);
    } else {
      ctx.bezierCurveTo(
        command.c1.x,
        command.c1.y,
        command.c2.x,
        command.c2.y,
        command.to.x,
        command.to.y,
      );
    }
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
