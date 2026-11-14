"use client";

import { useEffect, useState } from "react";
import { useSplashSequence } from "@/hooks/useSplashSequence";
import { chooseSplashVariant, markSplashVariantSeen } from "@/lib/splashStorage";
import { getUserIdentity } from "@/lib/auth";
import { useT } from "@/hooks/useT";
import { useLocale } from "@/stores/useLocaleStore";
import { postLoginSplashMessages } from "./PostLoginSplash.messages";
import SplashCurtain from "./SplashCurtain";
import { SPLASH_VARIANT_IDS, SPLASH_VARIANT_LOADERS, isSplashVariantId } from "./variants";
import type { SplashVariant } from "./variants/types";

type SplashShellProps = { onFinish: () => void; request: string };

// Elige el splash (o toma el de la vista previa), descarga solo ese y lo reproduce
export default function SplashShell({ onFinish, request }: SplashShellProps) {
  const isPreview = isSplashVariantId(request);
  // Elección pura (en modo estricto React puede llamarla dos veces); el guardado va en un efecto
  const [variantId] = useState(() => (isSplashVariantId(request) ? request : chooseSplashVariant(SPLASH_VARIANT_IDS)));
  const [variant, setVariant] = useState<SplashVariant | null>(null);

  useEffect(() => {
    if (!isPreview) markSplashVariantSeen(variantId, SPLASH_VARIANT_IDS);
  }, [isPreview, variantId]);

  useEffect(() => {
    let cancelled = false;
    SPLASH_VARIANT_LOADERS[variantId]().then((v) => {
      if (!cancelled) setVariant(v);
    });
    return () => {
      cancelled = true;
    };
  }, [variantId]);

  if (!variant) return <SplashCurtain />;
  return <SplashPlayer onFinish={onFinish} variant={variant} />;
}

function SplashPlayer({ onFinish, variant }: { onFinish: () => void; variant: SplashVariant }) {
  const t = useT(postLoginSplashMessages);
  const locale = useLocale();
  const [agentName] = useState(() => getUserIdentity().name.toUpperCase() || t("defaultName"));
  const [steps] = useState(() => variant.steps(agentName, locale));
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
          {t("welcome", { name: agentName })}
        </p>
        <p
          className={`text-[9px] sm:text-xs tracking-widest text-[#FFF3C7] [text-shadow:_0_2px_0_#1E2A36] transition-opacity duration-500 ${
            state.phase === "ready" ? "splash-blink opacity-100" : "opacity-0"
          }`}
        >
          {t("pressAnyKey")}
        </p>
      </div>

      {!revealed && (
        <span className="absolute bottom-4 right-4 z-20 text-[8px] sm:text-[10px] tracking-widest text-[#FFF3C7]/40">
          {t("clickToSkip")}
        </span>
      )}

      {/* Sello y flash de cámara forense al entrar */}
      {exiting && (
        <>
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <span className="splash-stamp-slam px-4 py-2 border-4 border-double border-red-700 text-red-700 text-sm sm:text-2xl tracking-widest bg-[#f4efe2]/80">
              {t("stamp")}
            </span>
          </div>
          <div className="splash-camera-flash absolute inset-0 z-30 bg-white pointer-events-none" aria-hidden />
        </>
      )}
    </div>
  );
}
