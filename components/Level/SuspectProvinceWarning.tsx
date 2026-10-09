"use client";

import { useEffect, useState, useMemo } from "react";
import { useAudioStore } from "@/stores/useAudioStore";

interface SuspectProvinceWarningProps {
  levelId: number;
  provinceId: string;
  provinceName: string;
}

interface CaseSuspectLocation {
  provinceId: string;
  provinceName: string;
  criminalLocationId: string;
  criminalLocationName: string;
}

// Hardcoded case criminal hideout provinces matching backend seed migrations
export const CASE_SUSPECT_LOCATIONS: Record<number, CaseSuspectLocation> = {
  1: {
    provinceId: "6e2e014c-d8f2-49aa-bf12-2474c05210bb",
    provinceName: "Misiones",
    criminalLocationId: "e7e724ae-895e-44f3-929d-625fe969ce04",
    criminalLocationName: "Playas el Brete y Costa Sur",
  },
  2: {
    provinceId: "f4c6f97c-6985-45eb-8711-ae6aeec6577d",
    provinceName: "Chaco",
    criminalLocationId: "7c8cec43-f744-4942-af42-7a489df7e5c3",
    criminalLocationName: "Parque Nacional el Impenetrable",
  },
  3: {
    provinceId: "b2438304-f80c-47df-b4c4-dd4c39b6785a",
    provinceName: "Salta",
    criminalLocationId: "fa554843-cea3-4e66-93d1-9d74e17d2379",
    criminalLocationName: "Iruya",
  },
  4: {
    provinceId: "3cabc223-3475-495d-aa2f-434e6a8b82c4",
    provinceName: "Neuquén",
    criminalLocationId: "7efd6f97-5cf3-4f1e-a404-08f8115e918e",
    criminalLocationName: "Villa La Angostura",
  },
  5: {
    provinceId: "279af790-afcb-4db0-96ca-442ac67f786f",
    provinceName: "Santa Fe",
    criminalLocationId: "c3e70ad5-ac42-4f48-9d1a-cb4e8a2894f2",
    criminalLocationName: "Rambla Catalunya",
  },
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function SuspectProvinceWarning({
  levelId,
  provinceId,
  provinceName,
}: SuspectProvinceWarningProps) {
  const playSfx = useAudioStore((state) => state.playSfx);

  const [dismissed, setDismissed] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  // Check if current province is where the suspect is located for this case/level
  const isSuspectInThisProvince = useMemo(() => {
    const target = CASE_SUSPECT_LOCATIONS[levelId];
    if (!target) return false;

    const matchId = target.provinceId.toLowerCase() === provinceId.toLowerCase();
    const matchName =
      target.provinceName.toLowerCase() === provinceName.toLowerCase() ||
      normalize(target.provinceName) === normalize(provinceName);

    return matchId || matchName;
  }, [levelId, provinceId, provinceName]);

  // Reset dismissal when navigating to another province
  useEffect(() => {
    setDismissed(false);
    setHasPlayedSound(false);
  }, [provinceId]);

  // Play warning sound when entering the suspect's province
  useEffect(() => {
    if (isSuspectInThisProvince && !hasPlayedSound) {
      playSfx("warning");
      setHasPlayedSound(true);
    }
  }, [isSuspectInThisProvince, hasPlayedSound, playSfx]);

  if (!isSuspectInThisProvince) {
    return null;
  }

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-auto pointer-events-auto select-none animate-bounce-short">
      {!dismissed ? (
        <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/95 via-amber-950/90 to-red-950/95 border-2 border-amber-400/80 shadow-[0_10px_35px_rgba(255,100,0,0.45)] backdrop-blur-md text-[#FFF3C7] flex items-start gap-3.5 ring-4 ring-red-500/20">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-red-600/30 border border-red-400 flex items-center justify-center text-2xl shadow-inner animate-pulse">
            🚨
          </div>

          <div className="flex flex-col pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 font-mono bg-red-900/60 px-2 py-0.5 rounded-full border border-amber-400/40">
                Alerta de Inteligencia
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>

            <h3 className="text-sm sm:text-base font-bold font-mono tracking-wide text-red-200 mt-1">
              ¡EL SOSPECHOSO PODRÍA ESTAR AQUÍ!
            </h3>

            <p className="text-xs text-[#FFF3C7]/90 font-mono mt-0.5 leading-snug">
              Los informes de inteligencia indican que el sospechoso se encuentra en{" "}
              <span className="text-amber-300 font-semibold">{provinceName}</span>. ¡Inspeccioná los lugares con cautela!
            </p>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 border border-[rgba(255,243,199,0.2)] text-[#FFF3C7]/70 hover:text-[#FFF3C7] flex items-center justify-center text-xs transition-colors cursor-pointer"
            title="Minimizar alerta"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setDismissed(false)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/90 border border-amber-400/70 shadow-[0_4px_20px_rgba(255,50,0,0.35)] backdrop-blur-md text-amber-200 text-xs font-mono font-bold hover:scale-105 transition-transform cursor-pointer"
        >
          <span className="animate-pulse">🚨</span>
          <span>SOSPECHOSO EN {provinceName.toUpperCase()}</span>
        </button>
      )}
    </div>
  );
}
