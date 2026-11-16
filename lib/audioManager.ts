// Centralized Web Audio API Sound Manager for Crímenes Argentinos
// Eliminates HTML5 Audio concurrency glitches, memory leaks, and DOM thrashing
// Public facade: the pieces live in lib/audio/ (engine, music, ambient, SFX catalog and synthesized SFX)

import { AudioEngine } from "./audio/audioEngine";
import { MusicPlayer } from "./audio/musicPlayer";
import { AmbientSoundscape } from "./audio/ambientSoundscape";
import { AMBIENT_EVENT_URLS, RAIN_URL, SOUND_URLS, applySfxProfile } from "./audio/sfxCatalog";
import { playSynthesized } from "./audio/synthesizedSfx";
import type { SfxType, SoundOptions } from "./audio/types";

export type { SfxType } from "./audio/types";

class AudioManager {
  private readonly engine: AudioEngine;
  private readonly music: MusicPlayer;
  private readonly ambient: AmbientSoundscape;

  // Throttling timestamps to prevent rapid-fire sound stutter
  private lastPlayTimes = new Map<SfxType, number>();

  constructor() {
    this.engine = new AudioEngine(() => this.applyGains());

    let hasUserGesture = false;
    if (typeof window !== "undefined") {
      const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
      hasUserGesture = Boolean(activation?.hasBeenActive);
    }
    this.music = new MusicPlayer(
      () => (this.engine.isMuted ? 0 : this.engine.masterVolume * this.engine.musicVolume),
      hasUserGesture,
    );
    this.ambient = new AmbientSoundscape(this.engine);

    if (typeof window !== "undefined") {
      this.initUserGestureResume();
    }
  }

  private initUserGestureResume(): void {
    const resumeOnInteraction = () => {
      this.engine.resumeIfSuspended();
      // The music <audio> element is created here (first gesture), so no MP3 is downloaded on page load
      this.music.onUserGesture();
      this.ambient.onUserGesture();
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
      window.removeEventListener("touchstart", resumeOnInteraction);
    };

    window.addEventListener("pointerdown", resumeOnInteraction, { passive: true });
    window.addEventListener("keydown", resumeOnInteraction, { passive: true });
    window.addEventListener("touchstart", resumeOnInteraction, { passive: true });
  }

  private applyGains(): void {
    this.engine.applyBusGains();
    this.music.applyVolume();
    this.ambient.applyVolume();
  }

  public setMasterVolume(volume: number): void {
    this.engine.masterVolume = Math.max(0, Math.min(1, volume));
    this.applyGains();
  }

  public setSfxVolume(volume: number): void {
    this.engine.sfxVolume = Math.max(0, Math.min(1, volume));
    this.applyGains();
  }

  public setMusicVolume(volume: number): void {
    this.engine.musicVolume = Math.max(0, Math.min(1, volume));
    this.music.applyVolume();
  }

  public setMuted(muted: boolean): void {
    this.engine.isMuted = muted;
    this.applyGains();
  }

  public getSettings() {
    return {
      masterVolume: this.engine.masterVolume,
      sfxVolume: this.engine.sfxVolume,
      musicVolume: this.engine.musicVolume,
      isMuted: this.engine.isMuted,
    };
  }

  // --- Background Music / Soundtrack Management ---

  public startMusic(playlistOrUrl?: string | string[]): void {
    this.music.start(playlistOrUrl);
  }

  public playNextTrack(): void {
    this.music.playNextTrack();
  }

  public stopMusic(): void {
    this.music.stop();
  }

  public pauseMusic(): void {
    this.music.pause();
  }

  public resumeMusic(): void {
    this.music.resume();
  }

  // --- Ambient Soundscape Management (Rain & Police Dispatch) ---

  public async startAmbient(): Promise<void> {
    return this.ambient.start();
  }

  public stopAmbient(): void {
    this.ambient.stop();
  }

  public pauseAmbient(): void {
    this.ambient.pause();
  }

  public resumeAmbient(): void {
    this.ambient.resume();
  }

  // --- SFX Management ---

  /**
   * Preload audio files into decoded AudioBuffers for 0ms latency playback
   */
  public async preload(): Promise<void> {
    const ctx = this.engine.initContext();
    if (!ctx) return;

    // Primero los SFX que se disparan con la interacción (hover / botones), después el resto en paralelo
    const priority = (["typewriter", "opencasefile"] as SfxType[])
      .map((type) => SOUND_URLS[type])
      .filter(Boolean) as string[];
    await Promise.all(priority.map((url) => this.engine.loadBuffer(url)));

    // Set: varios SFX comparten archivo (defeat/losing, winning/victory)
    const rest = new Set([
      ...(Object.values(SOUND_URLS).filter(Boolean) as string[]),
      RAIN_URL,
      ...AMBIENT_EVENT_URLS,
    ]);
    await Promise.all([...rest].filter((url) => !this.engine.hasCachedBuffer(url)).map((url) => this.engine.loadBuffer(url)));
  }

  /**
   * Primary entry point to play sound effects
   */
  public play(type: SfxType, options?: SoundOptions): void {
    const { isMuted, masterVolume, sfxVolume } = this.engine;
    if (isMuted || masterVolume <= 0 || sfxVolume <= 0) return;

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

    const ctx = this.engine.initContext();
    if (!ctx) {
      this.playHtmlAudioFallback(type);
      return;
    }

    // Try buffer playback if file exists
    const url = SOUND_URLS[type];
    if (url) {
      const buffer = this.engine.getCachedBuffer(url);
      if (buffer) {
        this.playBuffer(buffer, type, options);
        return;
      }

      // Sin buffer todavía: un único pedido (fetch + decode) y se reproduce al llegar.
      // El typewriter de hover no se reproduce tarde: solo queda cargado para la próxima vez.
      this.engine.loadBuffer(url).then((b) => {
        if (!b) this.synthesize(type, options);
        else if (type !== "typewriter") this.playBuffer(b, type, options);
      });
      return;
    }

    // Synthesized sounds (click, stamp, swoosh, warning)
    this.synthesize(type, options);
  }

  private synthesize(type: SfxType, options?: SoundOptions): void {
    const { ctx, sfxGain } = this.engine;
    if (!ctx || !sfxGain) return;
    playSynthesized(ctx, sfxGain, type, options);
  }

  private playBuffer(buffer: AudioBuffer, type: SfxType, options?: SoundOptions): void {
    const { ctx, sfxGain } = this.engine;
    if (!ctx || !sfxGain) return;

    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();

      // Per-sound baseline volume weighting
      const baseVolume = applySfxProfile(source, type);

      if (options?.playbackRate) {
        source.playbackRate.value = options.playbackRate;
      }
      if (options?.detune) {
        source.detune.value = options.detune;
      }

      const instanceVolume = Math.max(0, Math.min(1, (options?.volume ?? 1.0) * baseVolume));
      gain.gain.setValueAtTime(instanceVolume, ctx.currentTime);

      source.connect(gain);
      gain.connect(sfxGain);

      source.start();
    } catch (err) {
      console.warn(`[AudioManager] Error playing buffer for ${type}:`, err);
    }
  }

  private playHtmlAudioFallback(type: SfxType): void {
    const url = SOUND_URLS[type];
    if (!url || typeof window === "undefined") return;

    try {
      const audio = new Audio(url);
      audio.volume = Math.min(1, this.engine.masterVolume * this.engine.sfxVolume * 0.5);
      audio.play().catch(() => {});
    } catch {
      // ignore
    }
  }
}

export const audioManager = new AudioManager();
