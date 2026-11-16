"use client";

import { useEffect } from "react";
import VhsTelevision from "./VhsTelevision";
import { CASE_SCENES } from "./caseTrailer";
import { useCaseStories } from "@/hooks/useCaseStories";
import { useTrailerTimeline } from "@/hooks/useTrailerTimeline";

type Props = {
  /** Cinta puesta (índice en CASE_STORIES). Montar con `key={tape}`: cada cinta arranca reproduciendo desde el principio */
  tape: number;
  /** Poner otra cinta (anterior / siguiente) */
  onInsert: (index: number) => void;
  /** Sacar la cinta sin más (Escape o salida de la pantalla completa del navegador) */
  onClose: () => void;
  /** Botón de expulsar / cerrar */
  onEject: () => void;
};

// Reproductor a pantalla completa con su propia línea de tiempo: solo él (y su barra de progreso) se vuelve a
// renderizar mientras corre el tráiler; la videoteca de atrás queda quieta
export default function TrailerPlayer({ tape, onInsert, onClose, onEject }: Props) {
  const stories = useCaseStories();
  const { state, scene, total, starts, play, pause, skip } = useTrailerTimeline(CASE_SCENES, { autoplay: true });
  const toggle = () => (state.phase === "playing" ? pause() : play());

  // Espacio pausa/sigue y Escape saca la cinta
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (state.phase === "playing") pause();
        else if (state.phase === "paused") play();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    // Si se sale de la pantalla completa del navegador (Esc), también se saca la cinta
    const onFullscreen = () => {
      if (!document.fullscreenElement) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [state.phase, play, pause, onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
      <VhsTelevision
        fullscreen
        story={stories[tape]}
        number={tape + 1}
        state={state}
        scene={scene}
        onToggle={toggle}
        onSkip={skip}
        duration={total}
        starts={starts}
        tapes={stories.length}
        onPrev={() => onInsert((tape - 1 + stories.length) % stories.length)}
        onNext={() => onInsert((tape + 1) % stories.length)}
        onEject={onEject}
      />
    </div>
  );
}
