import type { AudioEngine } from "./audioEngine";
import { AMBIENT_EVENT_URLS, RAIN_URL } from "./sfxCatalog";
import { createSeamlessLoopBuffer } from "./seamlessLoop";

// Ambient Soundscape Layer (Rain & Distant Police Dispatch)
// Both rain and atmospheric events run on Web Audio API for 100% gapless looping and reliable autoplay
export class AmbientSoundscape {
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private currentAmbientSource: AudioBufferSourceNode | null = null;
  private isAmbientDesired: boolean = false;
  private ambientEventTimer: ReturnType<typeof setTimeout> | null = null;
  private ambientEventIndex: number = 0;
  private isRaining: boolean = false;
  private rainCycleTimer: ReturnType<typeof setTimeout> | null = null;
  private seamlessRainCache: AudioBuffer | null = null;

  constructor(private readonly engine: AudioEngine) {}

  /** First user gesture: start the soundscape if it was requested before the gesture. */
  onUserGesture(): void {
    if (this.isAmbientDesired && !this.rainSource) {
      this.start();
    }
  }

  applyVolume(): void {
    const ctx = this.engine.ctx;
    // Rain loop volume via Web Audio GainNode: smooth ambient room tone when a shower is active
    if (ctx && this.rainGain) {
      const now = ctx.currentTime;
      const targetGain = this.isRaining ? Math.max(0, Math.min(1, this.engine.effectiveMaster * 0.28)) : 0;
      this.rainGain.gain.setValueAtTime(this.rainGain.gain.value, now);
      this.rainGain.gain.linearRampToValueAtTime(targetGain, now + 0.1);
    }
  }

  async start(): Promise<void> {
    if (typeof window === "undefined") return;
    this.isAmbientDesired = true;

    const ctx = this.engine.initContext();
    if (!ctx) return;

    if (!this.rainGain) {
      this.rainGain = ctx.createGain();
      this.rainGain.connect(this.engine.masterGain ?? ctx.destination);
    }
    this.applyVolume();

    // 1. Weather cycle: rain arrives in periodic showers with smooth fade-in/fade-out
    if (!this.isRaining && !this.rainCycleTimer) {
      this.scheduleNextRainShower(1500); // First rain shower starts gently after 1.5s
    }

    // 2. Schedule first police event (distant siren / radio after 4s)
    if (!this.ambientEventTimer && !this.currentAmbientSource) {
      this.scheduleNextAmbientEvent(4000);
    }
  }

  // --- Rain Weather Cycle (Rain showers that come and go, never endless) ---

  private scheduleNextRainShower(delayMs?: number): void {
    if (!this.isAmbientDesired) return;
    if (this.rainCycleTimer) {
      clearTimeout(this.rainCycleTimer);
      this.rainCycleTimer = null;
    }

    // Dry window between rain showers: 25 to 50 seconds of calm/dry room atmosphere
    const delay = delayMs ?? (25000 + Math.random() * 25000);

    this.rainCycleTimer = setTimeout(() => {
      this.startRainShower();
    }, delay);
  }

  private async startRainShower(): Promise<void> {
    if (!this.isAmbientDesired || this.isRaining) return;
    const ctx = this.engine.initContext();
    if (!ctx) return;

    if (!this.rainGain) {
      this.rainGain = ctx.createGain();
      this.rainGain.connect(this.engine.masterGain ?? ctx.destination);
    }

    try {
      const buffer = await this.getSeamlessRainBuffer(RAIN_URL);
      if (!buffer || !this.isAmbientDesired) return;

      if (this.rainSource) {
        try {
          this.rainSource.stop();
          this.rainSource.disconnect();
        } catch {}
        this.rainSource = null;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(this.rainGain);

      // Smooth fade-in over 3.0s so rain arrives organically against the window
      const now = ctx.currentTime;
      const targetGain = Math.max(0, Math.min(1, this.engine.effectiveMaster * 0.28));

      this.rainGain.gain.cancelScheduledValues(now);
      this.rainGain.gain.setValueAtTime(0, now);
      this.rainGain.gain.linearRampToValueAtTime(targetGain, now + 3.0);

      source.start(0);
      this.rainSource = source;
      this.isRaining = true;

      // Rain shower duration: 20 to 35 seconds of rain, then fades away
      const showerDuration = 20000 + Math.random() * 15000;
      this.rainCycleTimer = setTimeout(() => {
        this.stopRainShower();
      }, showerDuration);
    } catch (err) {
      console.warn("[AudioManager] Error starting rain shower", err);
      this.scheduleNextRainShower(15000);
    }
  }

  private stopRainShower(): void {
    if (!this.isRaining && !this.rainSource) return;
    this.isRaining = false;

    if (this.rainCycleTimer) {
      clearTimeout(this.rainCycleTimer);
      this.rainCycleTimer = null;
    }

    const ctx = this.engine.ctx;
    if (ctx && this.rainGain && this.rainSource) {
      const now = ctx.currentTime;
      // Smooth fade-out over 3.5s so rain gently tapers off into quiet calm
      this.rainGain.gain.cancelScheduledValues(now);
      this.rainGain.gain.setValueAtTime(this.rainGain.gain.value, now);
      this.rainGain.gain.linearRampToValueAtTime(0, now + 3.5);

      const oldSource = this.rainSource;
      this.rainSource = null;

      setTimeout(() => {
        try {
          oldSource.stop();
          oldSource.disconnect();
        } catch {}
      }, 3700);
    }

    // Schedule next shower after calm window
    this.scheduleNextRainShower();
  }

  private async getSeamlessRainBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.seamlessRainCache) return this.seamlessRainCache;
    const src = await this.engine.loadBuffer(url);
    const ctx = this.engine.ctx;
    if (!src || !ctx) return src;

