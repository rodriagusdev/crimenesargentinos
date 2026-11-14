"use client";

import { useEffect } from "react";
import { audioManager } from "@/lib/audioManager";

export default function SoundtrackPlayer() {
  useEffect(() => {
    // Request background music on client mount; the <audio> element is created (and downloaded) only on the first user gesture: starts with songdefault.mp3 and alternates with songdefault2.mp3 and songdefault3.mp3
    audioManager.startMusic();
    // Start subtle ambient soundscape: raindrops against window + occasional distant police radio & sirens
    audioManager.startAmbient();
  }, []);

  return null;
}
