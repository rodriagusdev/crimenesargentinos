"use client";

import type { CSSProperties } from "react";
import SuspectSilhouette, { SilhouetteVariant } from "./SuspectSilhouette";

type LineupSuspectProps = {
  variant: SilhouetteVariant;
  number: number;
  heightPct: number; // altura relativa de la figura (para que no sean todos iguales)
  lit: boolean;
  delayMs: number;
  dimmed: boolean;
};

// Sospechoso en la rueda de reconocimiento: se ilumina con un reflector y lleva su número
export default function LineupSuspect({ variant, number, heightPct, lit, delayMs, dimmed }: LineupSuspectProps) {
  const delay: CSSProperties = { transitionDelay: `${delayMs}ms` };

  return (
    <div className={`relative flex-1 h-full flex flex-col justify-end items-center transition-opacity duration-700 ${dimmed ? "opacity-30" : "opacity-100"}`}>
      {/* Reflector cenital */}
      <div
        style={delay}
        className={`absolute inset-x-[-20%] top-0 bottom-0 [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)] bg-gradient-to-b from-[#fff4d6]/45 via-[#fff4d6]/12 to-transparent transition-opacity duration-150 ${
          lit ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />

      <div
        style={{ ...delay, height: `${heightPct}%` }}
        className={`relative w-full transition-[filter] duration-150 ${lit ? "brightness-100" : "brightness-[0.35]"}`}
      >
        <div className="absolute inset-x-0 bottom-0 aspect-square max-h-full mx-auto">
          <SuspectSilhouette variant={variant} backdrop={false} />
        </div>
      </div>

      {/* Cartel con el número */}
      <span
        style={delay}
        className={`relative mt-1 px-2 py-1 bg-[#f4efe2] text-[#1b1813] text-[9px] sm:text-sm transition-opacity duration-150 ${
          lit ? "opacity-100" : "opacity-40"
        }`}
      >
        {number}
      </span>
    </div>
  );
}
