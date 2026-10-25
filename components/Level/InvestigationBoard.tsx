"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ISuspect } from "@/models/ISuspect";
import { resolveSuspectImage } from "@/lib/suspectImages";
import { useAudioStore } from "@/stores/useAudioStore";
import { useInvestigationBoardStore } from "@/stores/useInvestigationBoardStore";

interface InvestigationBoardProps {
  briefing?: string;
  suspects: ISuspect[];
  initialClues: string[];
  discoveredClues: string[];
  canIssueWarrant: boolean;
  warrantSuspectId: string | null;
  onEmitArrest: (suspect: ISuspect) => void;
}

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

  // Estados persistentes del tablero (guardados en store durante la partida)
  const markedTraits = useInvestigationBoardStore((state) => state.markedTraits);
  const suspectStatuses = useInvestigationBoardStore((state) => state.suspectStatuses);
  const toggleTrait = useInvestigationBoardStore((state) => state.toggleTrait);
  const setSpecificStatus = useInvestigationBoardStore((state) => state.setSpecificStatus);

  // Estados interactivos de hover
  const [activeHoverSuspect, setActiveHoverSuspect] = useState<string | null>(null);
  const [activeHoverClue, setActiveHoverClue] = useState<number | null>(null);
  const [showStrings, setShowStrings] = useState<boolean>(true);

  const allClues = useMemo(() => {
    return [
      ...initialClues.map((text, idx) => ({ id: `init-${idx}`, text, source: "Expediente Inicial" })),
      ...discoveredClues.map((text, idx) => ({ id: `disc-${idx}`, text, source: "Testimonio" })),
    ];
  }, [initialClues, discoveredClues]);

  // Manejadores específicos para Marcar como Principal y Descartar
  const handleTogglePrincipal = (e: React.MouseEvent, suspectId: string) => {
    e.stopPropagation();
    playSfx("typewriter");
    setSpecificStatus(suspectId, "suspect");
  };

  const handleToggleDiscarded = (e: React.MouseEvent, suspectId: string) => {
    e.stopPropagation();
    playSfx("typewriter");
    setSpecificStatus(suspectId, "discarded");
  };

  // Verifica si una pista coincide textualmente con un sospechoso para efecto de hover
  const doesClueMatchSuspect = (clueText: string, suspect: ISuspect) => {
    if (!suspect.description) return false;
    const cleanClue = clueText.toLowerCase();
    return suspect.description.some((trait) => {
      const cleanTrait = trait.toLowerCase().trim();
      return (
        cleanClue.includes(cleanTrait) ||
        cleanTrait.split(" ").filter((w) => w.length > 3).some((word) => cleanClue.includes(word))
      );
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fade-in select-none">
      {/* Header de Evidencias e Hipótesis */}
      <div>
        <h3 className="text-sm sm:text-base font-bold font-mono text-[#E1C380] uppercase tracking-wider">
          EVIDENCIAS E HIPOTESIS
        </h3>
      </div>

      {/* 2. El Tablero de Corcho con Textura y Marco de Madera */}
      <div
        className="
          relative w-full rounded-2xl p-4 sm:p-6 md:p-8
          bg-[#2b1810] border-4 border-[#4a2e1b]
          shadow-[inset_0_0_80px_rgba(0,0,0,0.85),0_20px_50px_rgba(0,0,0,0.8)]
          overflow-hidden
        "
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(68, 40, 24, 0.4) 0%, rgba(20, 10, 5, 0.85) 100%),
            repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 2px, transparent 2px, transparent 4px)
          `,
        }}
      >
        {/* Tornillos de metal decorativos en las 4 esquinas */}
        <span className="absolute top-2 left-2 size-3.5 rounded-full bg-zinc-600 border border-zinc-400 shadow-inner flex items-center justify-center text-[8px] text-zinc-900 font-bold">+</span>
        <span className="absolute top-2 right-2 size-3.5 rounded-full bg-zinc-600 border border-zinc-400 shadow-inner flex items-center justify-center text-[8px] text-zinc-900 font-bold">+</span>
        <span className="absolute bottom-2 left-2 size-3.5 rounded-full bg-zinc-600 border border-zinc-400 shadow-inner flex items-center justify-center text-[8px] text-zinc-900 font-bold">+</span>
        <span className="absolute bottom-2 right-2 size-3.5 rounded-full bg-zinc-600 border border-zinc-400 shadow-inner flex items-center justify-center text-[8px] text-zinc-900 font-bold">+</span>

        {/* Layout de 2 Secciones: Fichas de Pistas (Izquierda) y Fotos Polaroid de Sospechosos con Rasgos (Derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* ========================================================= */}
          {/* COLUMNA IZQUIERDA (5 de 12): INFORME Y PISTAS CLAVADAS    */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* INFORME INICIAL DEL CASO (Manila Paper Pinned) */}
            {briefing && (
              <div
                onMouseEnter={() => playSfx("typewriter")}
                className="relative p-4 rounded-xl bg-[#f0e8d5] text-zinc-900 border-2 border-[#cbb793] shadow-lg font-mono text-xs rotate-[-0.5deg]"
              >
                {/* Chincheta dorada */}
                <span className="absolute -top-2.5 left-4 size-4 rounded-full bg-amber-600 border border-amber-300 shadow flex items-center justify-center text-[8px] text-white z-10">
                  📌
                </span>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-400/60 text-[10px] text-zinc-700 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span>📁</span>
                    <span>INFORME POLICIAL DEL CASO</span>
                  </span>
                  <span className="bg-amber-200/90 border border-amber-400/50 px-2 py-0.5 rounded text-[9px] text-amber-900 font-bold">
                    CONFIDENCIAL
                  </span>
                </div>
                <p className="text-zinc-800 leading-relaxed font-serif text-[12px] italic">
                  &ldquo;{briefing}&rdquo;
                </p>
              </div>
            )}

            {/* HEADER DE PISTAS */}
            <div className="flex items-center justify-between pb-1 border-b border-[rgba(255,243,199,0.15)]">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">📍</span>
                <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#E1C380]">
                  Fichas de Declaraciones y Rastros
                </h4>
              </div>
            </div>

            {allClues.length > 0 ? (
              <div className="flex flex-col gap-3">
                {allClues.map((clue, idx) => {
                  const isHovered = activeHoverClue === idx;
                  const isMatchingHoveredSuspect =
                    activeHoverSuspect !== null &&
                    doesClueMatchSuspect(clue.text, suspects.find((s) => s.id === activeHoverSuspect) || ({} as ISuspect));

                  return (
                    <div
                      key={clue.id}
                      onMouseEnter={() => {
                        setActiveHoverClue(idx);
                        playSfx("typewriter");
                      }}
                      onMouseLeave={() => setActiveHoverClue(null)}
                      className={`
                        relative p-3.5 rounded-lg border shadow-md font-mono text-xs transition-all duration-200 cursor-pointer
                        ${idx % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}
                        ${isMatchingHoveredSuspect
                          ? "bg-[#fffbeb] text-zinc-900 border-amber-500 scale-[1.03] shadow-[0_0_20px_rgba(245,158,11,0.5)] z-20"
                          : isHovered
                            ? "bg-[#fef9c3] text-zinc-900 border-amber-400 scale-[1.02] z-20"
                            : "bg-[#f5eee0] text-zinc-900/90 border-[#d4c3a3] hover:scale-[1.01]"
                        }
                      `}
                    >
                      {/* Chincheta roja clavada */}
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 size-4 rounded-full bg-red-600 border border-red-300 shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center text-[7px] text-white">
                        📍
                      </span>

                      {/* Origen de la pista */}
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-300/80 text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                        <span>Pista #{idx + 1}</span>
                        <span className="bg-zinc-200/80 px-2 py-0.5 rounded text-[9px] text-zinc-700">
                          {clue.source}
                        </span>
                      </div>

                      {/* Texto de la pista */}
                      <p className="text-zinc-800 font-medium leading-relaxed">
                        &ldquo;{clue.text}&rdquo;
                      </p>

                      {/* Indicador de hilos que conectan */}
                      {showStrings && (
                        <div className="pt-2 mt-2 border-t border-dashed border-zinc-300/70 flex items-center justify-between text-[9px] text-red-700 font-bold">
                          <span className="flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-red-600 animate-pulse" />
                            Hilo de conexión trazado
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-black/40 border border-dashed border-[rgba(255,243,199,0.2)] text-center text-xs font-mono text-[#FFF3C7]/50 italic">
                Aún no has recolectado testimonios ni pistas en esta investigación.
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* COLUMNA DERECHA (7 de 12): POLAROIDS Y RASGOS DE SOSPECHOSOS */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-[rgba(255,243,199,0.15)]">
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#E1C380]">
                SOSPECHOSOS DEL CASO
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {suspects.map((suspect, idx) => {
                const status = suspectStatuses[suspect.id] || "neutral";
                const isWarrantIssued = warrantSuspectId === suspect.id;
                const suspectImage = resolveSuspectImage(suspect.name, suspect.image);
                const markedList = markedTraits[suspect.id] || [];
                const markedCount = markedList.length;
                const isHovered = activeHoverSuspect === suspect.id;

                // Rotación orgánica de polaroid
                const rotation = idx === 0 ? "rotate-[-1.5deg]" : idx === 1 ? "rotate-[1deg]" : "rotate-[-1deg]";

                return (
                  <div
                    key={suspect.id || idx}
                    onMouseEnter={() => {
                      setActiveHoverSuspect(suspect.id);
                      playSfx("typewriter");
                    }}
                    onMouseLeave={() => setActiveHoverSuspect(null)}
                    className={`
                      relative flex flex-col justify-between p-3 rounded-sm bg-[#faf8f5] text-zinc-900
                      shadow-[0_12px_28px_rgba(0,0,0,0.6)] transition-all duration-200 select-none
                      hover:scale-[1.02] hover:z-30 hover:shadow-[0_18px_36px_rgba(0,0,0,0.8)]
                      ${rotation}
                      ${status === "suspect"
                        ? "ring-4 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.45)]"
                        : status === "discarded"
                          ? "opacity-75 ring-2 ring-red-500/70"
                          : isHovered
                            ? "ring-2 ring-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                            : ""
                      }
                    `}
                  >
                    <div>
                      {/* Chincheta superior */}
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 size-5 rounded-full bg-red-600 border-2 border-red-200 shadow-md flex items-center justify-center text-[8px] text-white z-20">
                        📍
                      </div>

                      {/* Foto Polaroid cuadrada con 2 iconos de acción en las esquinas */}
                      <div className="relative aspect-square w-full rounded-xs overflow-hidden bg-zinc-900 border border-zinc-300">
                        {/* BOTÓN 1: PRINCIPAL (★) - Esquina superior izquierda */}
                        <button
                          type="button"
                          onClick={(e) => handleTogglePrincipal(e, suspect.id)}
                          onMouseEnter={() => playSfx("typewriter")}
                          className={`
                            absolute top-2 left-2 z-20 size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer
                            ${status === "suspect"
                              ? "bg-amber-400 text-black ring-2 ring-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                              : "bg-black hover:bg-black/90 text-amber-300/80 hover:text-amber-100 border border-amber-400/50 hover:scale-105"
                            }
                          `}
                          title={status === "suspect" ? "Quitar marca de sospechoso principal" : "Marcar como sospechoso principal (★)"}
                        >
                          ★
                        </button>

                        {/* BOTÓN 2: DESCARTADO (✕) - Esquina superior derecha */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleDiscarded(e, suspect.id)}
                          onMouseEnter={() => playSfx("typewriter")}
                          className={`
                            absolute top-2 right-2 z-20 size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer
                            ${status === "discarded"
                              ? "bg-red-600 text-white ring-2 ring-red-300 scale-110 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                              : "bg-black hover:bg-black/90 text-red-300/80 hover:text-red-100 border border-red-500/50 hover:scale-105"
                            }
                          `}
                          title={status === "discarded" ? "Quitar descarte del sospechoso" : "Descartar sospechoso (✕)"}
                        >
                          ✕
                        </button>

                        {suspectImage ? (
                          <Image
                            src={suspectImage}
                            alt={suspect.name}
                            fill
                            sizes="200px"
                            className={`object-cover contrast-105 transition-all duration-200 ${status === "discarded" ? "grayscale opacity-50 contrast-90" : ""
                              }`}
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center text-3xl text-zinc-600 bg-zinc-200">
                            👤
                          </div>
                        )}

                        {/* Sello de estado visual sobre la foto cuando está descartado */}
                        {status === "discarded" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-950/40 backdrop-blur-[1px] pointer-events-none">
                            <span className="font-mono font-black text-xs uppercase px-2.5 py-1 border-2 border-red-600 text-red-600 bg-white/95 rounded rotate-[-15deg] shadow-lg tracking-widest">
                              DESCARTADO ✕
                            </span>
                          </div>
                        )}

                        {/* Badge de principal cuando está marcado */}
                        {status === "suspect" && (
                          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                            <span className="font-mono font-black text-[9px] uppercase px-2 py-0.5 border border-amber-500 text-amber-950 bg-amber-300 rounded shadow-md tracking-wider flex items-center gap-1">
                              <span>★</span>
                              <span>PRINCIPAL</span>
                            </span>
                          </div>
                        )}

                        {isWarrantIssued && (
                          <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
                            <span className="font-mono font-black text-[9px] uppercase px-1.5 py-0.5 border border-red-600 text-white bg-red-600 rounded shadow-md tracking-wider">
                              ⚖️ ORDEN
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
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                              Rasgos e Indicios:
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            {suspect.description.map((trait, tIdx) => {
                              const isManuallyMarked = markedList.includes(tIdx);

                              return (
                                <button
                                  key={tIdx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSfx("typewriter");
                                    toggleTrait(suspect.id, tIdx);
                                  }}
                                  onMouseEnter={() => playSfx("typewriter")}
                                  className={`
                                    w-full flex items-center justify-between gap-1.5 px-2 py-1.5 rounded text-[10px] font-mono leading-tight transition-all cursor-pointer text-left
                                    ${isManuallyMarked
                                      ? "bg-emerald-100 hover:bg-emerald-200/90 border border-emerald-500 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-400/50"
                                      : "bg-zinc-100/90 hover:bg-zinc-200/80 border border-zinc-300/80 text-zinc-700 font-medium"
                                    }
                                  `}
                                  title={
                                    isManuallyMarked
                                      ? "Hacé click para desmarcar este rasgo"
                                      : "Hacé click para marcar este rasgo como coincidencia"
                                  }
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <span
                                      className={`shrink-0 text-xs font-black ${isManuallyMarked ? "text-emerald-700" : "text-zinc-400"
                                        }`}
                                    >
                                      {isManuallyMarked ? "✓" : "•"}
                                    </span>
                                    <span className="truncate">{trait}</span>
                                  </div>

                                  <span
                                    className={`text-[8px] uppercase tracking-wider font-mono ${isManuallyMarked
                                      ? "text-emerald-800 font-bold"
                                      : "text-zinc-400 opacity-60"
                                      }`}
                                  >
                                    {isManuallyMarked ? "LISTO" : "MARCAR"}
                                  </span>
                                </button>
                              );
                            })}
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
                          if (canIssueWarrant && !isWarrantIssued) {
                            playSfx("typewriter");
                          }
                        }}
                        className={`
                          w-full py-2 px-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all
                          ${isWarrantIssued
                            ? "bg-red-700 text-white cursor-default"
                            : canIssueWarrant
                              ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md hover:scale-[1.02] cursor-pointer"
                              : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                          }
                        `}
                      >
                        {isWarrantIssued ? "⚖️ ORDEN ACTIVA" : "EMITIR ORDEN"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}
