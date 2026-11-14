"use client";

import { memo } from "react";
import Image from "next/image";
import { ISuspect } from "@/models/ISuspect";
import { SuspectBoardStatus } from "@/stores/useInvestigationBoardStore";
import { useT } from "@/hooks/useT";
import { investigationBoardMessages } from "./InvestigationBoard.messages";
import BoardTraitButton from "./BoardTraitButton";

interface BoardSuspectCardProps {
  suspect: ISuspect;
  index: number;
  image: string | null;
  status: SuspectBoardStatus;
  markedList: number[];
  isWarrantIssued: boolean;
  canIssueWarrant: boolean;
  onHover: () => void;
  onTypeHover: () => void;
  onTogglePrincipal: (suspectId: string) => void;
  onToggleDiscarded: (suspectId: string) => void;
  onToggleTrait: (suspectId: string, traitIdx: number) => void;
  onEmitArrest: (suspect: ISuspect) => void;
}

// Polaroid de un sospechoso en el tablero con sus rasgos marcables; el resaltado al apuntar es solo CSS (sin estado)
function BoardSuspectCard({
  suspect,
  index,
  image,
  status,
  markedList,
  isWarrantIssued,
  canIssueWarrant,
  onHover,
  onTypeHover,
  onTogglePrincipal,
  onToggleDiscarded,
  onToggleTrait,
  onEmitArrest,
}: BoardSuspectCardProps) {
  const t = useT(investigationBoardMessages);

  // Rotación orgánica de polaroid
  const rotation = index === 0 ? "rotate-[-1.5deg]" : index === 1 ? "rotate-[1deg]" : "rotate-[-1deg]";

  return (
    <div
      onMouseEnter={onHover}
      className={`
        relative min-w-0 flex flex-col justify-between p-2 sm:p-3 rounded-sm bg-[#faf8f5] text-zinc-900
        shadow-[0_12px_28px_rgba(0,0,0,0.6)] transition-all duration-200 select-none
        hover:scale-[1.02] hover:z-30 hover:shadow-[0_18px_36px_rgba(0,0,0,0.8)]
        ${rotation}
        ${status === "suspect"
          ? "ring-4 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.45)]"
          : status === "discarded"
            ? "opacity-75 ring-2 ring-red-500/70"
            : "hover:ring-2 hover:ring-amber-400/60"
        }
      `}
    >
      <div>
        {/* Chincheta superior */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 size-5 rounded-full bg-red-600 border-2 border-red-200 shadow-md flex items-center justify-center text-[8px] text-white z-20">
          📍
        </div>

        {/* Foto Polaroid cuadrada con 2 iconos de acción en las esquinas */}
        <div className="relative aspect-square lg:aspect-[5/4] w-full rounded-xs overflow-hidden bg-zinc-900 border border-zinc-300">
          {/* BOTÓN 1: PRINCIPAL (★) - Esquina superior izquierda */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePrincipal(suspect.id);
            }}
            onMouseEnter={onTypeHover}
            className={`
              absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-20 size-8 sm:size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer
              ${status === "suspect"
                ? "bg-amber-400 text-black ring-2 ring-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                : "bg-black hover:bg-black/90 text-amber-300/80 hover:text-amber-100 border border-amber-400/50 hover:scale-105"
              }
            `}
            title={status === "suspect" ? t("unmarkPrime") : t("markPrime")}
          >
            ★
          </button>

          {/* BOTÓN 2: DESCARTADO (✕) - Esquina superior derecha */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleDiscarded(suspect.id);
            }}
            onMouseEnter={onTypeHover}
            className={`
              absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-20 size-8 sm:size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer
              ${status === "discarded"
                ? "bg-red-600 text-white ring-2 ring-red-300 scale-110 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                : "bg-black hover:bg-black/90 text-red-300/80 hover:text-red-100 border border-red-500/50 hover:scale-105"
              }
            `}
            title={status === "discarded" ? t("undiscard") : t("discard")}
          >
            ✕
          </button>

          {image ? (
            <Image
              src={image}
              alt={suspect.name}
              fill
              sizes="(max-width: 640px) 45vw, 200px"
              className={`object-cover contrast-105 transition-all duration-200 ${status === "discarded" ? "grayscale opacity-50 contrast-90" : ""}`}
            />
          ) : (
            <div className="size-full flex items-center justify-center text-3xl text-zinc-600 bg-zinc-200">
              👤
            </div>
          )}

          {/* Sello de estado visual sobre la foto cuando está descartado */}
          {status === "discarded" && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-950/40 backdrop-blur-[1px] pointer-events-none">
              <span className="font-mono font-black text-[10px] sm:text-xs uppercase px-1.5 sm:px-2.5 py-1 border-2 border-red-600 text-red-600 bg-white/95 rounded rotate-[-15deg] shadow-lg tracking-wider sm:tracking-widest whitespace-nowrap">
                {t("discardedStamp")}
              </span>
            </div>
          )}

          {/* Badge de principal cuando está marcado */}
          {status === "suspect" && (
            <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-10 pointer-events-none">
              <span className="font-mono font-black text-[10px] sm:text-[9px] uppercase px-1.5 sm:px-2 py-0.5 border border-amber-500 text-amber-950 bg-amber-300 rounded shadow-md tracking-wider flex items-center gap-1">
                <span>★</span>
                <span className="hidden sm:inline">{t("prime")}</span>
              </span>
            </div>
          )}

          {isWarrantIssued && (
            <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 z-10 pointer-events-none">
              <span className="font-mono font-black text-[10px] sm:text-[9px] uppercase px-1.5 py-0.5 border border-red-600 text-white bg-red-600 rounded shadow-md tracking-wider">
                {t("warrantBadge")}
              </span>
            </div>
          )}
        </div>

        {/* Pie de foto manuscrito / máquina de escribir */}
        <div className="pt-2 text-center flex flex-col gap-0.5">
          <h5 className="font-mono font-bold text-xs tracking-tight text-zinc-900 uppercase truncate">
            {suspect.name}
          </h5>
        </div>

        {/* LISTA COMPLETA DE RASGOS — MARCACIÓN MANUAL POR EL USUARIO */}
        {suspect.description && suspect.description.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-zinc-300/80 flex flex-col gap-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                {t("traits")}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {suspect.description.map((trait, tIdx) => (
                <BoardTraitButton
                  key={tIdx}
                  suspectId={suspect.id}
                  index={tIdx}
                  trait={trait}
                  marked={markedList.includes(tIdx)}
                  onToggle={onToggleTrait}
                  onHover={onTypeHover}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botón rápido para emitir orden directo desde la tarjeta */}
      <div className="mt-3 pt-2.5 border-t border-zinc-300 flex flex-col gap-1">
        <button
          type="button"
          disabled={!canIssueWarrant || isWarrantIssued}
          onClick={() => onEmitArrest(suspect)}
          onMouseEnter={() => {
            if (canIssueWarrant && !isWarrantIssued) onTypeHover();
          }}
          className={`
            w-full min-h-9 sm:min-h-0 py-2 px-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all
            ${isWarrantIssued
              ? "bg-red-700 text-white cursor-default"
              : canIssueWarrant
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md hover:scale-[1.02] cursor-pointer"
                : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
            }
          `}
        >
          {isWarrantIssued ? t("warrantActive") : t("issueWarrant")}
        </button>
      </div>
    </div>
  );
}

export default memo(BoardSuspectCard);
