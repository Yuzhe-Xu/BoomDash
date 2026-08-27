import type { ExplosionFx } from "../simulation/GameState";
import { length } from "../simulation/Vec2";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
};

export class EffectsRenderer {
  private particles: Particle[] = [];
  private trail: Array<{ x: number; y: number }> = [];

  spawnExplosion(fx: ExplosionFx): void {
    const count = fx.hit ? 18 : 10;
    for (let i = 0; i < count && this.particles.length < 80; i += 1) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        x: fx.position.x,
        y: fx.position.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: 0.22 + Math.random() * 0.16,
      });
    }
  }

  pushTrail(x: number, y: number, flying: boolean): void {
    if (!flying) {
      this.trail = [];
      return;
    }
    this.trail.push({ x, y });
    if (this.trail.length > 28) {
      this.trail.shift();
    }
  }

  clear(): void {
    this.particles = [];
    this.trail = [];
  }

  draw(ctx: CanvasRenderingContext2D, fxList: ExplosionFx[], dt: number): void {
    for (const p of this.particles) {
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    this.particles = this.particles.filter((p) => p.life < p.max);

    ctx.save();
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    for (let i = 1; i < this.trail.length; i += 1) {
      const a = this.trail[i - 1];
      const b = this.trail[i];
      ctx.strokeStyle = `rgba(61, 240, 255, ${i / this.trail.length * 0.55})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.restore();

    for (const fx of fxList) {
      const t = fx.age / fx.duration;
      const radius = 18 + t * 86;
      ctx.save();
      ctx.beginPath();
      ctx.arc(fx.position.x, fx.position.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = fx.hit
        ? `rgba(255, 43, 214, ${1 - t})`
        : `rgba(61, 240, 255, ${0.7 - t})`;
      ctx.lineWidth = 3 - t * 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(fx.position.x, fx.position.y, 10 + t * 20, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 230, 180, ${0.28 * (1 - t)})`;
      ctx.fill();
      ctx.restore();
    }

    for (const p of this.particles) {
      const alpha = 1 - p.life / p.max;
      ctx.fillStyle = `rgba(255, 180, 80, ${alpha})`;
      ctx.fillRect(p.x - 1.2, p.y - 1.2, 2.4, 2.4);
    }
  }

  impulseHint(ctx: CanvasRenderingContext2D, fxList: ExplosionFx[]): void {
    const latest = fxList.at(-1);
    if (!latest || length(latest.impulse) < 1) {
      return;
    }
    ctx.save();
    ctx.strokeStyle = "rgba(255, 176, 32, 0.85)";
    ctx.beginPath();
    ctx.moveTo(latest.position.x, latest.position.y);
    ctx.lineTo(latest.position.x + latest.impulse.x * 0.35, latest.position.y + latest.impulse.y * 0.35);
    ctx.stroke();
    ctx.restore();
  }
}
