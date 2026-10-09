import { useAudioStore } from "@/stores/useAudioStore";

export function useHintSound() {
  const playSfx = useAudioStore((state) => state.playSfx);

  return () => {
    playSfx("hint");
  };
}
