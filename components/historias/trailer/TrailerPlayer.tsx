"use client";

import { useEffect } from "react";
import VhsTelevision from "./VhsTelevision";
import { CASE_SCENES } from "./caseTrailer";
import { CASE_STORIES } from "@/lib/caseStories";
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
        story={CASE_STORIES[tape]}
        number={tape + 1}
        state={state}
        scene={scene}
        onToggle={toggle}
        onSkip={skip}
        duration={total}
        starts={starts}
        tapes={CASE_STORIES.length}
        onPrev={() => onInsert((tape - 1 + CASE_STORIES.length) % CASE_STORIES.length)}
        onNext={() => onInsert((tape + 1) % CASE_STORIES.length)}
        onEject={onEject}
      />
    </div>
  );
}
