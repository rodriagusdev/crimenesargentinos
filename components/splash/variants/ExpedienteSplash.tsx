"use client";

import CaseFolder from "../CaseFolder";
import SplashAtmosphere from "../SplashAtmosphere";
import { typingDuration, useTypewriter } from "@/hooks/useTypewriter";
import type { SplashSceneProps, SplashVariant } from "./types";

const CASE_LABEL = "EXPTE. N° 0001 — REP. ARGENTINA";

// Pasos: 0 oscuridad · 1 lámpara · 2 etiqueta a máquina · 3 se abre la carpeta
function ExpedienteScene({ progress }: SplashSceneProps) {
  const label = useTypewriter(CASE_LABEL, progress === 2, progress > 2);

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
  steps: () => [
    { ms: 1100 },
    { ms: 900, sfx: "click" },
    { ms: typingDuration(CASE_LABEL) },
    { ms: 1500, sfx: "opencasefile" },
  ],
  Scene: ExpedienteScene,
};
