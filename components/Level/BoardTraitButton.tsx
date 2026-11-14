"use client";

import { memo } from "react";
import { useT } from "@/hooks/useT";
import { investigationBoardMessages } from "./InvestigationBoard.messages";

interface BoardTraitButtonProps {
  suspectId: string;
  index: number;
  trait: string;
  marked: boolean;
  onToggle: (suspectId: string, index: number) => void;
  onHover: () => void;
}

// Rasgo de un sospechoso en el tablero, marcado a mano por el jugador
function BoardTraitButton({ suspectId, index, trait, marked, onToggle, onHover }: BoardTraitButtonProps) {
  const t = useT(investigationBoardMessages);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle(suspectId, index);
      }}
      onMouseEnter={onHover}
      className={`
        w-full min-h-9 sm:min-h-0 flex items-center justify-between gap-1.5 px-1.5 sm:px-2 py-1.5 rounded text-[10px] font-mono leading-tight transition-all cursor-pointer text-left
        ${marked
          ? "bg-emerald-100 hover:bg-emerald-200/90 border border-emerald-500 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-400/50"
          : "bg-zinc-100/90 hover:bg-zinc-200/80 border border-zinc-300/80 text-zinc-700 font-medium"
        }
      `}
      title={marked ? t("unmarkTrait") : t("markTrait")}
    >
      <div className="flex items-center gap-1.5 min-w-0 sm:truncate">
        <span className={`shrink-0 text-xs font-black ${marked ? "text-emerald-700" : "text-zinc-400"}`}>
          {marked ? "✓" : "•"}
        </span>
        <span className="break-words sm:truncate">{trait}</span>
      </div>

      <span
        className={`hidden sm:inline text-[8px] uppercase tracking-wider font-mono ${marked
          ? "text-emerald-800 font-bold"
          : "text-zinc-400 opacity-60"
          }`}
      >
        {marked ? t("traitDone") : t("traitMark")}
      </span>
    </button>
  );
}

export default memo(BoardTraitButton);
