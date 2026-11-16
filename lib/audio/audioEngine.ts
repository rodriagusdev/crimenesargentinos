// Shared Web Audio graph (context + master/SFX buses), volume settings and decoded-buffer cache

export class AudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  sfxGain: GainNode | null = null;

  // Volumes
  masterVolume: number = 0.8;
  sfxVolume: number = 0.8;
  musicVolume: number = 0.3; // Default 0.3 as requested
  isMuted: boolean = false;

  // Cached decoded Web Audio buffers
  private bufferCache = new Map<string, AudioBuffer>();
  private inFlightLoads = new Map<string, Promise<AudioBuffer | null>>();

  /** `onContextCreated` re-applies every volume (buses, music, ambient) once the graph exists. */
  constructor(private readonly onContextCreated: () => void) {}

  /** Master volume after mute */
  get effectiveMaster(): number {
    return this.isMuted ? 0 : this.masterVolume;
  }

  initContext(): AudioContext | null {
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

        this.onContextCreated();
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

  /** Resume a context the browser suspended before the first gesture (never creates one). */
  resumeIfSuspended(): void {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  /** Smooth master/SFX bus gain transition to eliminate audio clicks / pops */
  applyBusGains(): void {
    const effectiveMaster = this.effectiveMaster;
    const effectiveSfx = this.sfxVolume;

    if (this.ctx && this.masterGain && this.sfxGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(effectiveMaster, now + 0.02);

      this.sfxGain.gain.setValueAtTime(this.sfxGain.gain.value, now);
      this.sfxGain.gain.linearRampToValueAtTime(effectiveSfx, now + 0.02);
    }
  }

  getCachedBuffer(url: string): AudioBuffer | undefined {
    return this.bufferCache.get(url);
  }

  hasCachedBuffer(url: string): boolean {
    return this.bufferCache.has(url);
  }

  async loadBuffer(url: string): Promise<AudioBuffer | null> {
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
}
