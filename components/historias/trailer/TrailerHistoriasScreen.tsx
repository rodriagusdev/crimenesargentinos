"use client";

import { useEffect } from "react";
import { HISTORIAS_TRAILER_SCENES } from "./historiasTrailerScenes";
import TrailerPoster from "./TrailerPoster";
import TrailerControls from "@/components/home/trailer/TrailerControls";
import { useTrailerTimeline } from "@/hooks/useTrailerTimeline";

// "Tráiler de los casos": un tráiler de cine que presenta los ocho casos uno por uno (póster con ▶, escenas con
// franjas negras, grano y cortes, y placa final con los botones). El sonido arranca solo cuando el visitante da play.
export default function TrailerHistoriasScreen() {
  const { state, scene, sceneElapsed, elapsed, total, starts, play, pause, skip } = useTrailerTimeline(HISTORIAS_TRAILER_SCENES);
  const watching = state.phase === "playing" || state.phase === "paused";

  // Espacio pausa/sigue, Escape salta al final (solo mientras se ve el tráiler)
  useEffect(() => {
    if (!watching) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (state.phase === "playing") pause();
        else play();
      } else if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [watching, state.phase, play, pause, skip]);

  if (!watching) {
    return <TrailerPoster ended={state.phase === "ended"} seconds={Math.round(total / 1000)} onPlay={play} />;
  }

  const current = HISTORIAS_TRAILER_SCENES[scene];
  const paused = state.phase === "paused";

  return (
    <div className="relative h-svh bg-black text-[#FFF3C7] overflow-hidden select-none">
      {/* En pausa también se congelan las animaciones de la escena */}
      <div key={scene} className={`home-cut absolute inset-0 ${paused ? "[&_*]:[animation-play-state:paused]" : ""}`}>
        {current.render(sceneElapsed)}
      </div>

      {/* Textura de película y franjas de cine */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
        <div className="splash-grain absolute -inset-[50%]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute top-0 inset-x-0 h-[9vh] bg-black" />
        <div className="absolute bottom-0 inset-x-0 h-[9vh] bg-black" />
      </div>

      {/* En pausa la imagen se congela: aviso centrado, clic para seguir */}
      {paused && (
        <button
          type="button"
          onClick={play}
          className="absolute inset-x-0 top-[9vh] bottom-[9vh] z-10 flex items-center justify-center bg-black/45 cursor-pointer"
        >
          <span className="px-5 py-3 border-2 border-[#FFF3C7]/70 text-[10px] sm:text-xs tracking-[0.3em]">❚❚ EN PAUSA</span>
        </button>
      )}

      <TrailerControls
        playing={state.phase === "playing"}
        elapsed={elapsed}
        total={total}
        starts={starts}
        onToggle={state.phase === "playing" ? pause : play}
        onSkip={skip}
      />
    </div>
  );
}
