"use client";

import Image from "next/image";
import MapPin from "../MapPin";
import SplashLogo from "../SplashLogo";
import { getCalibratedProvinceCoordinates, TACTICAL_MONITOR_BOUNDS } from "@/lib/mapCalibration";
import type { SplashSceneProps, SplashVariant } from "./types";

const PROVINCES = ["jujuy", "misiones", "cordoba", "mendoza", "buenos aires", "neuquen", "santa cruz", "tierra del fuego"];
const PIN_STAGGER_MS = 200;

// Coordenadas del pin pasadas de "relativas al monitor" a "relativas a la imagen completa de la sala"
const PINS = PROVINCES.map((name) => {
  const { top, left } = getCalibratedProvinceCoordinates({ name });
  const b = TACTICAL_MONITOR_BOUNDS;
  return {
    name,
    left: b.leftPct + (b.widthPct * parseFloat(left)) / 100,
    top: b.topPct + (b.heightPct * parseFloat(top)) / 100,
  };
});

const STRING_PATH = PINS.map((p, i) => `${i === 0 ? "M" : "L"}${p.left.toFixed(2)} ${p.top.toFixed(2)}`).join(" ");

// Pasos: 0 se prende la sala · 1 se marcan las provincias con pines e hilo rojo · 2 zoom al monitor y aparece el logo
function MapScene({ progress }: SplashSceneProps) {
  const lit = progress >= 1; // sala prendida y pines marcados
  const reveal = progress >= 2;

  return (
    <div className="absolute inset-0 bg-[#03060c]">
      {/* Sala táctica con la misma proporción de la imagen para que los pines caigan en su provincia */}
      <div
        className={`absolute left-1/2 top-1/2 w-[max(100vw,179.35vh)] aspect-[1155/644] -translate-x-1/2 -translate-y-1/2 transition-all duration-[1400ms] ease-out ${
          reveal ? "scale-[1.18] blur-[2px]" : "scale-100"
        } ${lit ? "brightness-75" : "brightness-[0.15]"}`}
      >
        <Image src="/images/test_composite.webp" alt="" fill priority sizes="180vw" className="object-cover" />

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
          {lit && (
            <path
              d={STRING_PATH}
              pathLength={1}
              className="splash-map-string"
              fill="none"
              stroke="#e02424"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {PINS.map((pin, i) => (
          <MapPin
            key={pin.name}
            left={pin.left}
            top={pin.top}
            label={pin.name.toUpperCase()}
            delayMs={i * PIN_STAGGER_MS}
            visible={lit}
          />
        ))}
      </div>

      {/* Alerta nacional */}
      <div
        className={`absolute top-4 inset-x-0 text-center text-[9px] sm:text-sm tracking-[0.3em] text-red-400 [text-shadow:0_0_10px_rgba(255,60,60,0.7)] transition-opacity duration-500 ${
          lit && !reveal ? "splash-rec opacity-100" : "opacity-0"
        }`}
      >
        ⚠ ALERTA NACIONAL · BANDA EN FUGA ⚠
      </div>

      <div
        className={`absolute inset-0 bg-[#03060c]/70 transition-opacity duration-700 ${reveal ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      />

      <div className="relative z-10 h-full flex items-center justify-center px-4 pb-24">
        <SplashLogo visible={reveal} className="w-[min(86vw,560px)]" />
      </div>
    </div>
  );
}

export const mapSplash: SplashVariant = {
  id: "map",
  steps: () => [
    { ms: 1000, sfx: "click" },
    { ms: PROVINCES.length * PIN_STAGGER_MS + 600, sfx: "mechanickey" },
    { ms: 1500, sfx: "opencasefile" },
  ],
  Scene: MapScene,
};
