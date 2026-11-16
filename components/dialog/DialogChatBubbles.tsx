"use client";

import Image from "next/image";
import { useT } from "@/hooks/useT";
import { dialogBoxMessages } from "./DialogBox.messages";

// Acotación del narrador, centrada
export function NarratorLine({ text }: { text: string }) {
  return (
    <div className="flex justify-center my-1">
      <div className="px-3.5 py-1.5 rounded-xl bg-[rgba(225,195,128,0.08)] border border-[rgba(225,195,128,0.18)] backdrop-blur-xs shadow-sm">
        <p className="text-[11px] italic text-[#E1C380]/90 tracking-wide text-center">
          * {text} *
        </p>
      </div>
    </div>
  );
}

// Línea del jugador, alineada a la derecha con su avatar
export function PlayerBubble({ text, avatar }: { text: string; avatar: string | null }) {
  const t = useT(dialogBoxMessages);
  return (
    <div className="flex items-start justify-end gap-2.5 sm:gap-3">
      <div className="flex flex-col items-end gap-1 max-w-[80%] sm:max-w-[85%]">
        <span className="text-[10px] tracking-widest text-[#FFF3C7]/70 font-mono font-semibold">
          {t("you")}
        </span>
        <div className="bg-[rgba(28,42,58,0.7)] backdrop-blur-xs border border-[rgba(255,243,199,0.22)] shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-2xl rounded-tr-none px-4 py-2.5">
          <p className="text-[#E1C380]/90 text-xs leading-relaxed">
            {text}
          </p>
        </div>
      </div>
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-amber-400/60 bg-gradient-to-b from-[#1b2536] to-[#0e1724] shadow-md flex items-center justify-center shrink-0 mt-2">
        {avatar ? (
          <Image
            src={avatar}
            alt={t("you")}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <span className="text-xl text-amber-300/70">👤</span>
        )}
      </div>
    </div>
  );
}

// Línea del testigo, alineada a la izquierda. `nameClassName` conserva el estilo distinto del nombre en intro vs. chat
export function NpcBubble({ npc, text, nameClassName }: { npc: string; text: string; nameClassName: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={nameClassName}>
        {npc}
      </span>
      <div className="bg-[rgba(20,30,42,0.6)] backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-2xl rounded-tl-none px-4 py-3 max-w-[90%]">
        <p className="text-[#FFF3C7] text-xs leading-relaxed whitespace-pre-line">
          {text}
        </p>
      </div>
    </div>
  );
}
