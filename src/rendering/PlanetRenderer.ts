import type { PlanetDefinition } from "../level/LevelDefinition";
import { planetSpinAngle } from "./planetSpin";

const TEXTURE_SIZE = 256;
const cache = new Map<string, HTMLCanvasElement>();

export function drawPlanet(
  ctx: CanvasRenderingContext2D,
  planet: PlanetDefinition,
  elapsed = 0,
  debug = false,
): void {
  const { x, y } = planet.center;
  const radius = Math.max(1, planet.radius);
  const texture = rockyAlbedo();
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.translate(x, y);
  ctx.rotate(planetSpinAngle(planet, elapsed));
  ctx.drawImage(texture, -radius, -radius, radius * 2, radius * 2);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();
  const light = ctx.createRadialGradient(
    x - radius * 0.38,
    y - radius * 0.52,
    radius * 0.12,
    x,
    y,
    radius,
  );
  light.addColorStop(0, "rgba(255, 224, 186, 0.28)");
  light.addColorStop(0.42, "rgba(0, 0, 0, 0)");
  light.addColorStop(0.78, "rgba(10, 6, 8, 0.38)");
  light.addColorStop(1, "rgba(4, 2, 6, 0.78)");
  ctx.fillStyle = light;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(18, 10, 8, 0.72)";
  ctx.lineWidth = 1.25;
  ctx.stroke();
  ctx.restore();

  if (debug) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 176, 32, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
}

function rockyAlbedo(): HTMLCanvasElement {
  const cached = cache.get("rocky");
  if (cached) {
    return cached;
  }
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    cache.set("rocky", canvas);
    return canvas;
  }
  const image = ctx.createImageData(TEXTURE_SIZE, TEXTURE_SIZE);
  const data = image.data;
  const craters = createCraters(6);

  for (let py = 0; py < TEXTURE_SIZE; py += 1) {
    for (let px = 0; px < TEXTURE_SIZE; px += 1) {
      const nx = (px + 0.5) / TEXTURE_SIZE * 2 - 1;
      const ny = (py + 0.5) / TEXTURE_SIZE * 2 - 1;
      const rSq = nx * nx + ny * ny;
      const index = (py * TEXTURE_SIZE + px) * 4;
      if (rSq > 1) {
        data[index + 3] = 0;
        continue;
      }
      const height = fbm(nx * 1.6 + 8.1, ny * 1.6 + 3.7, 3);
      const crater = sampleCraters(nx, ny, craters);
      const highland = clamp01(height * 0.55 + 0.4 - crater.depth * 0.7);
      const rust = 0.55 + fbm(nx * 2.2 + 20, ny * 2.2 - 11, 2) * 0.35;
      data[index] = clampByte(118 + highland * 102 + rust * 36 - crater.rim * 18);
      data[index + 1] = clampByte(78 + highland * 70 + rust * 10 - crater.depth * 22);
      data[index + 2] = clampByte(54 + highland * 42 - crater.depth * 16);
      data[index + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  cache.set("rocky", canvas);
  return canvas;
}

type Crater = { x: number; y: number; radius: number };

function createCraters(count: number): Crater[] {
  const craters: Crater[] = [];
  let seed = 9041;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < count; i += 1) {
    const angle = rand() * Math.PI * 2;
    const dist = Math.sqrt(rand()) * 0.78;
    craters.push({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      radius: 0.1 + rand() * 0.12,
    });
  }
  return craters;
}

function sampleCraters(x: number, y: number, craters: Crater[]): { depth: number; rim: number } {
  let depth = 0;
  let rim = 0;
  for (const crater of craters) {
    const dist = Math.hypot(x - crater.x, y - crater.y) / crater.radius;
    if (dist >= 1.18) {
      continue;
    }
    if (dist < 0.78) {
      depth = Math.max(depth, (1 - dist / 0.78) * 0.9);
    } else {
      rim = Math.max(rim, 1 - Math.abs(dist - 0.92) / 0.26);
    }
  }
  return { depth, rim };
}

function fbm(x: number, y: number, octaves: number): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;
  for (let i = 0; i < octaves; i += 1) {
    value += noise(x * frequency, y * frequency) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return total > 0 ? value / total : 0;
}

function noise(x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = fade(x - x0);
  const fy = fade(y - y0);
  const a = hash2(x0, y0);
  const b = hash2(x0 + 1, y0);
  const c = hash2(x0, y0 + 1);
  const d = hash2(x0 + 1, y0 + 1);
  return lerp(lerp(a, b, fx), lerp(c, d, fx), fy);
}

function hash2(x: number, y: number): number {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function fade(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function clampByte(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}
