"use client";

import CaseFolder from "../CaseFolder";
import SplashAtmosphere from "../SplashAtmosphere";
import { typingDuration, useTypewriter } from "@/hooks/useTypewriter";
import type { Locale } from "@/lib/i18n/locale";
import { defineMessages } from "@/lib/i18n/messages";
import { useLocale } from "@/stores/useLocaleStore";
import type { SplashSceneProps, SplashVariant } from "./types";

// Etiqueta tipeada a máquina: el paso dura lo que tarda en escribirse en el idioma del jugador
const messages = defineMessages({
  es: { caseLabel: "EXPTE. N° 0001 — REP. ARGENTINA" },
  en: { caseLabel: "CASE FILE #0001 — ARGENTINE REP." },
});
const caseLabel = (locale: Locale) => messages[locale].caseLabel;

// Pasos: 0 oscuridad · 1 lámpara · 2 etiqueta a máquina · 3 se abre la carpeta
function ExpedienteScene({ progress }: SplashSceneProps) {
  const label = useTypewriter(caseLabel(useLocale()), progress === 2, progress > 2);

  return (
    <>
      <SplashAtmosphere lampOn={progress >= 1} />
      <div className="relative z-10 h-full flex items-center justify-center px-4 pb-24">
        <CaseFolder visible={progress >= 1} open={progress >= 3} label={label} typing={progress === 2} />
      </div>
    </>
  );
}

export const expedienteSplash: SplashVariant = {
  id: "expediente",
  steps: (_agentName, locale) => [
    { ms: 1100 },
    { ms: 900, sfx: "click" },
    { ms: typingDuration(caseLabel(locale)) },
    { ms: 1500, sfx: "opencasefile" },
  ],
  Scene: ExpedienteScene,
};
