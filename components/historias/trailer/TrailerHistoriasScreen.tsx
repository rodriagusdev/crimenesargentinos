"use client";

import { useCallback, useState } from "react";
import VhsShelf, { SHELF_VISIBLE } from "./VhsShelf";
import TrailerPlayer from "./TrailerPlayer";
import VideotecaHero from "./VideotecaHero";
import VideotecaSideDecor from "./VideotecaSideDecor";
import { CASE_SCENES } from "./caseTrailer";
import GameBackdrop, { CautionBar, GAME_BG } from "@/components/galeria/GameBackdrop";
import { audioManager } from "@/lib/audioManager";
import { CASE_STORIES } from "@/lib/caseStories";
import { timelineTotal } from "@/hooks/useTrailerTimeline";

const TRAILER_MS = timelineTotal(CASE_SCENES);

// Propuesta "Tráiler de los casos" (distinta al tráiler de la home): la videoteca de la Central.
// Un destacado con el caso elegido y un estante con una cinta VHS por caso; "VER TRÁILER" pasa a pantalla completa
// el tráiler de ESE caso: el lugar, el hecho, lo que se busca, la frase gancho y el título. Nada de pistas ni sospechosos.
export default function TrailerHistoriasScreen() {
  // Cinta en la videocasetera (índice en CASE_STORIES; null: ninguna)
  const [tape, setTape] = useState<number | null>(null);
  // Caso destacado (el del casete elegido en el estante)
  const [featured, setFeatured] = useState(0);
  // Carrusel del estante: primer casete visible y último movimiento
  const [shelf, setShelf] = useState({ start: 0, dir: "down" as "up" | "down", n: 0 });
  const maxStart = CASE_STORIES.length - SHELF_VISIBLE;
  const moveShelf = (dir: "up" | "down") =>
    setShelf((s) => ({ start: Math.min(maxStart, Math.max(0, s.start + (dir === "down" ? 1 : -1))), dir, n: s.n + 1 }));
  // Paginador: deja ese casete arriba (o lo más arriba posible)
  const jumpShelf = (index: number) =>
    setShelf((s) => {
      const start = Math.min(maxStart, Math.max(0, index));
      return start === s.start ? s : { start, dir: start > s.start ? "down" : "up", n: s.n + 1 };
    });

  const insert = (index: number) => {
    audioManager.play("slide");
    setTape(index);
    setFeatured(index);
    // El estante sigue a la cinta puesta (por ejemplo, con "siguiente cinta")
    setShelf((s) =>
      index >= s.start && index < s.start + SHELF_VISIBLE
        ? s
        : { start: Math.min(maxStart, Math.max(0, index - 1)), dir: index > s.start ? "down" : "up", n: s.n + 1 },
    );
    // Pantalla completa (si el navegador lo permite; si no, el reproductor igual ocupa toda la ventana)
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
  };
  // Escape o salida de la pantalla completa: solo se saca la cinta (la línea de tiempo vive en el reproductor)
  const close = useCallback(() => setTape(null), []);
  const eject = () => {
    audioManager.play("click");
    setTape(null);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };

  const feature = (index: number) => {
    audioManager.play("opencasefile");
    setFeatured(index);
  };

  return (
    <div className={`relative ${GAME_BG} min-h-svh px-3 sm:px-6 py-6 sm:py-12 pb-16 text-[#FFF3C7]`}>
      <GameBackdrop glow="120,170,255" bright />
      <VideotecaSideDecor />
      <CautionBar className="max-w-[85rem]" />
      {/* Ancho: el reproductor (~68rem) queda en 16:9 con el mismo alto que el estante (~616px); el alto lo iguala el grid */}
      <div className="relative max-w-[85rem] mx-auto flex flex-col gap-5">
        <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <h1 className="text-base sm:text-xl leading-relaxed">UN TRÁILER POR CASO</h1>
          <p className="font-mono text-sm text-[#FFF3C7]/60">{CASE_STORIES.length} cintas · elegí una del estante</p>
        </header>

        {/* En escritorio el reproductor se estira hasta donde termina el estante (con su paginador) */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-stretch">
          <VideotecaHero
            story={CASE_STORIES[featured]}
            number={featured + 1}
            seconds={Math.round(TRAILER_MS / 1000)}
            onPlay={() => insert(featured)}
          />

          {/* Estante vertical con los casetes: elegir uno lo pone en el destacado */}
          <VhsShelf
            start={shelf.start}
            move={{ dir: shelf.dir, n: shelf.n }}
            onMove={moveShelf}
            onJump={jumpShelf}
            watching={featured}
            onPick={feature}
          />
        </div>
      </div>

      {/* Reproductor a pantalla completa: solo mientras hay una cinta puesta */}
      {tape !== null && <TrailerPlayer key={tape} tape={tape} onInsert={insert} onClose={close} onEject={eject} />}
    </div>
  );
}
