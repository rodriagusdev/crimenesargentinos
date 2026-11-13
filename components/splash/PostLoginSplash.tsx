"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useSplashSequence } from "@/hooks/useSplashSequence";
import {
  chooseSplashVariant,
  clearSplashPending,
  getSplashRequest,
  markSplashVariantSeen,
} from "@/lib/splashStorage";
import { getUserIdentity } from "@/lib/auth";
import { SPLASH_VARIANTS, SPLASH_VARIANT_IDS } from "./variants";
import type { SplashVariant } from "./variants/types";

const noopSubscribe = () => () => {};

// Muestra un splash al azar una sola vez, justo después del login (o el de `?splash=<id>` como vista previa)
export default function PostLoginSplash() {
  const request = useSyncExternalStore(noopSubscribe, getSplashRequest, () => null);
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    clearSplashPending();
    setDone(true);
  }, []);

  if (!request || done) return null;
  return <SplashShell onFinish={finish} variantId={request} />;
}

function SplashShell({ onFinish, variantId }: { onFinish: () => void; variantId: string }) {
  // Elección pura (en modo estricto React puede llamarla dos veces); el guardado va en un efecto
  const [variant] = useState<SplashVariant>(
    () => SPLASH_VARIANTS[variantId] ?? SPLASH_VARIANTS[chooseSplashVariant(SPLASH_VARIANT_IDS)],
  );
  const isPreview = variantId in SPLASH_VARIANTS;

  useEffect(() => {
    if (!isPreview) markSplashVariantSeen(variant.id, SPLASH_VARIANT_IDS);
  }, [isPreview, variant.id]);
  const [agentName] = useState(() => getUserIdentity().name.toUpperCase() || "DETECTIVE");
  const [steps] = useState(() => variant.steps(agentName));
  const { state, progress, advance } = useSplashSequence(steps, onFinish);

  const exiting = state.phase === "exiting";
  const revealed = state.phase !== "playing";
  const { Scene } = variant;

  return (
    <div
      role="dialog"
      aria-label="Crímenes Argentinos"
      onClick={advance}
      className={`fixed inset-0 z-50 overflow-hidden bg-[#04070d] cursor-pointer select-none transition-opacity duration-500 ${
        exiting ? "splash-shake opacity-0 delay-300" : "opacity-100"
      }`}
    >
      <Scene progress={progress} total={steps.length} exiting={exiting} agentName={agentName} />

      {/* Textura de video viejo, común a todos los splash */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="splash-scanlines absolute inset-0" />
        <div className="splash-grain absolute -inset-[50%]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* Bienvenida e invitación a entrar */}
      <div className="absolute bottom-[6%] inset-x-0 z-20 flex flex-col items-center gap-3 px-4 text-center pointer-events-none">
        <p
          className={`text-xs sm:text-lg tracking-widest text-[#E1C380] [text-shadow:_0_3px_0_#1E2A36,0_0_18px_rgba(225,195,128,0.45)] transition-all duration-500 ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          BIENVENIDO, AGENTE {agentName}
        </p>
        <p
          className={`text-[9px] sm:text-xs tracking-widest text-[#FFF3C7] [text-shadow:_0_2px_0_#1E2A36] transition-opacity duration-500 ${
            state.phase === "ready" ? "splash-blink opacity-100" : "opacity-0"
          }`}
        >
          ▶ PRESIONÁ CUALQUIER TECLA PARA INVESTIGAR
        </p>
      </div>

      {!revealed && (
        <span className="absolute bottom-4 right-4 z-20 text-[8px] sm:text-[10px] tracking-widest text-[#FFF3C7]/40">
          CLIC PARA SALTAR
        </span>
      )}

      {/* Sello y flash de cámara forense al entrar */}
      {exiting && (
        <>
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <span className="splash-stamp-slam px-4 py-2 border-4 border-double border-red-700 text-red-700 text-sm sm:text-2xl tracking-widest bg-[#f4efe2]/80">
              EN INVESTIGACIÓN
            </span>
          </div>
          <div className="splash-camera-flash absolute inset-0 z-30 bg-white pointer-events-none" aria-hidden />
        </>
      )}
    </div>
  );
}
