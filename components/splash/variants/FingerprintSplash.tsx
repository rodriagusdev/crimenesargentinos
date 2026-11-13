"use client";

import MugshotFrame from "../MugshotFrame";
import SplashLogo from "../SplashLogo";
import SuspectSilhouette from "../SuspectSilhouette";
import type { SplashSceneProps, SplashVariant } from "./types";

// Ojo: acá NO van sospechosos. Cada sospechoso es culpable en algún caso, así que mostrar su cara como
// "coincidencia" sería un spoiler. La ruleta usa testigos/NPCs y el resultado queda clasificado.
const P = "/images/portraits";
const ROULETTE = [
  `${P}/level1/portrait_curaantonio.webp`,
  `${P}/level2/cara_gaucho.webp`,
  `${P}/level3/cara_borracho.webp`,
  `${P}/level1/portrait_meserotiziano.webp`,
  `${P}/level2/cara_grafitero.webp`,
  `${P}/level3/cara_chileno.webp`,
  `${P}/level1/portrait_pescadordonjuan.webp`,
  `${P}/level2/cara_preso.webp`,
  `${P}/level1/portrait_jardinerocarlitos.webp`,
  `${P}/level2/cara_mapuche.webp`,
];

// Crestas de la huella: elipses concéntricas cortadas a distintos ritmos para que parezcan naturales
const RIDGES = Array.from({ length: 14 }, (_, k) => ({
  rx: 5 + k * 2.7,
  ry: 7 + k * 3.3,
  dash: `${18 + k * 4} ${3 + (k % 3)} ${9 + k * 2} ${2 + (k % 2) * 3}`,
  rot: (k % 4) * 23,
}));

// Pasos: 0 escaneo de la huella · 1 ruleta de registros · 2 coincidencia · 3 aparece el logo
function FingerprintScene({ progress }: SplashSceneProps) {
  const scanning = progress === 0;
  const searching = progress === 1;
  const matched = progress >= 2;
  const reveal = progress >= 3;

  return (
    <div className="absolute inset-0 bg-[#020a07]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(60,255,160,0.10),transparent_70%)]" aria-hidden />

      <div
        className={`relative z-10 h-full flex items-center justify-center px-4 pb-24 transition-all duration-700 ${
          reveal ? "opacity-25 scale-95 blur-[2px]" : "opacity-100"
        }`}
      >
        <div className="w-[min(94vw,820px)] grid grid-cols-2 gap-3 sm:gap-6 rounded-xl border-2 border-[#1d3b2c] bg-[#04120b]/90 p-3 sm:p-6 text-[#62ffa8] [text-shadow:0_0_8px_rgba(98,255,168,0.5)] shadow-[0_0_40px_rgba(60,255,160,0.10)]">
          <p className="col-span-2 flex justify-between text-[7px] sm:text-[11px] tracking-widest">
            <span>LAB. FORENSE · DACTILOSCOPIA</span>
            <span>MUESTRA #A-0314</span>
          </p>

          {/* Huella escaneada */}
          <div className="relative aspect-[4/5] rounded-md border border-[#62ffa8]/30 bg-[#020a07] overflow-hidden">
            <svg viewBox="0 0 100 110" className={`absolute inset-0 size-full ${scanning ? "splash-print-reveal" : ""}`} aria-hidden>
              <defs>
                <clipPath id="splash-finger">
                  <ellipse cx="50" cy="56" rx="36" ry="46" />
                </clipPath>
              </defs>
              <g clipPath="url(#splash-finger)" fill="none" stroke="#62ffa8" strokeWidth="1.4" strokeLinecap="round">
                {RIDGES.map((r, i) => (
                  <ellipse
                    key={i}
                    cx="50"
                    cy="58"
                    rx={r.rx}
                    ry={r.ry}
                    strokeDasharray={r.dash}
                    transform={`rotate(${r.rot} 50 58)`}
                  />
                ))}
              </g>
            </svg>
            {scanning && <div className="splash-scan-bar absolute inset-x-0 h-1 bg-[#b8ffd6] shadow-[0_0_18px_6px_rgba(98,255,168,0.6)]" />}
          </div>

          {/* Ruleta de sospechosos */}
          <div className="flex flex-col gap-2">
            <div className={`relative aspect-square overflow-hidden rounded-md border-2 ${matched ? "border-red-500 splash-match" : "border-[#62ffa8]/30"}`}>
              {matched ? (
                <SuspectSilhouette variant="fedora" />
              ) : (
                <div className={progress >= 1 ? "splash-roulette" : ""}>
                  {ROULETTE.map((src) => (
                    <MugshotFrame key={src} src={src} />
                  ))}
                </div>
              )}
              {!matched && <div className="absolute inset-0 bg-[#62ffa8]/15 mix-blend-color" />}
            </div>

            <div className="text-[6px] sm:text-[10px] leading-relaxed tracking-wider">
              {matched ? (
                <>
                  <p className="text-red-400 [text-shadow:0_0_8px_rgba(255,60,60,0.7)]">■ COINCIDENCIA 100%</p>
                  <p>IDENTIDAD: CLASIFICADA</p>
                  <p>ESTADO: PRÓFUGO</p>
                </>
              ) : (
                <>
                  <p className={searching ? "splash-rec" : ""}>{searching ? "COMPARANDO 12.408 REGISTROS..." : "ESCANEANDO MUESTRA..."}</p>
                  <div className="mt-1 h-1.5 bg-[#62ffa8]/15">
                    <div className={`h-full bg-[#62ffa8] ${searching ? "splash-progress" : "w-0"}`} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 pb-24 pointer-events-none">
        <SplashLogo visible={reveal} className="w-[min(86vw,560px)]" />
      </div>
    </div>
  );
}

export const fingerprintSplash: SplashVariant = {
  id: "fingerprint",
  steps: () => [
    { ms: 1400, sfx: "click" },
    { ms: 2000, sfx: "mechanickey" },
    { ms: 1000, sfx: "hint" },
    { ms: 1400, sfx: "opencasefile" },
  ],
  Scene: FingerprintScene,
};
