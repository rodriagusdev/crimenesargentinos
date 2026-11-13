"use client";

import LineupSuspect from "../LineupSuspect";
import SplashLogo from "../SplashLogo";
import type { SilhouetteVariant } from "../SuspectSilhouette";
import type { SplashSceneProps, SplashVariant } from "./types";

const SUSPECTS: { variant: SilhouetteVariant; heightPct: number }[] = [
  { variant: "cap", heightPct: 78 },
  { variant: "longhair", heightPct: 70 },
  { variant: "fedora", heightPct: 88 },
  { variant: "beret", heightPct: 74 },
  { variant: "fedora", heightPct: 82 },
];
const LIGHT_STAGGER_MS = 380;
const HEIGHT_MARKS = [200, 190, 180, 170, 160, 150];

// Pasos: 0 sala a oscuras · 1 los reflectores encienden uno por uno · 2 los sospechosos se apagan y aparece el logo
function LineupScene({ progress }: SplashSceneProps) {
  const lights = progress >= 1;
  const reveal = progress >= 2;

  return (
    <div className="absolute inset-0 bg-[#0b0e13]">
      {/* Pared con marcas de altura */}
      <div className="absolute inset-x-0 top-[8%] bottom-[22%] bg-[#232a33]">
        {HEIGHT_MARKS.map((cm, i) => (
          <div
            key={cm}
            className="absolute inset-x-0 border-t border-[#cfd6e0]/25"
            style={{ top: `${(i / HEIGHT_MARKS.length) * 100}%` }}
          >
            <span className="absolute left-2 -top-3 text-[7px] sm:text-[10px] text-[#cfd6e0]/45">{cm}</span>
          </div>
        ))}
      </div>
      {/* Piso */}
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-[#15191f] to-[#07090c]" />

      {/* Fila de sospechosos */}
      <div className="absolute inset-x-[4%] sm:inset-x-[10%] top-[8%] bottom-[22%] flex items-end gap-1 sm:gap-4">
        {SUSPECTS.map((s, i) => (
          <LineupSuspect
            key={i}
            variant={s.variant}
            number={i + 1}
            heightPct={s.heightPct}
            lit={lights}
            delayMs={reveal ? 0 : i * LIGHT_STAGGER_MS}
            dimmed={reveal}
          />
        ))}
      </div>

      {/* Vidrio espejado de la sala de observación */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.03] pointer-events-none" aria-hidden />

      <div
        className={`absolute inset-0 bg-[#05070a]/60 transition-opacity duration-700 ${reveal ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      />

      <div className="relative z-10 h-full flex items-center justify-center px-4 pb-24">
        <SplashLogo visible={reveal} className="w-[min(86vw,560px)]" />
      </div>
    </div>
  );
}

export const lineupSplash: SplashVariant = {
  id: "lineup",
  steps: () => [
    { ms: 700 },
    { ms: SUSPECTS.length * LIGHT_STAGGER_MS + 500, sfx: "click" },
    { ms: 1500, sfx: "opencasefile" },
  ],
  Scene: LineupScene,
};
