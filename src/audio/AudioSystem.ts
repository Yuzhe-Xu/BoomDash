export class AudioSystem {
  private ctx: AudioContext | null = null;
  muted = false;

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  unlock(): void {
    if (this.muted) {
      return;
    }
    this.ensure();
    void this.ctx?.resume();
  }

  place(): void {
    this.tone(880, 0.05, "square", 0.04);
  }

  launch(): void {
    this.sweep(180, 520, 0.22, 0.06);
  }

  explode(hit: boolean): void {
    this.noise(hit ? 0.08 : 0.05, hit ? 0.08 : 0.04);
    this.tone(hit ? 140 : 220, 0.12, "sawtooth", 0.05);
  }

  success(): void {
    this.tone(523, 0.1, "square", 0.05);
    window.setTimeout(() => this.tone(659, 0.1, "square", 0.05), 90);
    window.setTimeout(() => this.tone(784, 0.16, "square", 0.05), 180);
  }

  fail(): void {
    this.sweep(240, 80, 0.28, 0.07);
  }

  private ensure(): AudioContext | null {
    if (this.muted) {
      return null;
    }
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) {
        return null;
      }
      this.ctx = new Ctor();
    }
    return this.ctx;
  }

  private tone(freq: number, duration: number, type: OscillatorType, gain: number): void {
    const ctx = this.ensure();
    if (!ctx) {
      return;
    }
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(gain, ctx.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  private sweep(from: number, to: number, duration: number, gain: number): void {
    const ctx = this.ensure();
    if (!ctx) {
      return;
    }
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(from, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), ctx.currentTime + duration);
    amp.gain.setValueAtTime(gain, ctx.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  private noise(duration: number, gain: number): void {
    const ctx = this.ensure();
    if (!ctx) {
      return;
    }
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.6;
    }
    const src = ctx.createBufferSource();
    const amp = ctx.createGain();
    src.buffer = buffer;
    amp.gain.setValueAtTime(gain, ctx.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    src.connect(amp);
    amp.connect(ctx.destination);
    src.start();
  }
}
