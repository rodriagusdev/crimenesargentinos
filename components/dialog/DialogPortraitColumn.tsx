"use client";

import Image from "next/image";
import { useT } from "@/hooks/useT";
import { dialogBoxMessages } from "./DialogBox.messages";

interface DialogPortraitColumnProps {
  npc: string;
  portraitUrl: string;
  avatar: string | null;
}

// Columna lateral: retrato y nombre del testigo, y abajo el retrato del detective
export default function DialogPortraitColumn({ npc, portraitUrl, avatar }: DialogPortraitColumnProps) {
  const t = useT(dialogBoxMessages);
  return (
    <div className="w-full sm:w-36 md:w-44 shrink-0 flex flex-row sm:flex-col items-center gap-3 sm:gap-0 py-2 sm:pt-4 md:pt-6 sm:pb-4 px-4 sm:px-3 md:px-4 border-b sm:border-b-0 sm:border-r border-[rgba(255,243,199,0.12)]">
      <div
        className="
          relative shrink-0 w-12 h-12 sm:w-24 sm:h-24 md:w-32 md:h-32
          rounded-xl sm:rounded-2xl overflow-hidden
          border-2 border-[rgba(255,243,199,0.25)]
          shadow-[0_12px_30px_rgba(0,0,0,0.7)]
          bg-black/40
        "
      >
        <Image
          src={portraitUrl}
          alt={npc}
          fill
          className="object-cover"
          sizes="128px"
          priority
        />
      </div>

      {/* NPC name */}
      <p className="min-w-0 sm:mt-3 md:mt-4 text-left sm:text-center tracking-widest text-[#E1C380] font-semibold uppercase text-xs md:text-sm">
        {npc}
      </p>

      {/* Decorative divider + label */}
      <div className="hidden sm:block mt-2 md:mt-3 w-8 md:w-10 h-px bg-[rgba(255,243,199,0.18)]" />
      <div className="ml-auto sm:ml-0 shrink-0 sm:mt-2 px-2.5 md:px-3 py-1 rounded-xl bg-[rgba(255,243,199,0.06)] backdrop-blur-xs border border-[rgba(255,243,199,0.12)] text-[10px] sm:text-[9px] md:text-[10px] text-[#E1C380]/80 uppercase tracking-widest font-mono">
        {t("witness")}
      </div>

      {/* Detective Interrogator Portrait at bottom of sidebar */}
      <div className="mt-auto pt-4 hidden sm:flex [@media(orientation:landscape)_and_(max-height:500px)]:hidden flex-col items-center w-full border-t border-[rgba(255,243,199,0.12)]">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-[0_12px_30px_rgba(0,0,0,0.7)] bg-black/40 flex items-center justify-center">
          {avatar ? (
            <Image
              src={avatar}
              alt={t("detective")}
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <span className="text-3xl md:text-4xl text-amber-300/60">👤</span>
          )}
        </div>
        <p className="mt-2 text-center tracking-widest text-[#E1C380] font-semibold uppercase text-xs md:text-sm font-mono">
          {t("detective")}
        </p>
      </div>
    </div>
  );
}
