import type { SfxType } from "./types";

// SFX backed by audio files (the rest are synthesized in synthesizedSfx.ts)
export const SOUND_URLS: Partial<Record<SfxType, string>> = {
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
  radio: "/sounds/radiodistante.ogg",
};

export const RAIN_URL = "/sounds/raindrops.ogg";

export const AMBIENT_EVENT_URLS: readonly string[] = [
  "/sounds/radiodistante.ogg",
  "/sounds/sirenadistante.ogg",
];

export const DEFAULT_MUSIC_PLAYLIST: readonly string[] = [
  "/sounds/songdefault.mp3",
  "/sounds/songdefault2.mp3",
  "/sounds/songdefault3.mp3",
];

/**
 * Per-sound baseline volume weighting (and micro pitch variation for some SFX).
 * Mutates the source's playbackRate when the sound has variation; returns the base volume.
 */
export function applySfxProfile(source: AudioBufferSourceNode, type: SfxType): number {
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
  return baseVolume;
}
