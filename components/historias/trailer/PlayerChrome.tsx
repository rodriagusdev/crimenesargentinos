"use client";

import { useEffect, useState } from "react";
import type { CaseStory } from "@/lib/caseStories";
import { useTimelineElapsed, type TrailerState } from "@/hooks/useTrailerTimeline";

type Props = {
  story: CaseStory;
  number: number;
  /** Total de cintas (para "1 / 8") */
  tapes: number;
  state: TrailerState;
  duration: number;
  /** Inicio de cada escena, para las marcas de la barra */
  starts: number[];
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

// Tiempo sin mover el mouse para esconder los controles mientras se reproduce
const IDLE_MS = 2500;

const clock = (ms: number) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const control =
  "flex h-8 min-w-8 sm:h-11 sm:min-w-11 items-center justify-center gap-2 rounded-lg px-3 text-[10px] sm:text-xs text-[#FFF3C7] cursor-pointer transition-colors hover:bg-[#E1C380]/15 hover:text-[#E1C380] disabled:opacity-30 disabled:cursor-default";

// Controles del reproductor a pantalla completa: arriba qué caso es y CERRAR; abajo la barra de progreso con una
// marca por escena, el tiempo y los botones. Se esconden solos si no se mueve el mouse mientras se reproduce.
export default function PlayerChrome({ story, number, tapes, state, duration, starts, onToggle, onPrev, onNext, onClose }: Props) {
  const [active, setActive] = useState(true);
  const playing = state.phase === "playing";
  const ended = state.phase === "ended";

  useEffect(() => {
    let timer = setTimeout(() => setActive(false), IDLE_MS);
    const wake = () => {
      setActive(true);
      clearTimeout(timer);
      timer = setTimeout(() => setActive(false), IDLE_MS);
    };
    window.addEventListener("pointermove", wake);
    window.addEventListener("keydown", wake);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  const shown = active || !playing;
  const fade = `transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0 pointer-events-none"}`;

  return (
    <>
      {/* Arriba: qué cinta es y cerrar */}
      <div className={`absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-black/80 to-transparent px-3 pt-2 pb-5 sm:px-6 sm:pt-3 sm:pb-10 ${fade}`}>
        <div className="min-w-0">
          <p className="hidden sm:block text-[10px] tracking-[0.3em] text-[#7fd1ff]">
            EXPEDIENTE {String(number).padStart(2, "0")} · CINTA {number} / {tapes}
          </p>
          <p className="mt-1 truncate font-serif text-sm sm:text-2xl font-black uppercase text-white [text-shadow:0_2px_0_#000]">{story.title}</p>
        </div>
        <button type="button" onClick={onClose} className={`${control} border border-[#FFF3C7]/30 bg-black/40`} aria-label="Cerrar el tráiler">
          ✕ <span className="hidden sm:inline">CERRAR</span>
        </button>
      </div>

      {/* Abajo: progreso y botones */}
      {!ended && (
        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pt-5 pb-1.5 sm:px-6 sm:pt-10 sm:pb-4 ${fade}`}>
          <ProgressBar state={state} duration={duration} starts={starts} />
          <div className="mt-1 sm:mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button type="button" onClick={onPrev} className={control} aria-label="Cinta anterior">
                ◀◀ <span className="hidden md:inline">ANTERIOR</span>
              </button>
              <button type="button" onClick={onToggle} className={`${control} sm:min-w-20 border border-[#E1C380]/60`} aria-label={playing ? "Pausar" : "Reproducir"}>
                {playing ? "❚❚" : "▶"}
                <span className="hidden sm:inline">{playing ? "PAUSA" : "PLAY"}</span>
              </button>
              <button type="button" onClick={onNext} className={control} aria-label="Cinta siguiente">
                <span className="hidden md:inline">SIGUIENTE</span> ▶▶
              </button>
            </div>
            <Clock state={state} duration={duration} />
          </div>
        </div>
      )}
    </>
  );
}

// Barra de progreso con una marca por escena (se refresca en cada tick; el resto de los controles no)
function ProgressBar({ state, duration, starts }: { state: TrailerState; duration: number; starts: number[] }) {
  const elapsed = useTimelineElapsed(state, duration);
  const progress = duration ? Math.min(1, elapsed / duration) : 0;
  return (
    <div className="relative h-1.5 rounded-full bg-white/20" aria-hidden>
      <div className="absolute inset-y-0 left-0 rounded-full bg-[#E1C380]" style={{ width: `${progress * 100}%` }} />
      {starts.slice(1).map((s) => (
        <span key={s} className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-black/70" style={{ left: `${(s / duration) * 100}%` }} />
      ))}
    </div>
  );
}

function Clock({ state, duration }: { state: TrailerState; duration: number }) {
  const elapsed = useTimelineElapsed(state, duration);
  return (
    <span className="font-mono text-xs sm:text-sm text-white/80 tabular-nums">
      {clock(elapsed)} / {clock(duration)}
    </span>
  );
}
