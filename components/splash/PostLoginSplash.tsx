"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import CaseFolder from "./CaseFolder";
import { reached, useSplashSequence } from "@/hooks/useSplashSequence";
import { clearSplashPending, isSplashPending } from "@/lib/splashStorage";

const noopSubscribe = () => () => {};

// Muestra el splash "Expediente Clasificado" una sola vez, justo después del login
export default function PostLoginSplash() {
  const pending = useSyncExternalStore(noopSubscribe, isSplashPending, () => false);
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    clearSplashPending();
    setDone(true);
  }, []);

  if (!pending || done) return null;
  return <SplashScene onFinish={finish} />;
}

function SplashScene({ onFinish }: { onFinish: () => void }) {
  const { state, advance } = useSplashSequence(onFinish);
  const exiting = state.phase === "exiting";

  return (
    <div
      role="dialog"
      aria-label="Crímenes Argentinos"
      onClick={advance}
      className={`fixed inset-0 z-50 overflow-hidden bg-[#04070d] cursor-pointer select-none transition-opacity duration-500 ${
        exiting ? "splash-shake opacity-0 delay-300" : "opacity-100"
      }`}
    >
      {/* Lluvia sobre la ventana */}
      <div className="splash-rain absolute inset-0 pointer-events-none" aria-hidden />

      {/* Destello de patrullero que cruza la oscuridad */}
      <div className="splash-siren absolute inset-0 pointer-events-none" aria-hidden />

      {/* Cono de luz de la lámpara */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          reached(state, "lamp") ? "splash-lamp opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_50%_38%,rgba(255,196,110,0.32)_0%,rgba(255,170,80,0.10)_45%,transparent_75%)]" />
      </div>

      {/* Escritorio */}
      <div className="absolute bottom-0 inset-x-0 h-[38%] bg-gradient-to-b from-[#2a1a0f] to-[#120a05] shadow-[inset_0_12px_30px_rgba(0,0,0,0.6)]" aria-hidden />

      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-10 px-4">
        <CaseFolder state={state} />

        <p
          className={`text-[10px] sm:text-sm tracking-widest text-[#FFF3C7] text-center [text-shadow:_0_2px_0_#1E2A36] transition-opacity duration-500 ${
            state.phase === "ready" ? "splash-blink opacity-100" : "opacity-0"
          }`}
        >
          ▶ PRESIONÁ CUALQUIER TECLA PARA INVESTIGAR
        </p>
      </div>

      {!reached(state, "ready") && (
        <span className="absolute bottom-4 right-4 z-10 text-[8px] sm:text-[10px] tracking-widest text-[#FFF3C7]/40">
          CLIC PARA SALTAR
        </span>
      )}
    </div>
  );
}
