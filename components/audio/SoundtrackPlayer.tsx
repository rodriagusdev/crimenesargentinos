"use client";

import { useEffect } from "react";
import { audioManager } from "@/lib/audioManager";
import { useAudioStore } from "@/stores/useAudioStore";

export default function SoundtrackPlayer() {
  const isMuted = useAudioStore((state) => state.isMuted);
  const masterVolume = useAudioStore((state) => state.masterVolume);
  const musicVolume = useAudioStore((state) => state.musicVolume);

  useEffect(() => {
    // Start background music loop on client mount: starts with songdefault.mp3 and alternates with songdefault2.mp3 and songdefault3.mp3
    audioManager.startMusic();
    // Start subtle ambient soundscape: raindrops against window + occasional distant police radio & sirens
    audioManager.startAmbient();
  }, []);

  return null;
}
