import { DEFAULT_MUSIC_PLAYLIST } from "./sfxCatalog";

// Background Music & Soundtrack Playlist (HTML <audio>, alternating tracks on "ended")
export class MusicPlayer {
  private musicAudio: HTMLAudioElement | null = null;
  private isMusicDesired: boolean = false;
  private musicPlaylist: string[] = [...DEFAULT_MUSIC_PLAYLIST];
  private currentTrackIndex: number = 0;
  // The music <audio> element is only created after the first user gesture (autoplay is blocked before that anyway),
  // so no MP3 is downloaded on page load.
  private hasUserGesture: boolean;
  // Next track is warmed up only when the current one is close to its end
  private nextTrackPreload: HTMLAudioElement | null = null;
  private nextTrackPreloadUrl: string | null = null;

  /** `getVolume` returns the effective music volume (master × music, 0 when muted). */
  constructor(private readonly getVolume: () => number, hasUserGesture: boolean) {
    this.hasUserGesture = hasUserGesture;
  }

  /** First user gesture: create/resume the music if it was requested before the gesture. */
  onUserGesture(): void {
    this.hasUserGesture = true;
    if (this.isMusicDesired) {
      if (!this.musicAudio) {
        this.playCurrentTrack();
      } else if (this.musicAudio.paused) {
        this.musicAudio.play().catch(() => {});
      }
    }
  }

  applyVolume(): void {
    if (!this.musicAudio) return;
    this.musicAudio.volume = Math.max(0, Math.min(1, this.getVolume()));
  }

  start(playlistOrUrl?: string | string[]): void {
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
    // Defer creating/downloading the music until the first user gesture (handled in onUserGesture)
    if (!this.hasUserGesture) return;

    const currentUrl = this.musicPlaylist[this.currentTrackIndex] || "/sounds/songdefault.mp3";

    if (!this.musicAudio) {
      this.musicAudio = new Audio(currentUrl);
      this.musicAudio.loop = false; // Alternates tracks via "ended" listener
      this.musicAudio.preload = "auto";

      this.musicAudio.addEventListener("timeupdate", () => {
        this.maybePreloadNextTrack();
      });

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

    this.applyVolume();

    const playPromise = this.musicAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback until first user gesture; listener is already attached
      });
    }
  }

  /** Warm up the next track only when the current one has less than ~10 s left. */
  private maybePreloadNextTrack(): void {
    const audio = this.musicAudio;
    if (!audio || this.musicPlaylist.length < 2) return;
    const { duration, currentTime } = audio;
    if (!Number.isFinite(duration) || duration - currentTime > 10) return;

    const nextIndex = (this.currentTrackIndex + 1) % this.musicPlaylist.length;
    const nextUrl = this.musicPlaylist[nextIndex];
    if (this.nextTrackPreloadUrl === nextUrl) return;

    this.nextTrackPreloadUrl = nextUrl;
    const preloadAudio = new Audio();
    preloadAudio.preload = "auto";
    preloadAudio.src = nextUrl;
    this.nextTrackPreload = preloadAudio;
  }

  playNextTrack(): void {
    if (this.musicPlaylist.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.musicPlaylist.length;
    this.playCurrentTrack();
  }

  stop(): void {
    this.isMusicDesired = false;
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
    // songdefault is always the first to play when restarted
    this.currentTrackIndex = 0;
  }

  pause(): void {
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
  }

  resume(): void {
    if (this.musicAudio && this.isMusicDesired) {
      this.applyVolume();
      this.musicAudio.play().catch(() => {});
    }
  }
}
