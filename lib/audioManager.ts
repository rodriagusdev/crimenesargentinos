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
  | "losing"
  | "warning"
  | "opencasefile"
  | "arrest"
  | "winning"
  | "victory"
  | "slide"
  | "mechanickey";

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

  // Background Music & Soundtrack Playlist
  private musicAudio: HTMLAudioElement | null = null;
  private isMusicDesired: boolean = false;
  private musicPlaylist: string[] = [
    "/sounds/songdefault.mp3",
    "/sounds/songdefault2.mp3",
    "/sounds/songdefault3.mp3",
  ];
  private currentTrackIndex: number = 0;

  // Ambient Soundscape Layer (Rain & Distant Police Dispatch)
  // Both rain and atmospheric events run on Web Audio API for 100% gapless looping and reliable autoplay
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private currentAmbientSource: AudioBufferSourceNode | null = null;
  private isAmbientDesired: boolean = false;
  private ambientEventTimer: ReturnType<typeof setTimeout> | null = null;
  private ambientEventIndex: number = 0;
  private isRaining: boolean = false;
  private rainCycleTimer: ReturnType<typeof setTimeout> | null = null;
  private seamlessRainCache: AudioBuffer | null = null;
  private readonly ambientEvents: string[] = [
    "/sounds/radiodistante.ogg",
    "/sounds/sirenadistante.ogg",
  ];

  private soundUrls: Partial<Record<SfxType, string>> = {
    typewriter: "/sounds/typewriter.ogg",
    hint: "/sounds/hint.ogg",
    plane: "/sounds/plane.ogg",
    defeat: "/sounds/losing.ogg",
    losing: "/sounds/losing.ogg",
    warning: "/sounds/warning.ogg",
    opencasefile: "/sounds/opencasefile.ogg",
    arrest: "/sounds/arrest.ogg",
    winning: "/sounds/winning.ogg",
    victory: "/sounds/winning.ogg",
    slide: "/sounds/slide.ogg",
    mechanickey: "/sounds/mechanickey.ogg",
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
      if (this.isAmbientDesired && !this.rainSource) {
        this.startAmbient();
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
    this.applyAmbientVolume();
  }

  private applyAmbientVolume(): void {
    const effectiveMaster = this.isMuted ? 0 : this.masterVolume;

    // Rain loop volume via Web Audio GainNode: smooth ambient room tone when a shower is active
    if (this.ctx && this.rainGain) {
      const now = this.ctx.currentTime;
      const targetGain = this.isRaining ? Math.max(0, Math.min(1, effectiveMaster * 0.28)) : 0;
      this.rainGain.gain.setValueAtTime(this.rainGain.gain.value, now);
      this.rainGain.gain.linearRampToValueAtTime(targetGain, now + 0.1);
    }
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

  public startMusic(playlistOrUrl?: string | string[]): void {
    if (typeof window === "undefined") return;
    this.isMusicDesired = true;

    // If music is already playing, keep going without restarting
    if (this.musicAudio && !this.musicAudio.paused) {
      return;
    }

    if (Array.isArray(playlistOrUrl) && playlistOrUrl.length > 0) {
      this.musicPlaylist = playlistOrUrl;
      this.currentTrackIndex = 0; // songdefault is always first
    } else if (typeof playlistOrUrl === "string") {
      const foundIdx = this.musicPlaylist.indexOf(playlistOrUrl);
      this.currentTrackIndex = foundIdx !== -1 ? foundIdx : 0;
    } else if (!this.musicAudio) {
      // First startup: songdefault is always the first to play
      this.currentTrackIndex = 0;
    }

    this.playCurrentTrack();
  }

  private playCurrentTrack(): void {
    if (typeof window === "undefined" || !this.isMusicDesired) return;

    const currentUrl = this.musicPlaylist[this.currentTrackIndex] || "/sounds/songdefault.mp3";

    if (!this.musicAudio) {
      this.musicAudio = new Audio(currentUrl);
      this.musicAudio.loop = false; // Alternates tracks via "ended" listener
      this.musicAudio.preload = "auto";

      this.musicAudio.addEventListener("ended", () => {
        this.playNextTrack();
      });

      this.musicAudio.addEventListener("error", () => {
        console.warn(`[AudioManager] Error playing track: ${this.musicAudio?.src}, skipping to next`);
        setTimeout(() => {
          if (this.isMusicDesired) {
            this.playNextTrack();
          }
        }, 1500);
      });
    } else {
      if (!this.musicAudio.src.endsWith(currentUrl)) {
        this.musicAudio.src = currentUrl;
      }
      this.musicAudio.loop = false;
    }

    this.applyMusicVolume();

    const playPromise = this.musicAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback until first user gesture; listener is already attached
      });
    }

    // Preload next track in background for seamless transition
    if (this.musicPlaylist.length > 1) {
      const nextIndex = (this.currentTrackIndex + 1) % this.musicPlaylist.length;
      const nextUrl = this.musicPlaylist[nextIndex];
      const preloadAudio = new Audio();
      preloadAudio.src = nextUrl;
      preloadAudio.preload = "auto";
    }
  }

  public playNextTrack(): void {
    if (this.musicPlaylist.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.musicPlaylist.length;
    this.playCurrentTrack();
  }

  public stopMusic(): void {
    this.isMusicDesired = false;
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
    // songdefault is always the first to play when restarted
    this.currentTrackIndex = 0;
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

  // --- Ambient Soundscape Management (Rain & Police Dispatch) ---

  public async startAmbient(): Promise<void> {
    if (typeof window === "undefined") return;
    this.isAmbientDesired = true;

    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.rainGain) {
      this.rainGain = ctx.createGain();
      this.rainGain.connect(this.masterGain ?? ctx.destination);
    }
    this.applyAmbientVolume();

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
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.rainGain) {
      this.rainGain = ctx.createGain();
      this.rainGain.connect(this.masterGain ?? ctx.destination);
    }

    try {
      const buffer = await this.getSeamlessRainBuffer("/sounds/raindrops.ogg");
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
      const effectiveMaster = this.isMuted ? 0 : this.masterVolume;
      const targetGain = Math.max(0, Math.min(1, effectiveMaster * 0.28));

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

    if (this.ctx && this.rainGain && this.rainSource) {
      const now = this.ctx.currentTime;
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

  /**
   * Genera un buffer de lluvia 100% libre de saltos o pausas mediante equal-power crossfading.
   * La cola del audio se funde con la cabeza, eliminando cualquier discontinuidad al loopear.
   */
  private async getSeamlessRainBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.seamlessRainCache) return this.seamlessRainCache;
    const src = await this.loadBuffer(url);
    if (!src || !this.ctx) return src;

    const numChannels = src.numberOfChannels;
    const channelData = Array.from({ length: numChannels }, (_, c) => src.getChannelData(c));
    const len = src.length;

    let start = 0;
    while (start < len - 1 && channelData.every((d) => Math.abs(d[start]) < 0.0005)) {
      start++;
    }

    let end = len;
    while (end > start + 1 && channelData.every((d) => Math.abs(d[end - 1]) < 0.0005)) {
      end--;
    }

    const activeLen = end - start;
    const crossfadeLen = Math.min(Math.floor(src.sampleRate * 0.5), Math.floor(activeLen * 0.25));

    if (crossfadeLen <= 0 || activeLen <= crossfadeLen * 2) {
      this.seamlessRainCache = src;
      return src;
    }

    const loopLen = activeLen - crossfadeLen;
    const out = this.ctx.createBuffer(numChannels, loopLen, src.sampleRate);

    for (let c = 0; c < numChannels; c++) {
      const srcData = channelData[c];
      const outData = out.getChannelData(c);

      // Funde la cola con el inicio para continuidad matemática perfecta
      for (let i = 0; i < crossfadeLen; i++) {
        const t = i / crossfadeLen;
        const fadeIn = Math.sin(t * Math.PI * 0.5);
        const fadeOut = Math.cos(t * Math.PI * 0.5);

        const headSample = srcData[start + i];
        const tailSample = srcData[start + loopLen + i];

        outData[i] = headSample * fadeIn + tailSample * fadeOut;
      }

      // Cuerpo del audio
      for (let i = crossfadeLen; i < loopLen; i++) {
        outData[i] = srcData[start + i];
      }
    }

    this.seamlessRainCache = out;
    return out;
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
    const ctx = this.initContext();
    if (!ctx) {
      this.scheduleNextAmbientEvent(4000);
      return;
    }

    const eventUrl = this.ambientEvents[this.ambientEventIndex];
    this.ambientEventIndex = (this.ambientEventIndex + 1) % this.ambientEvents.length;

    try {
      const buffer = await this.loadBuffer(eventUrl);
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
      const effectiveMaster = this.isMuted ? 0 : this.masterVolume;
      const duration = buffer.duration;

      // Cada evento tiene su propio GainNode para envelopes independientes
      const eventGain = ctx.createGain();
      eventGain.connect(this.masterGain ?? ctx.destination);

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

  public stopAmbient(): void {
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

  public pauseAmbient(): void {
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
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

  public resumeAmbient(): void {
    if (this.isAmbientDesired) {
      this.applyAmbientVolume();
      if (!this.isRaining && !this.rainCycleTimer) {
        this.scheduleNextRainShower(3000);
      }
      if (!this.ambientEventTimer && !this.currentAmbientSource) {
        this.scheduleNextAmbientEvent(4000);
      }
    }
  }

  // --- SFX Management ---

  /**
   * Preload audio files into decoded AudioBuffers for 0ms latency playback
   */
  public async preload(): Promise<void> {
    const ctx = this.initContext();
    if (!ctx) return;

    const urls = [
      ...Object.values(this.soundUrls).filter(Boolean),
      "/sounds/raindrops.ogg",
      ...this.ambientEvents,
    ] as string[];
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
        case "losing":
          baseVolume = 0.85;
          break;
        case "warning":
          baseVolume = 0.85;
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
        case "slide":
          baseVolume = 0.65;
          source.playbackRate.value = 0.96 + Math.random() * 0.08;
          break;
        case "mechanickey":
          baseVolume = 0.7;
          source.playbackRate.value = 0.98 + Math.random() * 0.04;
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
