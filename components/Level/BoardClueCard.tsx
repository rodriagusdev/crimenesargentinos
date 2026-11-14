"use client";

import { memo } from "react";
import { useT } from "@/hooks/useT";
import { investigationBoardMessages } from "./InvestigationBoard.messages";

interface BoardClueCardProps {
  index: number;
  text: string;
  source: string;
  isTestimony: boolean;
  onHover: () => void;
}

// Ficha de pista clavada en el tablero; el resaltado al apuntar es solo CSS (sin estado)
function BoardClueCard({ index, text, source, isTestimony, onHover }: BoardClueCardProps) {
  const t = useT(investigationBoardMessages);

  return (
    <div
      onMouseEnter={onHover}
      className={`
        relative p-3.5 rounded-lg border shadow-md font-mono text-xs transition-all duration-200 cursor-pointer
        ${index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}
        bg-[#f5eee0] text-zinc-900/90 border-[#d4c3a3]
        hover:bg-[#fef9c3] hover:text-zinc-900 hover:border-amber-400 hover:scale-[1.02] hover:z-20
      `}
    >
      {/* Chincheta roja clavada */}
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 size-4 rounded-full bg-red-600 border border-red-300 shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center text-[7px] text-white">
        📍
      </span>

      {/* Origen de la pista: las testimoniales (las que cuentan para la orden de arresto) van en azul tinta */}
      <div
        className={`flex items-center justify-between pb-1.5 mb-1.5 border-b text-[10px] font-bold uppercase tracking-wider ${isTestimony
          ? "-mx-3.5 -mt-3.5 px-3.5 pt-2.5 rounded-t-lg bg-[#1e3a5f] border-[#14294a] text-[#dbeafe]"
          : "border-zinc-300/80 text-zinc-600"
          }`}
      >
        <span>{t("clueNumber", { n: index + 1 })}</span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] sm:text-[9px] ${isTestimony
            ? "bg-[#dbeafe] text-[#1e3a5f]"
            : "bg-zinc-200/80 text-zinc-700"
            }`}
        >
          {source}
        </span>
      </div>

      {/* Texto de la pista */}
      <p className="text-zinc-800 font-medium leading-relaxed">
        &ldquo;{text}&rdquo;
      </p>

      {/* Indicador de hilos que conectan */}
      <div className="pt-2 mt-2 border-t border-dashed border-zinc-300/70 flex items-center justify-between text-[10px] sm:text-[9px] text-red-700 font-bold">
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-red-600 animate-pulse" />
          {t("stringTraced")}
        </span>
      </div>
    </div>
  );
}

export default memo(BoardClueCard);
