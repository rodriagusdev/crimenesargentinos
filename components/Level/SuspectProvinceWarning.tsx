"use client";

import { useEffect, useState } from "react";
import { useAudioStore } from "@/stores/useAudioStore";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
  es: {
    intelAlert: "Alerta de Inteligencia",
    title: "¡EL SOSPECHOSO PODRÍA ESTAR AQUÍ!",
    bodyBefore: "Los informes de inteligencia indican que el sospechoso se encuentra en",
    bodyAfter: ". ¡Inspeccioná los lugares con cautela!",
    minimize: "Minimizar alerta",
    suspectIn: "SOSPECHOSO EN {province}",
  },
  en: {
    intelAlert: "Intelligence Alert",
    title: "THE SUSPECT COULD BE HERE!",
    bodyBefore: "Intelligence reports place the suspect in",
    bodyAfter: ". Search each place with caution!",
    minimize: "Minimize alert",
    suspectIn: "SUSPECT IN {province}",
  },
});

interface SuspectProvinceWarningProps {
  provinceId: string;
  provinceName: string;
}

// Aviso "el sospechoso podría estar aquí": lo decide el backend (session.suspectInProvince), que solo informa si el
// jugador YA está en la provincia del escondite. El front no sabe dónde está el escondite de ningún caso.
// El padre lo monta con key={provinceId}: al cambiar de provincia vuelve a aparecer desplegado y a sonar.
export default function SuspectProvinceWarning({ provinceId, provinceName }: SuspectProvinceWarningProps) {
  const playSfx = useAudioStore((state) => state.playSfx);
  const t = useT(messages);
  const suspectInProvince = useGameSessionStore((state) => state.session?.suspectInProvince ?? false);
  const currentProvinceId = useGameSessionStore((state) => state.session?.currentProvinceId ?? null);
  const [dismissed, setDismissed] = useState(false);

  // Solo si el dato del backend corresponde a la provincia que se está mostrando
  const isSuspectInThisProvince = suspectInProvince && currentProvinceId?.toLowerCase() === provinceId.toLowerCase();

  // Sonido de alerta al llegar a la provincia del escondite
  useEffect(() => {
    if (isSuspectInThisProvince) playSfx("warning");
  }, [isSuspectInThisProvince, playSfx]);

  if (!isSuspectInThisProvince) {
    return null;
  }

  return (
    <div className="fixed top-auto bottom-4 sm:top-6 sm:bottom-auto [@media(max-height:500px)_and_(pointer:coarse)]:top-auto [@media(max-height:500px)_and_(pointer:coarse)]:bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-auto pointer-events-auto select-none animate-bounce-short">
      {!dismissed ? (
        <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/95 via-amber-950/90 to-red-950/95 border-2 border-amber-400/80 shadow-[0_10px_35px_rgba(255,100,0,0.45)] backdrop-blur-md text-[#FFF3C7] flex items-start gap-3.5 ring-4 ring-red-500/20">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-red-600/30 border border-red-400 flex items-center justify-center text-2xl shadow-inner animate-pulse">
            🚨
          </div>

          <div className="flex flex-col min-w-0 pr-8 sm:pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-normal sm:tracking-widest text-amber-300 font-mono bg-red-900/60 px-2 py-0.5 rounded-full border border-amber-400/40">
                {t("intelAlert")}
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>

            <h3 className="text-xs sm:text-base font-bold font-mono tracking-normal sm:tracking-wide leading-snug text-red-200 mt-1">
              {t("title")}
            </h3>

            <p className="text-[10px] sm:text-xs text-[#FFF3C7]/90 font-mono mt-1 sm:mt-0.5 leading-snug">
              {t("bodyBefore")}{" "}
              <span className="text-amber-300 font-semibold">{provinceName}</span>{t("bodyAfter")}
            </p>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-black/40 hover:bg-black/70 border border-[rgba(255,243,199,0.2)] text-[#FFF3C7]/70 hover:text-[#FFF3C7] flex items-center justify-center text-xs transition-colors cursor-pointer"
            title={t("minimize")}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setDismissed(false)}
          className="flex items-center gap-2 max-w-full px-3.5 py-2.5 sm:py-1.5 rounded-full bg-red-950/90 border border-amber-400/70 shadow-[0_4px_20px_rgba(255,50,0,0.35)] backdrop-blur-md text-amber-200 text-[10px] sm:text-xs font-mono font-bold hover:scale-105 transition-transform cursor-pointer"
        >
          <span className="animate-pulse">🚨</span>
          <span className="truncate">{t("suspectIn", { province: provinceName.toUpperCase() })}</span>
        </button>
      )}
    </div>
  );
}
