// Centralized Web Audio API Sound Manager for Crímenes Argentinos
// Eliminates HTML5 Audio concurrency glitches, memory leaks, and DOM thrashing

export type SfxType =
  | "typewriter"
  | "hint"
  | "click"
  | "plane"
  | "stamp"
  | "swoosh"
  | "defeat"
  | "warning"
  | "opencasefile"
  | "arrest"
  | "winning"
  | "victory";

interface SoundOptions {
  volume?: number;       // 0.0 to 1.0 multiplier for this play instance
  playbackRate?: number; // Pitch/speed variation (1.0 = normal)
  detune?: number;       // Detune in cents (-1200 to +1200)
}

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Cached decoded Web Audio buffers
  private bufferCache = new Map<string, AudioBuffer>();
  private inFlightLoads = new Map<string, Promise<AudioBuffer | null>>();

  // Throttling timestamps to prevent rapid-fire sound stutter
  private lastPlayTimes = new Map<SfxType, number>();

  // Volumes
  private masterVolume: number = 0.8;
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.3; // Default 0.3 as requested
  private isMuted: boolean = false;

  // Background Music
  private musicAudio: HTMLAudioElement | null = null;
  private isMusicDesired: boolean = false;

  private soundUrls: Partial<Record<SfxType, string>> = {
    typewriter: "/sounds/typewriter.ogg",
    hint: "/sounds/hint.ogg",
    plane: "/sounds/plane.ogg",
    defeat: "/sounds/defeat.mp3",
    opencasefile: "/sounds/opencasefile.ogg",
    arrest: "/sounds/arrest.ogg",
    winning: "/sounds/winning.ogg",
    victory: "/sounds/winning.ogg",
  };

  constructor() {
    if (typeof window !== "undefined") {
      this.initUserGestureResume();
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioCtxClass) return null;

      try {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        // Chain: SFX -> Master -> Destination
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        this.applyGains();
      } catch (err) {
        console.warn("[AudioManager] Failed to initialize AudioContext:", err);
        return null;
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private initUserGestureResume(): void {
    const resumeOnInteraction = () => {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      if (this.isMusicDesired && this.musicAudio && this.musicAudio.paused) {
        this.musicAudio.play().catch(() => {});
      }
      // Schedule audio preloading during idle cycles so it doesn't stutter the first click
      if (typeof window !== "undefined") {
        const scheduleIdle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
        if (typeof scheduleIdle === "function") {
          scheduleIdle(() => this.preload().catch(() => {}));
        } else {
          setTimeout(() => this.preload().catch(() => {}), 150);
        }
      }
      window.removeEventListener("pointerdown", resumeOnInteraction);
      window.removeEventListener("keydown", resumeOnInteraction);
    };

    window.addEventListener("pointerdown", resumeOnInteraction, { passive: true });
    window.addEventListener("keydown", resumeOnInteraction, { passive: true });
  }

  private applyGains(): void {
    const effectiveMaster = this.isMuted ? 0 : this.masterVolume;
    const effectiveSfx = this.sfxVolume;

    if (this.ctx && this.masterGain && this.sfxGain) {
      const now = this.ctx.currentTime;
      // Smooth gain transition to eliminate audio clicks / pops
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(effectiveMaster, now + 0.02);

      this.sfxGain.gain.setValueAtTime(this.sfxGain.gain.value, now);
      this.sfxGain.gain.linearRampToValueAtTime(effectiveSfx, now + 0.02);
    }

    this.applyMusicVolume();
  }

  private applyMusicVolume(): void {
    if (!this.musicAudio) return;
    const effectiveMusic = this.isMuted ? 0 : this.masterVolume * this.musicVolume;
    this.musicAudio.volume = Math.max(0, Math.min(1, effectiveMusic));
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.applyGains();
  }

  public setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.applyGains();
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.applyMusicVolume();
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.applyGains();
  }

  public getSettings() {
    return {
      masterVolume: this.masterVolume,
      sfxVolume: this.sfxVolume,
      musicVolume: this.musicVolume,
      isMuted: this.isMuted,
    };
  }

  // --- Background Music / Soundtrack Management ---

  public startMusic(url = "/sounds/songdefault.mp3"): void {
    if (typeof window === "undefined") return;
    this.isMusicDesired = true;

    if (!this.musicAudio) {
      this.musicAudio = new Audio(url);
      this.musicAudio.loop = true;
      this.musicAudio.preload = "auto";
    } else if (this.musicAudio.src !== window.location.origin + url && !this.musicAudio.src.endsWith(url)) {
      this.musicAudio.src = url;
    }

    this.applyMusicVolume();

    const playPromise = this.musicAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback until first user gesture; listener is already attached
      });
    }
  }

  public stopMusic(): void {
    this.isMusicDesired = false;
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
  }

  public pauseMusic(): void {
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
  }

  public resumeMusic(): void {
    if (this.musicAudio && this.isMusicDesired) {
      this.applyMusicVolume();
      this.musicAudio.play().catch(() => {});
    }
  }

  // --- SFX Management ---

  /**
   * Preload audio files into decoded AudioBuffers for 0ms latency playback
   */
  public async preload(): Promise<void> {
    const ctx = this.initContext();
    if (!ctx) return;

    const urls = Object.values(this.soundUrls).filter(Boolean) as string[];
    for (const url of urls) {
      if (!this.bufferCache.has(url)) {
        await this.loadBuffer(url);
      }
    }
  }

  private async loadBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url)!;
    }

    if (this.inFlightLoads.has(url)) {
      return this.inFlightLoads.get(url)!;
    }

    const ctx = this.initContext();
    if (!ctx) return null;

    const loadPromise = (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        this.bufferCache.set(url, audioBuffer);
        return audioBuffer;
      } catch (err) {
        console.warn(`[AudioManager] Failed to load audio buffer: ${url}`, err);
        return null;
      } finally {
        this.inFlightLoads.delete(url);
      }
    })();

    this.inFlightLoads.set(url, loadPromise);
    return loadPromise;
  }

  /**
   * Primary entry point to play sound effects
   */
  public play(type: SfxType, options?: SoundOptions): void {
    if (this.isMuted || this.masterVolume <= 0 || this.sfxVolume <= 0) return;

    // Throttle fast-firing SFX to prevent audio thrashing
    const nowMs = Date.now();
    const lastTime = this.lastPlayTimes.get(type) ?? 0;

    if (type === "typewriter" && nowMs - lastTime < 45) {
      return; // Skip if called too fast
    }
    if (type === "click" && nowMs - lastTime < 50) {
      return;
    }
    this.lastPlayTimes.set(type, nowMs);

    const ctx = this.initContext();
    if (!ctx) {
      this.playHtmlAudioFallback(type);
      return;
    }

    // Try buffer playback if file exists
    const url = this.soundUrls[type];
    if (url) {
      const buffer = this.bufferCache.get(url);
      if (buffer) {
        this.playBuffer(buffer, type, options);
        return;
      }

      // If not yet cached, attempt to load it in background
      this.loadBuffer(url).then((b) => {
        if (!b) this.playSynthesized(type, options);
      });
      // Do not use HTML audio fallback for typewriter hover sounds
      if (type !== "typewriter") {
        this.playHtmlAudioFallback(type);
      }
      return;
    }

    // Synthesized sounds (click, stamp, swoosh, warning)
    this.playSynthesized(type, options);
  }

  private playBuffer(buffer: AudioBuffer, type: SfxType, options?: SoundOptions): void {
    if (!this.ctx || !this.sfxGain) return;

    try {
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const gain = this.ctx.createGain();

      // Per-sound baseline volume weighting
      let baseVolume = 1.0;
      switch (type) {
        case "typewriter":
          baseVolume = 0.35;
          // Micro pitch variation for realistic tactile typewriter feel
          source.playbackRate.value = 0.94 + Math.random() * 0.12;
          break;
        case "hint":
          baseVolume = 0.7;
          break;
        case "plane":
          baseVolume = 0.8;
          break;
        case "defeat":
          baseVolume = 0.8;
          break;
        case "opencasefile":
          baseVolume = 0.85;
          break;
        case "arrest":
          baseVolume = 0.9;
          break;
        case "winning":
        case "victory":
          baseVolume = 0.95;
          break;
      }

      if (options?.playbackRate) {
        source.playbackRate.value = options.playbackRate;
      }
      if (options?.detune) {
        source.detune.value = options.detune;
      }

      const instanceVolume = Math.max(0, Math.min(1, (options?.volume ?? 1.0) * baseVolume));
      gain.gain.setValueAtTime(instanceVolume, this.ctx.currentTime);

      source.connect(gain);
      gain.connect(this.sfxGain);

      source.start();
    } catch (err) {
      console.warn(`[AudioManager] Error playing buffer for ${type}:`, err);
    }
  }

  private playSynthesized(type: SfxType, options?: SoundOptions): void {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const optVol = options?.volume ?? 1.0;

    try {
      switch (type) {
        case "stamp": {
          // Heavy bureaucratic gavel / ink stamp thud
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);

          gain.gain.setValueAtTime(0.7 * optVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case "click": {
          // Subtle mechanical tactile button click
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(950, now);
          osc.frequency.exponentialRampToValueAtTime(280, now + 0.05);

          gain.gain.setValueAtTime(0.25 * optVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case "swoosh": {
          // Fast UI menu slide / drawer whoosh
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(250, now);
          osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);

          gain.gain.setValueAtTime(0.2 * optVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.14);
          break;
        }

        case "warning": {
          // Emergency siren / suspect radar pulse
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

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
          gain.connect(this.sfxGain);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.7);
          osc2.stop(now + 0.7);
          break;
        }

        case "plane": {
          // Synthesized propeller flight sound
          const duration = 2.2;
          const bufferSize = Math.floor(this.ctx.sampleRate * duration);
          const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }

          const whiteNoise = this.ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.Q.value = 3.0;
          filter.frequency.setValueAtTime(450, now);
          filter.frequency.exponentialRampToValueAtTime(950, now + duration * 0.4);
          filter.frequency.exponentialRampToValueAtTime(320, now + duration);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.01, now);
          noiseGain.gain.linearRampToValueAtTime(0.35 * optVol, now + duration * 0.4);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          whiteNoise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(this.sfxGain);

          whiteNoise.start(now);
          whiteNoise.stop(now + duration);
          break;
        }
      }
    } catch (err) {
      console.warn(`[AudioManager] Error playing synthesized sound for ${type}:`, err);
    }
  }

  private playHtmlAudioFallback(type: SfxType): void {
    const url = this.soundUrls[type];
    if (!url || typeof window === "undefined") return;

    try {
      const audio = new Audio(url);
      audio.volume = Math.min(1, this.masterVolume * this.sfxVolume * 0.5);
      audio.play().catch(() => {});
    } catch {
      // ignore
    }
  }
}

export const audioManager = new AudioManager();
