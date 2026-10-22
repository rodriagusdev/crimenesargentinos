"use client";

import { useEffect } from "react";
import { audioManager } from "@/lib/audioManager";
import { useAudioStore } from "@/stores/useAudioStore";

export default function SoundtrackPlayer() {
  const isMuted = useAudioStore((state) => state.isMuted);
  const masterVolume = useAudioStore((state) => state.masterVolume);
  const musicVolume = useAudioStore((state) => state.musicVolume);

  useEffect(() => {
    // Start background music loop on client mount (respects volume and autoplay rules)
    audioManager.startMusic("/sounds/songdefault.mp3");
  }, []);

  return null;
}
