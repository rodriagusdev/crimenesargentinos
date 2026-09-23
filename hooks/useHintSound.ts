import { useRef } from "react";

export function useHintSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/sounds/hint.wav");
        audioRef.current.volume = 0.2;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignorar restricciones de autoplay si ocurren
      });
    } catch {
      // Ignorar en entornos sin soporte de Audio
    }
  };

  return play;
}
