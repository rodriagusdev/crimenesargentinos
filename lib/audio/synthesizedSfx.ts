import type { SfxType, SoundOptions } from "./types";

// Oscillator/noise-based SFX for sounds without a file (click, stamp, swoosh) or whose file failed to load

function playStamp(ctx: AudioContext, out: AudioNode, now: number, optVol: number): void {
  // Heavy bureaucratic gavel / ink stamp thud
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);

  gain.gain.setValueAtTime(0.7 * optVol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(out);
  osc.start(now);
  osc.stop(now + 0.25);
}

function playClick(ctx: AudioContext, out: AudioNode, now: number, optVol: number): void {
  // Subtle mechanical tactile button click
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(950, now);
  osc.frequency.exponentialRampToValueAtTime(280, now + 0.05);

  gain.gain.setValueAtTime(0.25 * optVol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(out);
  osc.start(now);
  osc.stop(now + 0.05);
}

function playSwoosh(ctx: AudioContext, out: AudioNode, now: number, optVol: number): void {
  // Fast UI menu slide / drawer whoosh
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(250, now);
  osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);

  gain.gain.setValueAtTime(0.2 * optVol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  osc.connect(gain);
  gain.connect(out);
  osc.start(now);
  osc.stop(now + 0.14);
}

function playWarning(ctx: AudioContext, out: AudioNode, now: number, optVol: number): void {
  // Emergency siren / suspect radar pulse
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc1.type = "sawtooth";
  osc2.type = "sine";

  osc1.frequency.setValueAtTime(520, now);
  osc1.frequency.linearRampToValueAtTime(880, now + 0.15);
  osc1.frequency.linearRampToValueAtTime(520, now + 0.3);
  osc1.frequency.linearRampToValueAtTime(880, now + 0.45);
  osc1.frequency.linearRampToValueAtTime(520, now + 0.6);

  osc2.frequency.setValueAtTime(260, now);
  osc2.frequency.linearRampToValueAtTime(440, now + 0.15);
  osc2.frequency.linearRampToValueAtTime(260, now + 0.3);
  osc2.frequency.linearRampToValueAtTime(440, now + 0.45);
  osc2.frequency.linearRampToValueAtTime(260, now + 0.6);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, now);

  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.4 * optVol, now + 0.05);
  gain.gain.setValueAtTime(0.4 * optVol, now + 0.55);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(out);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.7);
  osc2.stop(now + 0.7);
}

function playPlane(ctx: AudioContext, out: AudioNode, now: number, optVol: number): void {
  // Synthesized propeller flight sound
  const duration = 2.2;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 3.0;
  filter.frequency.setValueAtTime(450, now);
  filter.frequency.exponentialRampToValueAtTime(950, now + duration * 0.4);
  filter.frequency.exponentialRampToValueAtTime(320, now + duration);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.01, now);
  noiseGain.gain.linearRampToValueAtTime(0.35 * optVol, now + duration * 0.4);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  whiteNoise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(out);

  whiteNoise.start(now);
  whiteNoise.stop(now + duration);
}

const SYNTHS: Partial<Record<SfxType, (ctx: AudioContext, out: AudioNode, now: number, optVol: number) => void>> = {
  stamp: playStamp,
  click: playClick,
  swoosh: playSwoosh,
  warning: playWarning,
  plane: playPlane,
};

export function playSynthesized(ctx: AudioContext, out: AudioNode, type: SfxType, options?: SoundOptions): void {
  const now = ctx.currentTime;
  const optVol = options?.volume ?? 1.0;

  try {
    SYNTHS[type]?.(ctx, out, now, optVol);
  } catch (err) {
    console.warn(`[AudioManager] Error playing synthesized sound for ${type}:`, err);
  }
}