    this.seamlessRainCache = createSeamlessLoopBuffer(ctx, src);
    return this.seamlessRainCache;
  }

  // --- Atmospheric Police Dispatch & Distant Sirens ---

  private scheduleNextAmbientEvent(delayMs?: number): void {
    if (!this.isAmbientDesired) return;
    if (this.ambientEventTimer) {
      clearTimeout(this.ambientEventTimer);
      this.ambientEventTimer = null;
    }

    // Delay between 14 and 28 seconds between distant atmospheric calls
    const delay = delayMs ?? (14000 + Math.random() * 14000);

    this.ambientEventTimer = setTimeout(() => {
      this.playAmbientEvent();
    }, delay);
  }

  private async playAmbientEvent(): Promise<void> {
    if (!this.isAmbientDesired) return;
    const ctx = this.engine.initContext();
    if (!ctx) {
      this.scheduleNextAmbientEvent(4000);
      return;
    }

    const eventUrl = AMBIENT_EVENT_URLS[this.ambientEventIndex];
    this.ambientEventIndex = (this.ambientEventIndex + 1) % AMBIENT_EVENT_URLS.length;

    try {
      const buffer = await this.engine.loadBuffer(eventUrl);
      if (!buffer || !this.isAmbientDesired) {
        this.scheduleNextAmbientEvent();
        return;
      }

      if (this.currentAmbientSource) {
        try {
          this.currentAmbientSource.stop();
          this.currentAmbientSource.disconnect();
        } catch {}
        this.currentAmbientSource = null;
      }

      const isSiren = eventUrl.includes("siren");
      const effectiveMaster = this.engine.effectiveMaster;
      const duration = buffer.duration;

      // Cada evento tiene su propio GainNode para envelopes independientes
      const eventGain = ctx.createGain();
      eventGain.connect(this.engine.masterGain ?? ctx.destination);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(eventGain);

      const now = ctx.currentTime;

      if (isSiren) {
        // Sirena lejana: arranque suave progresivo (fade-in 3.5s) y desvanecimiento (fade-out 3.5s)
        // Elimina por completo el corte abrupto al inicio
        const maxSirenGain = Math.max(0, Math.min(1, effectiveMaster * 0.32));
        const fadeInTime = Math.min(3.5, duration * 0.35);
        const fadeOutTime = Math.min(3.5, duration * 0.35);

        eventGain.gain.setValueAtTime(0, now);
        eventGain.gain.linearRampToValueAtTime(maxSirenGain, now + fadeInTime);
        eventGain.gain.setValueAtTime(maxSirenGain, Math.max(now + fadeInTime, now + duration - fadeOutTime));
        eventGain.gain.linearRampToValueAtTime(0, now + duration);
      } else {
        // Radio policial lejana: ataque suave de 0.4s (sin chasquidos digitales) y cola natural
        const maxRadioGain = Math.max(0, Math.min(1, effectiveMaster * 0.42));
        eventGain.gain.setValueAtTime(0, now);
        eventGain.gain.linearRampToValueAtTime(maxRadioGain, now + 0.4);
        eventGain.gain.setValueAtTime(maxRadioGain, Math.max(now + 0.4, now + duration - 0.5));
        eventGain.gain.linearRampToValueAtTime(0, now + duration);
      }

      source.onended = () => {
        try {
          source.disconnect();
          eventGain.disconnect();
        } catch {}
        if (this.currentAmbientSource === source) {
          this.currentAmbientSource = null;
        }
        this.scheduleNextAmbientEvent();
      };

      source.start(0);
      this.currentAmbientSource = source;
    } catch (err) {
      console.warn("[AudioManager] Error playing ambient event", err);
      this.scheduleNextAmbientEvent();
    }
  }

  stop(): void {
    this.isAmbientDesired = false;
    this.isRaining = false;

    if (this.rainCycleTimer) {
      clearTimeout(this.rainCycleTimer);
      this.rainCycleTimer = null;
    }
    if (this.ambientEventTimer) {
      clearTimeout(this.ambientEventTimer);
      this.ambientEventTimer = null;
    }
    if (this.rainSource) {
      try {
        this.rainSource.stop();
        this.rainSource.disconnect();
      } catch {}
      this.rainSource = null;
    }
    if (this.currentAmbientSource) {
      try {
        this.currentAmbientSource.stop();
        this.currentAmbientSource.disconnect();
      } catch {}
      this.currentAmbientSource = null;
    }
  }

  pause(): void {
    const ctx = this.engine.ctx;
    if (this.rainGain && ctx) {
      this.rainGain.gain.setValueAtTime(0, ctx.currentTime);
    }
    if (this.rainCycleTimer) {
      clearTimeout(this.rainCycleTimer);
      this.rainCycleTimer = null;
    }
    if (this.ambientEventTimer) {
      clearTimeout(this.ambientEventTimer);
      this.ambientEventTimer = null;
    }
  }

  resume(): void {
    if (this.isAmbientDesired) {
      this.applyVolume();
      if (!this.isRaining && !this.rainCycleTimer) {
        this.scheduleNextRainShower(3000);
      }
      if (!this.ambientEventTimer && !this.currentAmbientSource) {
        this.scheduleNextAmbientEvent(4000);
      }
    }
  }
}
