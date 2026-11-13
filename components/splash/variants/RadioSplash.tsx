"use client";

import SplashLogo from "../SplashLogo";
import { typingDuration, useTypewriter } from "@/hooks/useTypewriter";
import type { SplashSceneProps, SplashVariant } from "./types";

const radioMessage = (agentName: string) =>
  `CENTRAL A AGENTE ${agentName}: GOLPES EN VARIAS PROVINCIAS. PRESÉNTESE DE INMEDIATO. CAMBIO.`;

// Onda senoidal de dos períodos (se desplaza en loop)
const WAVE = Array.from({ length: 81 }, (_, i) => {
  const x = i * 5;
  const y = 30 + Math.sin((i / 40) * Math.PI * 4) * 18;
  return `${i === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`;
}).join(" ");

// Pasos: 0 estática buscando frecuencia · 1 transmisión escrita · 2 el logo emerge de la interferencia
function RadioScene({ progress, agentName }: SplashSceneProps) {
  const transmitting = progress === 1;
  const message = useTypewriter(radioMessage(agentName), transmitting, progress > 1);
  const tuned = progress >= 1;

  return (
    <div className="absolute inset-0 bg-[#030805]">
      <div className="splash-static absolute inset-0 opacity-[0.12]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(60,255,140,0.10),transparent_70%)]" aria-hidden />

      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-6 px-4 pb-24">
        <SplashLogo visible={progress >= 2} className={`w-[min(70vw,360px)] ${progress >= 2 ? "splash-glitch" : ""}`} />

        {/* Equipo de radio */}
        <div className="w-[min(92vw,720px)] rounded-2xl border-4 border-[#1b2a20] bg-[#07130c] p-4 sm:p-6 shadow-[0_0_40px_rgba(60,255,140,0.12),inset_0_0_30px_rgba(0,0,0,0.9)] text-[#5dff9d] [text-shadow:0_0_8px_rgba(93,255,157,0.6)]">
          <div className="flex justify-between text-[8px] sm:text-[11px] tracking-widest">
            <span>FREC. {tuned ? "147.30" : "---.--"} MHz</span>
            <span>
              <span className={transmitting ? "splash-rec text-red-500" : "text-[#5dff9d]/30"}>●</span> TX CENTRAL
            </span>
          </div>

          {/* Dial de sintonía */}
          <div className="relative mt-3 h-4 border-y border-[#5dff9d]/30 bg-[repeating-linear-gradient(90deg,rgba(93,255,157,0.35)_0_1px,transparent_1px_12px)]">
            <span
              className={`absolute top-[-4px] bottom-[-4px] w-[2px] bg-red-500 shadow-[0_0_6px_red] ${
                tuned ? "splash-dial--tuned" : "splash-dial--search"
              }`}
            />
          </div>

          {/* Osciloscopio */}
          <div className="relative mt-4 h-14 sm:h-16 overflow-hidden border border-[#5dff9d]/20">
            <svg
              viewBox="0 0 400 60"
              preserveAspectRatio="none"
              className={`splash-wave absolute inset-y-0 left-0 h-full w-[200%] ${transmitting ? "splash-wave--talk" : ""}`}
              aria-hidden
            >
              <path d={WAVE} fill="none" stroke="#5dff9d" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          {/* Transcripción */}
          <p className="mt-4 min-h-[4.5em] text-[9px] sm:text-sm leading-relaxed">
            {tuned ? message : "BUSCANDO FRECUENCIA..."}
            {transmitting && <span className="splash-caret">▌</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

export const radioSplash: SplashVariant = {
  id: "radio",
  steps: (agentName) => [
    { ms: 1100, sfx: "radio" },
    { ms: typingDuration(radioMessage(agentName), 500) },
    { ms: 1500, sfx: "hint" },
  ],
  Scene: RadioScene,
};
