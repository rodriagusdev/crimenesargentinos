"use client";

import Image from "next/image";
import IMenuAction from "@/models/IMenuAction";
import { useTypewriterSound } from "@/hooks/useTypewriterSound";
import { useT } from "@/hooks/useT";
import { levelMenuMessages } from "../Level/LevelMenu.messages";

interface LevelMenuActionButtonProps {
  action: IMenuAction;
  cluesCount: number;
  onClick: () => void;
}

// Acción del menú de investigación (hoy, abrir el tablero del caso) con el contador de pistas
export default function LevelMenuActionButton({ action, cluesCount, onClick }: LevelMenuActionButtonProps) {
  const playTypewriter = useTypewriterSound();
  const t = useT(levelMenuMessages);
  const actionTitle = action.id === "board" ? t("boardTitle") : action.title;
  const actionDescription = action.id === "board" ? t("boardDescription") : action.description;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={playTypewriter}
      title={t("open", { title: actionTitle })}
      className="
        w-full p-3 rounded-2xl
        bg-gradient-to-r from-[rgba(20,30,42,0.85)] via-[rgba(28,42,58,0.9)] to-[rgba(36,26,18,0.85)]
        hover:from-[rgba(28,44,66,0.95)] hover:to-[rgba(52,36,22,0.95)]
        border-2 border-amber-500/40 hover:border-amber-400
        backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)]
        hover:shadow-[0_14px_36px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.25)]
        hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group cursor-pointer select-none
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-400/40 bg-black/40 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-200">
          <Image
            src={action.icon}
            alt={actionTitle}
            fill
            sizes="48px"
            className="object-cover"
          />
          <span className="absolute bottom-0 right-0 text-xs">📌</span>
        </div>
        <div className="flex flex-col text-left min-w-0">
          <span className="font-mono font-bold text-[10px] sm:text-xs text-amber-200 group-hover:text-amber-100 uppercase tracking-wider">
            {actionTitle}
          </span>
          <span className="text-[10px] text-[#FFF3C7]/65 font-mono line-clamp-1">
            {actionDescription}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-mono font-bold text-amber-300">
          {cluesCount}
        </span>
        <span className="text-amber-400 text-xs group-hover:translate-x-1 transition-transform">➔</span>
      </div>
    </button>
  );
}
