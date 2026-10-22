import { create } from "zustand";
import { audioManager, SfxType } from "@/lib/audioManager";

export type { SfxType };

interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  isMuted: boolean;
}

interface AudioState {
  masterVolume: number; // 0.0 to 1.0
  sfxVolume: number;    // 0.0 to 1.0
  musicVolume: number;  // 0.0 to 1.0
  isMuted: boolean;
  setMasterVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  toggleMute: () => void;
  playSfx: (type: SfxType) => void;
  startMusic: () => void;
  stopMusic: () => void;
  preloadAudio: () => Promise<void>;
}

const STORAGE_KEY = "crimenes_audio_settings";

function getInitialSettings(): AudioSettings {
  if (typeof window === "undefined") {
    return { masterVolume: 0.8, sfxVolume: 0.8, musicVolume: 0.3, isMuted: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        masterVolume: typeof parsed.masterVolume === "number" ? parsed.masterVolume : 0.8,
        sfxVolume: typeof parsed.sfxVolume === "number" ? parsed.sfxVolume : 0.8,
        musicVolume: typeof parsed.musicVolume === "number" ? parsed.musicVolume : 0.3,
        isMuted: Boolean(parsed.isMuted),
      };
    }
  } catch {
    // fallback defaults
  }
  return { masterVolume: 0.8, sfxVolume: 0.8, musicVolume: 0.3, isMuted: false };
}

function saveSettings(settings: AudioSettings) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }
}

// Initialize audioManager with initial persisted settings
const initialSettings = getInitialSettings();
audioManager.setMasterVolume(initialSettings.masterVolume);
audioManager.setSfxVolume(initialSettings.sfxVolume);
audioManager.setMusicVolume(initialSettings.musicVolume);
audioManager.setMuted(initialSettings.isMuted);

// Start preloading buffers in background on client
if (typeof window !== "undefined") {
  audioManager.preload().catch(() => {});
}

export const useAudioStore = create<AudioState>((set) => {
  return {
    masterVolume: initialSettings.masterVolume,
    sfxVolume: initialSettings.sfxVolume,
    musicVolume: initialSettings.musicVolume,
    isMuted: initialSettings.isMuted,

    setMasterVolume: (masterVolume: number) => {
      const clamped = Math.max(0, Math.min(1, masterVolume));
      audioManager.setMasterVolume(clamped);
      set((state) => {
        saveSettings({
          masterVolume: clamped,
          sfxVolume: state.sfxVolume,
          musicVolume: state.musicVolume,
          isMuted: state.isMuted,
        });
        return { masterVolume: clamped };
      });
    },

    setSfxVolume: (sfxVolume: number) => {
      const clamped = Math.max(0, Math.min(1, sfxVolume));
      audioManager.setSfxVolume(clamped);
      set((state) => {
        saveSettings({
          masterVolume: state.masterVolume,
          sfxVolume: clamped,
          musicVolume: state.musicVolume,
          isMuted: state.isMuted,
        });
        return { sfxVolume: clamped };
      });
    },

    setMusicVolume: (musicVolume: number) => {
      const clamped = Math.max(0, Math.min(1, musicVolume));
      audioManager.setMusicVolume(clamped);
      set((state) => {
        saveSettings({
          masterVolume: state.masterVolume,
          sfxVolume: state.sfxVolume,
          musicVolume: clamped,
          isMuted: state.isMuted,
        });
        return { musicVolume: clamped };
      });
    },

    toggleMute: () => {
      set((state) => {
        const nextMute = !state.isMuted;
        audioManager.setMuted(nextMute);
        saveSettings({
          masterVolume: state.masterVolume,
          sfxVolume: state.sfxVolume,
          musicVolume: state.musicVolume,
          isMuted: nextMute,
        });
        return { isMuted: nextMute };
      });
    },

    playSfx: (type: SfxType) => {
      audioManager.play(type);
    },

    startMusic: () => {
      audioManager.startMusic("/sounds/songdefault.mp3");
    },

    stopMusic: () => {
      audioManager.stopMusic();
    },

    preloadAudio: () => {
      return audioManager.preload();
    },
  };
});
