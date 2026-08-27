import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from "../level/LevelDefinition";
import { distance, type Vec2 } from "../simulation/Vec2";

export type PointerKind = "none" | "place" | "select" | "drag";

export type PointerSession = {
  kind: PointerKind;
  pointerId: number;
  start: Vec2;
  current: Vec2;
  bombId: string | null;
  moved: boolean;
};

const EMPTY: PointerSession = {
  kind: "none",
  pointerId: -1,
  start: { x: 0, y: 0 },
  current: { x: 0, y: 0 },
  bombId: null,
  moved: false,
};

export class PointerInput {
  session: PointerSession = { ...EMPTY };

  constructor(private readonly canvas: HTMLCanvasElement) {}

  clientToLogical(clientX: number, clientY: number): Vec2 | null {
    const rect = this.canvas.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }
    return {
      x: ((clientX - rect.left) / rect.width) * LOGICAL_WIDTH,
      y: ((clientY - rect.top) / rect.height) * LOGICAL_HEIGHT,
    };
  }

  hitRadius(): number {
    const rect = this.canvas.getBoundingClientRect();
    const cssScale = rect.width / LOGICAL_WIDTH;
    return Math.max(22 / cssScale, 16);
  }

  dragThreshold(): number {
    const rect = this.canvas.getBoundingClientRect();
    const cssScale = rect.width / LOGICAL_WIDTH;
    return 6 / cssScale;
  }

  begin(pointerId: number, point: Vec2, bombId: string | null): void {
    this.session = {
      kind: bombId ? "select" : "place",
      pointerId,
      start: point,
      current: point,
      bombId,
      moved: false,
    };
  }

  move(pointerId: number, point: Vec2): PointerSession {
    if (this.session.pointerId !== pointerId || this.session.kind === "none") {
      return this.session;
    }
    this.session.current = point;
    if (distance(this.session.start, point) >= this.dragThreshold()) {
      this.session.moved = true;
      if (this.session.bombId) {
        this.session.kind = "drag";
      }
    }
    return this.session;
  }

  end(pointerId: number): PointerSession {
    if (this.session.pointerId !== pointerId) {
      return { ...EMPTY };
    }
    const done = this.session;
    this.session = { ...EMPTY };
    return done;
  }

  cancel(): void {
    this.session = { ...EMPTY };
  }
}

export function pickBombAt(
  point: Vec2,
  bombs: Array<{ id: string; position: Vec2 }>,
  radius: number,
): string | null {
  let bestId: string | null = null;
  let bestDist = radius;
  for (const bomb of bombs) {
    const dist = distance(point, bomb.position);
    if (dist <= bestDist) {
      bestDist = dist;
      bestId = bomb.id;
    }
  }
  return bestId;
}
