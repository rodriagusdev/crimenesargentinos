import { useAudioStore } from "@/stores/useAudioStore";

export function useTypewriterSound() {
  const playSfx = useAudioStore((state) => state.playSfx);

  return () => {
    playSfx("typewriter");
  };
}
