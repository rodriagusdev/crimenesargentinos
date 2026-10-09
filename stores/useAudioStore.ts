import { create } from "zustand";

export type SfxType = "typewriter" | "hint" | "click" | "plane" | "stamp" | "swoosh" | "defeat" | "warning";

interface AudioState {
  masterVolume: number; // 0.0 to 1.0
  sfxVolume: number;    // 0.0 to 1.0
  isMuted: boolean;
  setMasterVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  toggleMute: () => void;
  playSfx: (type: SfxType) => void;
}

const STORAGE_KEY = "crimenes_audio_settings";

function getInitialSettings(): { masterVolume: number; sfxVolume: number; isMuted: boolean } {
  if (typeof window === "undefined") {
    return { masterVolume: 0.8, sfxVolume: 0.8, isMuted: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        masterVolume: typeof parsed.masterVolume === "number" ? parsed.masterVolume : 0.8,
        sfxVolume: typeof parsed.sfxVolume === "number" ? parsed.sfxVolume : 0.8,
        isMuted: Boolean(parsed.isMuted),
      };
    }
  } catch {
    // fallback defaults
  }
  return { masterVolume: 0.8, sfxVolume: 0.8, isMuted: false };
}

function saveSettings(settings: { masterVolume: number; sfxVolume: number; isMuted: boolean }) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }
}

// Procedural audio synthesizer using Web Audio API as primary or fallback
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => { });
  }
  return audioCtx;
}

export const useAudioStore = create<AudioState>((set, get) => {
  const initial = getInitialSettings();

  return {
    masterVolume: initial.masterVolume,
    sfxVolume: initial.sfxVolume,
    isMuted: initial.isMuted,

    setMasterVolume: (masterVolume: number) => {
      const clamped = Math.max(0, Math.min(1, masterVolume));
      set((state) => {
        saveSettings({ masterVolume: clamped, sfxVolume: state.sfxVolume, isMuted: state.isMuted });
        return { masterVolume: clamped };
      });
    },

    setSfxVolume: (sfxVolume: number) => {
      const clamped = Math.max(0, Math.min(1, sfxVolume));
      set((state) => {
        saveSettings({ masterVolume: state.masterVolume, sfxVolume: clamped, isMuted: state.isMuted });
        return { sfxVolume: clamped };
      });
    },

    toggleMute: () => {
      set((state) => {
        const nextMute = !state.isMuted;
        saveSettings({ masterVolume: state.masterVolume, sfxVolume: state.sfxVolume, isMuted: nextMute });
        return { isMuted: nextMute };
      });
    },

    playSfx: (type: SfxType) => {
      const { masterVolume, sfxVolume, isMuted } = get();
      if (isMuted) return;

      const effectiveVolume = masterVolume * sfxVolume;
      if (effectiveVolume <= 0) return;

      // File-based sounds with fallback
      if (type === "defeat") {
        try {
          const audio = new Audio("/sounds/defeat.mp3");
          audio.volume = Math.min(1, effectiveVolume * 0.7);
          const p = audio.play();
          if (p !== undefined) {
            p.catch(() => { });
          }
          return;
        } catch {
          // fallback to synthesis
        }
      }

      if (type === "plane") {
        try {
          const audio = new Audio("/sounds/plane.wav");
          audio.volume = Math.min(1, effectiveVolume * 0.6);
          const p = audio.play();
          if (p !== undefined) {
            p.catch(() => { });
          }
          return;
        } catch {
          // fallback to synthesis
        }
      }

      if (type === "typewriter") {
        try {
          const audio = new Audio("/sounds/typewriter.wav");
          audio.volume = Math.min(1, effectiveVolume * 0.2);
          audio.play().catch(() => { });
          return;
        } catch {
          // fallback to synthesis
        }
      }

      if (type === "hint") {
        try {
          const audio = new Audio("/sounds/hint.wav");
          audio.volume = Math.min(1, effectiveVolume * 0.4);
          audio.play().catch(() => { });
          return;
        } catch {
          // fallback to synthesis
        }
      }

      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === "warning") {
        try {
          // Synthesize emergency radar/siren pulse
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

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
          gain.gain.linearRampToValueAtTime(effectiveVolume * 0.35, now + 0.05);
          gain.gain.setValueAtTime(effectiveVolume * 0.35, now + 0.55);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.7);
          osc2.stop(now + 0.7);
        } catch {
          // ignore
        }
        return;
      }

      if (type === "plane") {
        // Synthesize airplane jet / propeller flight sound (whoosh + drone sweep)
        try {
          const duration = 2.4;
          // Noise buffer for jet turbine whoosh
          const bufferSize = ctx.sampleRate * duration;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }

          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          // Bandpass filter sweep for Doppler effect
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.Q.value = 3.0;
          filter.frequency.setValueAtTime(450, now);
          filter.frequency.exponentialRampToValueAtTime(950, now + duration * 0.4);
          filter.frequency.exponentialRampToValueAtTime(320, now + duration);

          // Gain envelope
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.01, now);
          noiseGain.gain.linearRampToValueAtTime(effectiveVolume * 0.35, now + duration * 0.4);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          // Engine drone oscillators
          const osc1 = ctx.createOscillator();
          osc1.type = "sawtooth";
          osc1.frequency.setValueAtTime(110, now);
          osc1.frequency.linearRampToValueAtTime(140, now + duration * 0.4);
          osc1.frequency.linearRampToValueAtTime(95, now + duration);

          const oscGain = ctx.createGain();
          oscGain.gain.setValueAtTime(0.01, now);
          oscGain.gain.linearRampToValueAtTime(effectiveVolume * 0.15, now + duration * 0.4);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          whiteNoise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(ctx.destination);

          osc1.connect(oscGain);
          oscGain.connect(ctx.destination);

          whiteNoise.start(now);
          osc1.start(now);
          whiteNoise.stop(now + duration);
          osc1.stop(now + duration);
        } catch {
          // ignore
        }
        return;
      }

      if (type === "click") {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);

          gain.gain.setValueAtTime(effectiveVolume * 0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.06);
        } catch {
          // ignore
        }
        return;
      }

      if (type === "stamp") {
        try {
          // Gavel / stamp heavy thud
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

          gain.gain.setValueAtTime(effectiveVolume * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        } catch {
          // ignore
        }
        return;
      }

      if (type === "swoosh") {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);

          gain.gain.setValueAtTime(effectiveVolume * 0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
        } catch {
          // ignore
        }
      }
    },
  };
});
