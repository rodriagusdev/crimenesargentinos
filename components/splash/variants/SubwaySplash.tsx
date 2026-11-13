"use client";

import SplashLogo from "../SplashLogo";
import SubwayStation from "../SubwayStation";
import { subwaySplashMessages } from "./SubwaySplash.messages";
import type { SplashSceneProps, SplashVariant } from "./types";
import { useT } from "@/hooks/useT";

const STATIONS = ["station1", "station2", "station3", "station4", "station5"] as const;
const RIDE_MS = 2400;
const LINE_START = 4;
const LINE_END = 96;

const stationPct = (i: number) => LINE_START + ((LINE_END - LINE_START) * i) / (STATIONS.length - 1);

// Pasos: 0 se traza la línea · 1 el tren recorre las estaciones · 2 llega a la Central y aparece el logo
function SubwayScene({ progress }: SplashSceneProps) {
  const t = useT(subwaySplashMessages);
  const drawn = progress >= 1;
  const riding = progress === 1;
  const arrived = progress >= 2;

  return (
    <div className="absolute inset-0 bg-[#0c0f14]">
      {/* Azulejos del andén */}
      <div
        className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(#cfd6e0_1px,transparent_1px),linear-gradient(90deg,#cfd6e0_1px,transparent_1px)] bg-[length:48px_24px]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(255,220,150,0.12),transparent_75%)]" aria-hidden />

      <div className="relative z-10 h-full flex flex-col items-center justify-center gap-8 sm:gap-12 px-4 pb-24">
        <SplashLogo visible={arrived} className="w-[min(70vw,400px)]" />

        {/* Cartel enlozado del andén */}
        <div className="w-[min(94vw,980px)] rounded-lg border-4 border-[#e8e3d3] bg-[#123a6b] px-3 sm:px-8 pt-3 pb-16 sm:pb-14 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          <div className="flex justify-between text-[7px] sm:text-xs tracking-widest text-[#e8e3d3]">
            <span>{t("line")}</span>
            <span>{t("direction")}</span>
          </div>

          <div className="relative mt-8 h-8">
            {/* Vía */}
            <div
              className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#e8b100] origin-left transition-transform duration-700 ease-out ${
                drawn ? "scale-x-100" : "scale-x-0"
              }`}
              style={{ left: `${LINE_START}%`, right: `${100 - LINE_END}%` }}
            />

            {STATIONS.map((station, i) => (
              <SubwayStation
                key={station}
                label={t(station)}
                leftPct={stationPct(i)}
                lit={riding || arrived}
                delayMs={riding ? (RIDE_MS * i) / (STATIONS.length - 1) : 0}
                terminal={i === STATIONS.length - 1}
              />
            ))}

            {/* Tren */}
            <div
              className={`absolute -top-5 -translate-x-1/2 ease-in-out ${riding ? "transition-[left]" : ""} ${drawn ? "opacity-100" : "opacity-0"}`}
              style={{ left: `${riding || arrived ? LINE_END : LINE_START}%`, transitionDuration: `${RIDE_MS}ms` }}
              aria-hidden
            >
              <div className="relative flex gap-[3px] px-1.5 py-1 rounded-t-md rounded-b-sm bg-[#d93a2b] shadow-[0_0_14px_rgba(255,200,120,0.6)]">
                {[0, 1, 2].map((w) => (
                  <span key={w} className="block w-2 h-2 sm:w-3 sm:h-2.5 bg-[#fff3c7]" />
                ))}
                <span className="absolute -right-1 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#fff3c7] shadow-[0_0_8px_#fff3c7]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const subwaySplash: SplashVariant = {
  id: "subway",
  steps: () => [
    { ms: 900, sfx: "swoosh" },
    { ms: RIDE_MS + 300, sfx: "slide" },
    { ms: 1400, sfx: "opencasefile" },
  ],
  Scene: SubwayScene,
};
