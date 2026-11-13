"use client";

import type { CSSProperties } from "react";
import ConventilloHouse, { Conventillo } from "../ConventilloHouse";
import SplashLogo from "../SplashLogo";
import WantedPoster from "../WantedPoster";
import type { SilhouetteVariant } from "../SuspectSilhouette";
import type { SplashSceneProps, SplashVariant } from "./types";

const HOUSES: Conventillo[] = [
  { color: "#b8322a", trim: "#e8b100", heightPct: 70, widthPct: 18, windows: 3 },
  { color: "#2f6fb3", trim: "#f1ece2", heightPct: 82, widthPct: 16, windows: 2 },
  { color: "#d9a520", trim: "#2f8f4e", heightPct: 64, widthPct: 20, windows: 3 },
  { color: "#2f8f4e", trim: "#b8322a", heightPct: 76, widthPct: 15, windows: 2 },
  { color: "#c4562b", trim: "#2f6fb3", heightPct: 68, widthPct: 17, windows: 3 },
  { color: "#3f4fa0", trim: "#d9a520", heightPct: 80, widthPct: 14, windows: 2 },
];

const POSTERS: { variant: SilhouetteVariant; reward: string; left: string; rotate: number }[] = [
  { variant: "cap", reward: "$ 50.000", left: "12%", rotate: -5 },
  { variant: "fedora", reward: "$ 100.000", left: "58%", rotate: 4 },
  { variant: "beret", reward: "$ 30.000", left: "80%", rotate: -3 },
];
const FLYING = 1; // el afiche que arranca el viento

const WALK_MS = 2600;
const LAMP_LEFT = "42%";

// Pasos: 0 calle bajo la lluvia · 1 cruza una silueta bajo el farol · 2 ráfaga: un afiche vuela a la cámara · 3 logo
function LaBocaScene({ progress }: SplashSceneProps) {
  const walking = progress === 1;
  const gust = progress >= 2;
  const reveal = progress >= 3;

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#070b18] via-[#0e1426] to-[#151a26]">
      <div className="absolute top-[8%] right-[12%] size-14 rounded-full bg-[#dfe6f5]/20 blur-[2px]" aria-hidden />

      {/* Fila de conventillos */}
      <div className="absolute inset-x-0 bottom-[24%] h-[62%] flex items-end justify-center" aria-hidden>
        {HOUSES.map((house) => (
          <ConventilloHouse key={house.color} house={house} lit />
        ))}
      </div>

      {/* Afiches pegados en la pared */}
      <div className="absolute inset-x-0 bottom-[30%] h-[18%]" aria-hidden>
        {POSTERS.map((p, i) => {
          const flying = i === FLYING && gust;
          const style: CSSProperties = { left: p.left, "--rot": `${p.rotate}deg` } as CSSProperties;
          return (
            <WantedPoster
              key={p.reward}
              variant={p.variant}
              reward={p.reward}
              style={style}
              className={`absolute bottom-0 ${flying ? "splash-poster-fly" : gust ? "splash-poster-flutter--hard" : "splash-poster-flutter"}`}
            />
          );
        })}
      </div>

      {/* Vereda de adoquines */}
      <div
        className="absolute inset-x-0 bottom-0 h-[24%] bg-[#12151b] bg-[radial-gradient(ellipse_at_center,#262b34_0_40%,transparent_45%)] bg-[length:22px_12px]"
        aria-hidden
      />

      {/* Farol a gas y su charco de luz */}
      <div className="absolute bottom-[24%] w-2 h-[46%] -translate-x-1/2 bg-[#0a0c10]" style={{ left: LAMP_LEFT }} aria-hidden>
        <div className="splash-gaslamp absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-7 rounded-t-md border-2 border-[#0a0c10] bg-[#ffd27a] shadow-[0_0_40px_14px_rgba(255,200,110,0.45)]" />
      </div>
      <div
        className="splash-gaslamp absolute bottom-0 h-[50%] w-[40%] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,rgba(255,200,110,0.30),transparent_70%)]"
        style={{ left: LAMP_LEFT }}
        aria-hidden
      />

      {/* Silueta con piloto y sombrero */}
      {progress >= 1 && (
        <div
          className={`absolute bottom-[14%] h-[34%] aspect-[1/2.4] ${walking ? "splash-walker" : "opacity-0"}`}
          style={{ animationDuration: `${WALK_MS}ms` }}
          aria-hidden
        >
          <svg viewBox="0 0 40 96" className="splash-walker-bob size-full">
            <g fill="#05070b">
              <path d="M8 22h24l-3-3h-2l-2-9q-5-3-10 0l-2 9h-2z" />
              <ellipse cx="20" cy="26" rx="6" ry="7" />
              <path d="M10 34q10-4 20 0l4 34-4 2-2-4H12l-2 4-4-2z" />
              <path d="M13 70h5l-1 24h-5zM22 70h5l2 24h-5z" />
            </g>
          </svg>
          <div className="absolute -bottom-1 left-1/2 w-[260%] h-3 -translate-x-1/2 rounded-[50%] bg-black/60 blur-[2px]" />
        </div>
      )}

      <div className="splash-rain absolute inset-0" aria-hidden />

      <div
        className={`absolute inset-0 bg-[#05070d]/65 transition-opacity duration-700 ${reveal ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      />
      <div className="relative z-10 h-full flex items-center justify-center px-4 pb-24">
        <SplashLogo visible={reveal} className="w-[min(86vw,560px)]" />
      </div>
    </div>
  );
}

export const laBocaSplash: SplashVariant = {
  id: "laboca",
  steps: () => [
    { ms: 1000 },
    { ms: WALK_MS },
    { ms: 1100, sfx: "swoosh" },
    { ms: 1400, sfx: "opencasefile" },
  ],
  Scene: LaBocaScene,
};
