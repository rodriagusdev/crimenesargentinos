"use client";

import { useCallback, useMemo } from "react";
import { ISuspect } from "@/models/ISuspect";
import { resolveSuspectImage } from "@/lib/suspectImages";
import { useAudioStore } from "@/stores/useAudioStore";
import { useInvestigationBoardStore } from "@/stores/useInvestigationBoardStore";
import { useT } from "@/hooks/useT";
import { investigationBoardMessages } from "./InvestigationBoard.messages";
import BoardClueCard from "./BoardClueCard";
import BoardSuspectCard from "./BoardSuspectCard";

interface InvestigationBoardProps {
  briefing?: string;
  suspects: ISuspect[];
  initialClues: string[];
  discoveredClues: string[];
  canIssueWarrant: boolean;
  warrantSuspectId: string | null;
  onEmitArrest: (suspect: ISuspect) => void;
}

// Lista vacía estable para que las tarjetas memoizadas no se re-rendericen sin rasgos marcados
const NO_MARKS: number[] = [];

export default function InvestigationBoard({
  briefing,
  suspects = [],
  initialClues = [],
  discoveredClues = [],
  canIssueWarrant,
  warrantSuspectId,
  onEmitArrest,
}: InvestigationBoardProps) {
  const playSfx = useAudioStore((state) => state.playSfx);
  const t = useT(investigationBoardMessages);

  // Estados persistentes del tablero (guardados en store durante la partida)
  const markedTraits = useInvestigationBoardStore((state) => state.markedTraits);
  const suspectStatuses = useInvestigationBoardStore((state) => state.suspectStatuses);
  const toggleTrait = useInvestigationBoardStore((state) => state.toggleTrait);
  const setSpecificStatus = useInvestigationBoardStore((state) => state.setSpecificStatus);

  const allClues = useMemo(() => {
    return [
      ...initialClues.map((text, idx) => ({ id: `init-${idx}`, text, source: t("sourceInitial"), isTestimony: false })),
      ...discoveredClues.map((text, idx) => ({ id: `disc-${idx}`, text, source: t("sourceTestimony"), isTestimony: true })),
    ];
  }, [initialClues, discoveredClues, t]);

  // Foto de cada sospechoso, resuelta una vez por lista de sospechosos
  const suspectImages = useMemo(
    () => suspects.map((suspect) => resolveSuspectImage(suspect.name, suspect.image)),
    [suspects]
  );

  // Sonidos al apuntar (sin estado: el resaltado es CSS)
  const playHoverSfx = useCallback(() => playSfx("opencasefile"), [playSfx]);
  const playTypeSfx = useCallback(() => playSfx("typewriter"), [playSfx]);

  // Manejadores específicos para Marcar como Principal, Descartar y marcar rasgos
  const handleTogglePrincipal = useCallback(
    (suspectId: string) => {
      playSfx("typewriter");
      setSpecificStatus(suspectId, "suspect");
    },
    [playSfx, setSpecificStatus]
  );

  const handleToggleDiscarded = useCallback(
    (suspectId: string) => {
      playSfx("typewriter");
      setSpecificStatus(suspectId, "discarded");
    },
    [playSfx, setSpecificStatus]
  );

  const handleToggleTrait = useCallback(
    (suspectId: string, traitIdx: number) => {
      playSfx("typewriter");
      toggleTrait(suspectId, traitIdx);
    },
    [playSfx, toggleTrait]
  );
  return (
    <div className="w-full flex flex-col gap-4 lg:gap-3 lg:flex-1 lg:min-h-0 animate-fade-in select-none">
      {/* Header de Evidencias e Hipótesis */}
      <div>
        <h3 className="text-sm sm:text-base font-bold font-mono text-[#E1C380] uppercase tracking-wider">
          {t("title")}
        </h3>
      </div>

      {/* 2. Pizarra Táctica / Pizarra Negra de Investigación */}
      <div
        className="
          relative w-full rounded-2xl p-3 sm:p-6 md:p-8 lg:p-5
          lg:flex-1 lg:min-h-0
          border-[6px] sm:border-[12px] border-[#1e2430]
          ring-1 ring-[#334155]/80
          shadow-[inset_0_0_80px_rgba(0,0,0,0.95),0_25px_60px_rgba(0,0,0,0.85)]
          overflow-hidden
        "
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(18, 24, 38, 0.25) 0%, rgba(6, 10, 18, 0.75) 100%),
            url('/images/slate_board.webp')
          `,
          backgroundSize: "36px 36px, 36px 36px, 100% 100%, cover",
          backgroundPosition: "center",
        }}
      >
        {/* Escuadras tácticas de acero en las 4 esquinas */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-slate-500/60 pointer-events-none z-10 rounded-tl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-slate-500/60 pointer-events-none z-10 rounded-tr" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-slate-500/60 pointer-events-none z-10 rounded-bl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-slate-500/60 pointer-events-none z-10 rounded-br" />

        {/* Tornillos de metal decorativos en las 4 esquinas */}
        <span className="absolute top-2.5 left-2.5 size-3.5 rounded-full bg-gradient-to-br from-slate-300 via-slate-600 to-slate-900 border border-slate-400 shadow-md flex items-center justify-center text-[7px] text-slate-950 font-bold z-10 select-none">✕</span>
        <span className="absolute top-2.5 right-2.5 size-3.5 rounded-full bg-gradient-to-br from-slate-300 via-slate-600 to-slate-900 border border-slate-400 shadow-md flex items-center justify-center text-[7px] text-slate-950 font-bold z-10 select-none">✕</span>
        <span className="absolute bottom-2.5 left-2.5 size-3.5 rounded-full bg-gradient-to-br from-slate-300 via-slate-600 to-slate-900 border border-slate-400 shadow-md flex items-center justify-center text-[7px] text-slate-950 font-bold z-10 select-none">✕</span>
        <span className="absolute bottom-2.5 right-2.5 size-3.5 rounded-full bg-gradient-to-br from-slate-300 via-slate-600 to-slate-900 border border-slate-400 shadow-md flex items-center justify-center text-[7px] text-slate-950 font-bold z-10 select-none">✕</span>

        {/* Layout de 2 Secciones: Fichas de Pistas (Izquierda) y Fotos Polaroid de Sospechosos con Rasgos (Derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:h-full relative z-10">
          {/* ========================================================= */}
          {/* COLUMNA IZQUIERDA (5 de 12): INFORME Y PISTAS CLAVADAS    */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:min-h-0 lg:overflow-y-auto lg:overflow-x-hidden lg:px-1 lg:pt-3 lg:pb-2 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
            {/* INFORME INICIAL DEL CASO (Manila Paper Pinned) */}
            {briefing && (
              <div
                onMouseEnter={playHoverSfx}
                className="relative p-4 rounded-xl bg-[#f0e8d5] text-zinc-900 border-2 border-[#cbb793] shadow-lg font-mono text-xs rotate-[-0.5deg]"
              >
                {/* Chincheta dorada */}
                <span className="absolute -top-2.5 left-4 size-4 rounded-full bg-amber-600 border border-amber-300 shadow flex items-center justify-center text-[8px] text-white z-10">
                  📌
                </span>
                <div className="flex items-center justify-between gap-2 pb-1.5 mb-2 border-b border-zinc-400/60 text-[10px] text-zinc-700 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span>📁</span>
                    <span>{t("caseReport")}</span>
                  </span>
                  <span className="shrink-0 bg-amber-200/90 border border-amber-400/50 px-2 py-0.5 rounded text-[10px] sm:text-[9px] text-amber-900 font-bold">
                    {t("confidential")}
                  </span>
                </div>
                <p className="text-zinc-800 leading-relaxed font-serif text-[12px] italic">
                  &ldquo;{briefing}&rdquo;
                </p>
              </div>
            )}

            {/* HEADER DE PISTAS */}
            <div className="flex items-center justify-between pb-1.5 px-3 py-1.5 rounded-lg bg-[rgba(15,23,42,0.8)] backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">📍</span>
                <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#E1C380]">
                  {t("cluesHeader")}
                </h4>
              </div>
            </div>

            {allClues.length > 0 ? (
              <div className="flex flex-col gap-3">
                {allClues.map((clue, idx) => (
                  <BoardClueCard
                    key={clue.id}
                    index={idx}
                    text={clue.text}
                    source={clue.source}
                    isTestimony={clue.isTestimony}
                    onHover={playHoverSfx}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[rgba(15,23,42,0.7)] backdrop-blur-xs border border-dashed border-slate-600/50 text-center text-xs font-mono text-[#E1C380]/70 italic">
                {t("noClues")}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* COLUMNA DERECHA (7 de 12): POLAROIDS Y RASGOS DE SOSPECHOSOS */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 lg:min-h-0 lg:overflow-y-auto lg:overflow-x-hidden lg:px-1 lg:pt-1 lg:pb-2 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
            <div className="flex items-center justify-between pb-1.5 px-3 py-1.5 rounded-lg bg-[rgba(15,23,42,0.8)] backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-sm">
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#E1C380]">
                {t("suspectsHeader")}
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {suspects.map((suspect, idx) => (
                <BoardSuspectCard
                  key={suspect.id || idx}
                  suspect={suspect}
                  index={idx}
                  image={suspectImages[idx] ?? null}
                  status={suspectStatuses[suspect.id] || "neutral"}
                  markedList={markedTraits[suspect.id] || NO_MARKS}
                  isWarrantIssued={warrantSuspectId === suspect.id}
                  canIssueWarrant={canIssueWarrant}
                  onHover={playHoverSfx}
                  onTypeHover={playTypeSfx}
                  onTogglePrincipal={handleTogglePrincipal}
                  onToggleDiscarded={handleToggleDiscarded}
                  onToggleTrait={handleToggleTrait}
                  onEmitArrest={onEmitArrest}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
