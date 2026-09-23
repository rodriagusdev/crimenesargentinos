"use client";

import Image from "next/image";
import { useState } from "react";
import IDialog from "@/models/IDialog";
import GameButton from "../buttons/GameButton";
import CaseBriefingModal from "./CaseBriefingModal";

interface LocationIntroProps {
  levelId?: number;
  dialog: IDialog;
  locationName?: string;
  onAdvance: () => void;
  onBack?: () => void;
}

export default function LocationIntro({
  levelId = 1,
  dialog,
  locationName,
  onAdvance,
  onBack,
}: LocationIntroProps) {
  const [showBriefing, setShowBriefing] = useState<boolean>(true);

  const imageUrl =
    dialog.overlayBackgroundUrl ?? "/images/test_map.jpg";

  return (
    <div className="fixed inset-0 z-30 flex flex-col justify-between overflow-hidden bg-black select-none">
      {/* Modal de Información del Caso / Máquina de escribir */}
      {showBriefing && (
        <CaseBriefingModal
          levelId={levelId}
          onClose={() => setShowBriefing(false)}
        />
      )}

      {/* ── Background full-screen image ── */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={imageUrl}
          alt={locationName ?? "Ubicación"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080e18]/90 via-[#080e18]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080e18]/50 via-transparent to-[#080e18]/60" />
      </div>

      {/* ── Top Bar: GameButtons (Top Left) ── */}
      <div className="relative z-40 p-6 flex items-center justify-between flex-row-reverse">
        <div className="flex items-center gap-2">
          {onBack && (

            <GameButton
              icon=""
              label="VOLVER"
              onClick={onBack}
              variant="secondary"
            />
          )}

          <GameButton
            icon=""
            label="AVANZAR AL INTERROGATORIO"
            onClick={onAdvance}
            variant="primary"
          />
        </div>

        {/* Badge Escena del Crimen */}
        <div className="hidden sm:flex absolute top-28 left-6 items-center gap-2 p-4 rounded-2xl backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-[#FFF3C7]">
          <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest text-[#E1C380] font-semibold">
            Escena del Crimen
          </span>
        </div>
      </div>

      {/* ── Bottom Description Card ── */}
      <div className="relative z-40 p-6 md:p-8 w-full">
        <div
          className="
            p-6 rounded-2xl
            backdrop-blur-xs
            border border-[rgba(255,243,199,0.18)]
            shadow-[0_20px_50px_rgba(0,0,0,0.6)]
            text-[#FFF3C7]
            flex flex-col gap-3
            animate-fade-in
          "
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📍</span>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#E1C380]/80 font-mono">
                Lugar
              </span>
              {locationName && (
                <h2 className="text-lg md:text-xl font-bold text-[#FFF3C7]">
                  {locationName}
                </h2>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-[rgba(255,243,199,0.12)] my-1" />

          <p className="text-xs md:text-sm text-[#FFF3C7]/90 leading-relaxed max-h-[40vh] overflow-y-auto pr-1">
            {dialog.infoBackground}
          </p>
        </div>
      </div>
    </div>
  );
}
