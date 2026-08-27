import { traceGoalCurve, traceGoalRegion } from "../level/GoalGeometry";
import type { GoalRegion, LevelDefinition } from "../level/LevelDefinition";
import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from "../level/LevelDefinition";
import type { Bomb, RunState } from "../simulation/GameState";
import { lerp } from "../simulation/Vec2";
import { EffectsRenderer } from "./EffectsRenderer";

const STAR_SEED = 1801;

export class CanvasRenderer {
  readonly effects = new EffectsRenderer();
  private readonly stars = new Map<number, Array<{ x: number; y: number; s: number; a: number }>>();
  private seenFx = new Set<string>();
  private launchFlash = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
  ) {}

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssScale = Math.min(rect.width / LOGICAL_WIDTH, rect.height / LOGICAL_HEIGHT);
    const width = Math.max(1, Math.round(LOGICAL_WIDTH * cssScale * dpr));
    const height = Math.max(1, Math.round(LOGICAL_HEIGHT * cssScale * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  flashLaunch(): void {
    this.launchFlash = 0.28;
  }

  resetVisuals(): void {
    this.effects.clear();
    this.seenFx.clear();
    this.launchFlash = 0;
  }

  render(
    state: RunState,
    level: LevelDefinition,
    alpha: number,
    dt: number,
    debug: boolean,
    cameraY = 0,
  ): void {
    this.resize();
    const { ctx } = this;
    const scale = Math.min(
      this.canvas.width / LOGICAL_WIDTH,
      this.canvas.height / LOGICAL_HEIGHT,
    );
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    for (const fx of state.effects) {
      if (!this.seenFx.has(fx.id)) {
        this.seenFx.add(fx.id);
        this.effects.spawnExplosion(fx);
      }
    }

    this.launchFlash = Math.max(0, this.launchFlash - dt);

    const shipPos =
      state.phase === "flying"
        ? lerp(state.ship.prevPosition, state.ship.position, alpha)
        : state.ship.position;

    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    this.drawBackdrop(cameraY, level.worldHeight);
    ctx.save();
    ctx.translate(0, -cameraY);
    const goalColor = state.phase === "success" ? "#9dffc4" : "#5dff9a";
    const goalBright = state.phase === "success";
    for (const region of level.goals) {
      this.drawGoalRegion(region, goalColor, goalBright, level.worldHeight);
    }
    this.effects.pushTrail(shipPos.x, shipPos.y, state.phase === "flying" || state.phase === "success");
    this.effects.draw(ctx, state.effects, dt);

    for (const bomb of state.bombs) {
      this.drawBomb(
        bomb,
        state.selectedId === bomb.id,
        level.blastRadius,
        state.phase === "planning",
      );
    }

    this.drawShip(shipPos.x, shipPos.y, state.ship.velocity.x, state.ship.velocity.y, state.phase);
    if (debug) {
      this.drawGoalDebug(level);
      this.effects.impulseHint(ctx, state.effects);
    }
    ctx.restore();
  }

  private drawBackdrop(cameraY: number, worldHeight: number): void {
    const { ctx } = this;
    const g = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    g.addColorStop(0, "#0a1018");
    g.addColorStop(1, "#07080d");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    for (const star of this.starsFor(worldHeight)) {
      const y = star.y - cameraY;
      if (y < -star.s || y > LOGICAL_HEIGHT) {
        continue;
      }
      ctx.fillStyle = `rgba(210, 240, 255, ${star.a})`;
      ctx.fillRect(star.x, y, star.s, star.s);
    }

    if (this.launchFlash > 0) {
      ctx.fillStyle = `rgba(61, 240, 255, ${this.launchFlash * 0.18})`;
      ctx.fillRect(0, LOGICAL_HEIGHT - 160, LOGICAL_WIDTH, 160);
    }
  }

  private starsFor(worldHeight: number): Array<{ x: number; y: number; s: number; a: number }> {
    const existing = this.stars.get(worldHeight);
    if (existing) {
      return existing;
    }
    const stars = createStars(Math.ceil((72 * worldHeight) / LOGICAL_HEIGHT), worldHeight);
    this.stars.set(worldHeight, stars);
    return stars;
  }

  private drawGoalRegion(
    region: GoalRegion,
    color: string,
    bright = false,
    worldHeight: number,
  ): void {
    const { ctx } = this;
    ctx.save();
    ctx.beginPath();
    traceGoalRegion(ctx, region, LOGICAL_WIDTH, worldHeight);
    ctx.fillStyle = bright ? "rgba(93, 255, 154, 0.22)" : hexAlpha(color, 0.1);
    ctx.fill();

    ctx.beginPath();
    traceGoalCurve(ctx, region);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = bright ? 22 : 12;
    ctx.stroke();
    ctx.restore();
  }

  private drawBomb(bomb: Bomb, selected: boolean, blastRadius: number, planning: boolean): void {
    const { ctx } = this;
    const { x, y } = bomb.position;
    const used = bomb.state === "detonated";
    ctx.save();
    if (selected && planning) {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(255, 43, 214, 0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, blastRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fillStyle = used ? "rgba(80, 90, 100, 0.45)" : "rgba(18, 8, 16, 0.92)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = used ? "rgba(127, 140, 150, 0.7)" : selected ? "#ff2bd6" : "#3df0ff";
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = used ? 0 : 10;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = selected ? "#ff2bd6" : "#d7f6ff";
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(bomb.order), x, y);
    ctx.restore();
  }

  private drawShip(x: number, y: number, vx: number, vy: number, phase: RunState["phase"]): void {
    const { ctx } = this;
    const flying = phase === "flying" || phase === "success";
    const angle = flying && (vx !== 0 || vy !== 0) ? Math.atan2(vy, vx) + Math.PI / 2 : 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (flying) {
      ctx.fillStyle = "rgba(61, 240, 255, 0.55)";
      ctx.beginPath();
      ctx.moveTo(-4, 10);
      ctx.lineTo(0, 18 + Math.abs(Math.sin(performance.now() / 70)) * 6);
      ctx.lineTo(4, 10);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(9, 11);
    ctx.lineTo(0, 7);
    ctx.lineTo(-9, 11);
    ctx.closePath();
    ctx.fillStyle = phase === "failed" ? "rgba(180, 80, 120, 0.35)" : "#101820";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = phase === "success" ? "#5dff9a" : "#3df0ff";
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();
  }

  private drawGoalDebug(level: LevelDefinition): void {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = "rgba(255, 176, 32, 0.14)";
    for (const region of level.goals) {
      ctx.beginPath();
      traceGoalRegion(ctx, region, LOGICAL_WIDTH, level.worldHeight);
      ctx.fill();
    }
    ctx.restore();
  }
}

function createStars(
  count: number,
  worldHeight: number,
): Array<{ x: number; y: number; s: number; a: number }> {
  let seed = STAR_SEED;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: count }, () => ({
    x: rand() * LOGICAL_WIDTH,
    y: rand() * worldHeight,
    s: rand() > 0.82 ? 2 : 1,
    a: 0.25 + rand() * 0.65,
  }));
}

function hexAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const n = Number.parseInt(value, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
