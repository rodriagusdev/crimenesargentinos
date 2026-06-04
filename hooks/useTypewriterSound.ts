import { useRef } from "react";
export function useTypewriterSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const play = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/typewriter.wav");
      audioRef.current.volume = 0.3;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };
  return play;
}
