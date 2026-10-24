"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ISuspect } from "@/models/ISuspect";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useAudioStore } from "@/stores/useAudioStore";
import { resolveSuspectImage } from "@/lib/suspectImages";
import GameButton from "../buttons/GameButton";

export type DossierTab = "clues" | "suspects";

interface CaseDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: DossierTab;
  levelId: number;
  briefing?: string;
  initialClues?: string[];
  suspects?: ISuspect[];
  isFacingCriminal?: boolean;
}

export default function CaseDossierModal({
  isOpen,
  onClose,
  initialTab = "clues",
  levelId,
  briefing,
  initialClues = [],
  suspects = [],
  isFacingCriminal = false,
}: CaseDossierModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<DossierTab>(initialTab);
  const [selectedSuspect, setSelectedSuspect] = useState<ISuspect | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [warrantError, setWarrantError] = useState<string | null>(null);

  const playSfx = useAudioStore((state) => state.playSfx);

  // Store data
  const session = useGameSessionStore((state) => state.session);
  const discoveredClues = useGameSessionStore((state) => state.discoveredClues);
  const issueArrestWarrant = useGameSessionStore((state) => state.issueArrestWarrant);
  const storeSuspects = useGameSessionStore((state) => state.suspects);
  const storeBriefing = useGameSessionStore((state) => state.briefing);
  const storeInitialClues = useGameSessionStore((state) => state.initialClues);

  const effectiveSuspects = suspects && suspects.length > 0 ? suspects : storeSuspects;
  const effectiveBriefing = briefing || storeBriefing || "";
  const effectiveInitialClues = initialClues && initialClues.length > 0 ? initialClues : storeInitialClues;

  const warrantSuspectId = session?.warrantSuspectId ?? null;
  const canIssueWarrant = Boolean(session?.canIssueWarrant);
  const requiredClues = session?.requiredCluesForWarrant ?? 3;

  const totalClues = effectiveInitialClues.length + discoveredClues.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync tab whenever opened or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedSuspect) {
          setSelectedSuspect(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedSuspect, onClose]);

  // Check if a suspect trait matches any discovered clue from witnesses
  const matchingTraitsMap = useMemo(() => {
    const map = new Map<string, Set<number>>();
    if (!discoveredClues || discoveredClues.length === 0) return map;

    effectiveSuspects.forEach((suspect) => {
      const matchSet = new Set<number>();
      suspect.description?.forEach((trait, index) => {
        const cleanTrait = trait.toLowerCase().trim();
        const matches = discoveredClues.some((clue) => {
          const cleanClue = clue.toLowerCase();
          return (
            cleanClue.includes(cleanTrait) ||
            cleanTrait
              .split(" ")
              .filter((w) => w.length > 3)
              .some((word) => cleanClue.includes(word))
          );
        });
        if (matches) {
          matchSet.add(index);
        }
      });
      map.set(suspect.id, matchSet);
    });

    return map;
  }, [effectiveSuspects, discoveredClues]);

  if (!mounted || !isOpen || typeof window === "undefined") {
    return null;
  }

  const handleTabChange = (tab: DossierTab) => {
    if (tab === activeTab) return;
    playSfx("typewriter");
    setActiveTab(tab);
  };

  const handleArrestClick = (suspect: ISuspect) => {
    if (!canIssueWarrant) return;
    setWarrantError(null);
    setSelectedSuspect(suspect);
  };

  const handleConfirmArrest = async () => {
    if (!selectedSuspect || submitting) return;

    try {
      setSubmitting(true);
      playSfx("arrest");
      await issueArrestWarrant(selectedSuspect.id);
      setSelectedSuspect(null);
    } catch (err) {
      setWarrantError(err instanceof Error ? err.message : "No se pudo emitir la orden de arresto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelArrest = () => {
    if (submitting) return;
    setWarrantError(null);
    setSelectedSuspect(null);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className={`
          relative w-full max-w-[1280px]
          max-h-[96vh] sm:max-h-[92vh]
          flex flex-col
          rounded-2xl
          bg-[#0a111a]
          border-2 ${
            isFacingCriminal
              ? "border-red-500/80 shadow-[0_25px_70px_rgba(239,68,68,0.35),0_0_30px_rgba(239,68,68,0.2)]"
              : "border-[rgba(255,243,199,0.2)] shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
          }
          text-[#FFF3C7]
          overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* 1. GOOGLE WINDOW / CHROME STYLE TABBED TITLE BAR                          */}
        {/* ========================================================================= */}
        <div className="w-full bg-[#060b12] border-b border-[rgba(255,243,199,0.14)] pt-2.5 px-3 sm:px-5 flex items-end justify-between gap-3 shrink-0 select-none">
          {/* Left section: Terminal / Window Controls & Tabs */}
          <div className="flex items-end gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
            {/* Window Dots / Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 pb-2.5 pr-2 mr-1 border-r border-[rgba(255,243,199,0.12)]">
              <span className="size-2.5 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
              <span className="size-2.5 rounded-full bg-amber-500/80 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
              <span className="size-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            </div>

            {/* TAB 1: PISTAS */}
            <button
              type="button"
              onClick={() => handleTabChange("clues")}
              className={`
                group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2.5 sm:py-3
                rounded-t-xl font-mono text-xs sm:text-sm font-bold tracking-wider uppercase
                transition-all duration-150 cursor-pointer border-t border-x
                ${
                  activeTab === "clues"
                    ? "bg-[#0f1a28] text-amber-300 border-[rgba(255,243,199,0.25)] shadow-[0_-4px_12px_rgba(0,0,0,0.4)] z-10"
                    : "bg-[#080e18]/80 text-[#FFF3C7]/60 border-transparent hover:bg-[#0c1522] hover:text-[#FFF3C7] hover:border-[rgba(255,243,199,0.1)]"
                }
              `}
            >
              {/* Active Tab Accent Highlight Bar */}
              {activeTab === "clues" && (
                <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-t-xl" />
              )}

              <div className="relative size-4 sm:size-5 rounded overflow-hidden shrink-0 border border-[rgba(255,243,199,0.15)] bg-black/40">
                <Image
                  src="/images/icons/icon_clues.jpg"
                  alt="Pistas"
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </div>

              <span>Pistas y Evidencias</span>

              <span
                className={`
                  text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ml-0.5 transition-colors
                  ${
                    activeTab === "clues"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                      : "bg-[rgba(255,243,199,0.08)] text-[#FFF3C7]/50"
                  }
                `}
              >
                {totalClues}
              </span>
            </button>

            {/* TAB 2: SOSPECHOSOS */}
            <button
              type="button"
              onClick={() => handleTabChange("suspects")}
              className={`
                group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2.5 sm:py-3
                rounded-t-xl font-mono text-xs sm:text-sm font-bold tracking-wider uppercase
                transition-all duration-150 cursor-pointer border-t border-x
                ${
                  activeTab === "suspects"
                    ? "bg-[#0f1a28] text-amber-300 border-[rgba(255,243,199,0.25)] shadow-[0_-4px_12px_rgba(0,0,0,0.4)] z-10"
                    : "bg-[#080e18]/80 text-[#FFF3C7]/60 border-transparent hover:bg-[#0c1522] hover:text-[#FFF3C7] hover:border-[rgba(255,243,199,0.1)]"
                }
              `}
            >
              {/* Active Tab Accent Highlight Bar */}
              {activeTab === "suspects" && (
                <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-t-xl" />
              )}

              <div className="relative size-4 sm:size-5 rounded overflow-hidden shrink-0 border border-[rgba(255,243,199,0.15)] bg-black/40">
                <Image
                  src="/images/icons/icon_suspects.jpg"
                  alt="Sospechosos"
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </div>

              <span>Sospechosos</span>

              <span
                className={`
                  text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ml-0.5 transition-colors
                  ${
                    activeTab === "suspects"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                      : "bg-[rgba(255,243,199,0.08)] text-[#FFF3C7]/50"
                  }
                `}
              >
                {effectiveSuspects.length}
              </span>
            </button>
          </div>

          {/* Right section: Case ID & Window Close Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 pb-2.5 shrink-0">
            {isFacingCriminal ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-red-950/80 border border-red-500/70 text-red-300 animate-pulse">
                <span className="size-2 rounded-full bg-red-500 animate-ping" />
                🚨 FRENTE AL CRIMINAL
              </span>
            ) : (
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-amber-500/15 border border-amber-500/35 text-amber-300">
                CASO #{levelId.toString().padStart(2, "0")}
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="size-8 sm:size-9 rounded-xl bg-[rgba(255,243,199,0.06)] hover:bg-red-950/60 border border-[rgba(255,243,199,0.15)] hover:border-red-500/50 flex items-center justify-center text-[#FFF3C7]/70 hover:text-white transition-all duration-150 cursor-pointer shadow-sm active:scale-95"
              title="Cerrar Expediente (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. WINDOW CONTENT BODY (DYNAMICALLY SWITCHES BETWEEN TABS)                 */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0f1a28] custom-scrollbar flex flex-col gap-4">
          {isFacingCriminal && (
            <div className="flex items-start sm:items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-red-950/90 via-red-900/80 to-red-950/90 border border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse shrink-0">
              <span className="text-2xl sm:text-3xl shrink-0">🚨</span>
              <div className="flex flex-col gap-0.5 text-left">
                <span className="font-mono font-bold text-xs sm:text-sm text-red-200 uppercase tracking-wider">
                  ¡Escondite localizado — Estás frente al criminal!
                </span>
                <span className="font-mono text-[11px] sm:text-xs text-red-100/80 leading-relaxed">
                  Revisá las pistas y evidencias en la pestaña &quot;Pistas y Evidencias&quot; y elegí al culpable en &quot;Sospechosos&quot; para emitir la orden de arresto definitiva.
                </span>
              </div>
            </div>
          )}
          {/* ----------------------------------------------------------------------- */}
          {/* TAB CONTENT: SOSPECHOSOS                                                */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === "suspects" && (
            <div className="w-full flex flex-col gap-5 animate-fade-in">
              {/* Header Context / Warrant Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-[rgba(10,15,25,0.7)] border border-[rgba(255,243,199,0.12)]">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-mono text-[#E1C380] uppercase tracking-wider">
                    Nómina de Sospechosos e Identikit
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#FFF3C7]/75 font-mono mt-0.5">
                    Analizá los rasgos y antecedentes para emitir la orden judicial de arresto al culpable.
                  </p>
                </div>

                {/* Warrant Status Notice */}
                {warrantSuspectId ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 font-mono text-xs font-bold animate-pulse">
                    <span>⚖️</span>
                    <span>ORDEN DE CAPTURA ACTIVA</span>
                  </div>
                ) : canIssueWarrant ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                    <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>¡EVIDENCIAS LISTAS PARA ARRESTO!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/35 text-amber-200/90 font-mono text-xs">
                    <span>🔒</span>
                    <span>
                      Necesitás al menos {requiredClues} pistas de testigos (tenés {discoveredClues.length}).
                    </span>
                  </div>
                )}
              </div>

              {/* Suspects Cards Grid (3 Columns on Desktop, High Prominence) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-left">
                {effectiveSuspects && effectiveSuspects.length > 0
                  ? effectiveSuspects.map((suspect, index) => {
                      const isWarrantActive = warrantSuspectId === suspect.id;
                      const suspectImage = resolveSuspectImage(suspect.name, suspect.image);
                      const matchingTraits = matchingTraitsMap.get(suspect.id) ?? new Set<number>();
                      const hasAnyMatch = matchingTraits.size > 0;

                      return (
                        <div
                          key={suspect.id || `suspect-${index}`}
                          className={`
                            group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl
                            bg-gradient-to-b from-[#132032] to-[#0c1522]
                            border-2 transition-all duration-200 shadow-[0_15px_35px_rgba(0,0,0,0.6)]
                            hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85)]
                            ${
                              isWarrantActive
                                ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] ring-2 ring-red-500/50"
                                : hasAnyMatch
                                ? "border-amber-400/50 hover:border-amber-400"
                                : "border-[rgba(255,243,199,0.18)] hover:border-[#E1C380]/60"
                            }
                          `}
                        >
                          {/* Active Warrant Banner Overlay */}
                          {isWarrantActive && (
                            <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-red-600 border border-red-300 text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 z-10 animate-pulse">
                              <span>⚖️</span>
                              <span>ORDEN EMITIDA</span>
                            </div>
                          )}

                          {/* Card Top: Profile Number and Status */}
                          <div className="flex items-center justify-between border-b border-[rgba(255,243,199,0.12)] pb-2.5 mb-3">
                            <span className="font-mono font-bold text-xs sm:text-sm text-amber-400 uppercase tracking-widest">
                              #{String(index + 1).padStart(2, "0")} · PERFIL
                            </span>
                            {hasAnyMatch && !isWarrantActive && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                                {matchingTraits.size} COINCIDENCIA{matchingTraits.size > 1 ? "S" : ""}
                              </span>
                            )}
                          </div>

                          {/* Card Center: Large High-Impact Portrait */}
                          <div className="relative w-full aspect-square max-h-[220px] rounded-xl overflow-hidden bg-black/60 border-2 border-[rgba(255,243,199,0.22)] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] my-2 flex items-center justify-center shrink-0 group-hover:border-amber-400/60 transition-colors">
                            {suspectImage ? (
                              <Image
                                src={suspectImage}
                                alt={suspect.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-[#E1C380]/40">
                                <span className="text-4xl mb-1">👤</span>
                                <span className="text-xs font-mono tracking-wider text-[#FFF3C7]/40">
                                  SIN FOTOGRAFÍA
                                </span>
                              </div>
                            )}

                            {/* Vignette overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                          </div>

                          {/* Suspect Name */}
                          <div className="text-center my-2">
                            <h4 className="text-base sm:text-lg font-bold font-mono text-[#FFF3C7] group-hover:text-amber-300 transition-colors tracking-wide">
                              {suspect.name || `Sospechoso #${index + 1}`}
                            </h4>
                          </div>

                          {/* Traits & Antecedents List */}
                          <div className="flex flex-col gap-2 my-2 pt-3 border-t border-[rgba(255,243,199,0.12)]">
                            <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-[#E1C380]/80 font-bold">
                              Rasgos y Antecedentes:
                            </span>

                            {suspect.description && suspect.description.length > 0 ? (
                              <div className="flex flex-col gap-1.5 min-h-[90px]">
                                {suspect.description.map((trait, tIdx) => {
                                  const isTraitMatched = matchingTraits.has(tIdx);
                                  return (
                                    <div
                                      key={tIdx}
                                      className={`
                                        flex items-center justify-between gap-1.5 text-xs font-mono p-1.5 rounded-lg border transition-colors
                                        ${
                                          isTraitMatched
                                            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                                            : "bg-[rgba(10,15,25,0.6)] border-[rgba(255,243,199,0.08)] text-[#FFF3C7]/90"
                                        }
                                      `}
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        <span className={`font-bold shrink-0 ${isTraitMatched ? "text-emerald-400" : "text-amber-400"}`}>
                                          ›
                                        </span>
                                        <span className="truncate">{trait}</span>
                                      </div>
                                      {isTraitMatched && (
                                        <span className="text-[9px] uppercase font-bold text-emerald-400 shrink-0">
                                          ✓ PISTA
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-xs font-mono text-[#FFF3C7]/40 italic py-2 text-center">
                                Sin rasgos registrados
                              </p>
                            )}
                          </div>

                          {/* Arrest Order Action Button */}
                          <button
                            type="button"
                            onClick={() => handleArrestClick(suspect)}
                            disabled={!canIssueWarrant || isWarrantActive}
                            className={`
                              w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                              font-mono text-xs sm:text-sm font-bold tracking-wider uppercase
                              transition-all duration-150 shadow-md active:scale-[0.98]
                              ${
                                isWarrantActive
                                  ? "bg-red-800/80 border-2 border-red-400 text-white cursor-default"
                                  : canIssueWarrant
                                  ? "bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-400 shadow-[0_10px_25px_rgba(220,38,38,0.4)] cursor-pointer"
                                  : "bg-red-950/25 border border-red-500/20 text-red-200/50 cursor-not-allowed opacity-60"
                              }
                            `}
                          >
                            <div className="relative size-4 sm:size-5 rounded overflow-hidden shrink-0 border border-red-500/40">
                              <Image
                                src="/images/icons/icon_arrestorder.jpg"
                                alt="Orden de arresto"
                                fill
                                sizes="20px"
                                className="object-cover"
                              />
                            </div>
                            <span>
                              {isWarrantActive
                                ? "Orden Activa"
                                : canIssueWarrant
                                ? "Emitir Orden de Arresto"
                                : `Bloqueado (${discoveredClues.length}/${requiredClues} Pistas)`}
                            </span>
                          </button>
                        </div>
                      );
                    })
                  : Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`placeholder-${index}`}
                        className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[rgba(10,15,25,0.5)] border border-[rgba(255,243,199,0.1)] text-center"
                      >
                        <span className="text-3xl mb-2 text-[#E1C380]/40">👤</span>
                        <p className="font-mono text-xs text-[#FFF3C7]/40 uppercase">
                          Expediente #{index + 1} no disponible
                        </p>
                      </div>
                    ))}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* TAB CONTENT: PISTAS Y EVIDENCIAS                                        */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === "clues" && (
            <div className="w-full flex flex-col gap-6 animate-fade-in">
              {/* Header Overview Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-[rgba(10,15,25,0.7)] border border-[rgba(255,243,199,0.12)]">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-mono text-[#E1C380] uppercase tracking-wider">
                    Cuaderno de Notas y Evidencias del Caso
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#FFF3C7]/75 font-mono mt-0.5">
                    Revisá los datos iniciales de la jefatura y las declaraciones recolectadas en los interrogatorios.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-amber-500/15 border border-amber-500/35 text-amber-300">
                    {totalClues} PISTAS REGISTRADAS
                  </span>
                  {canIssueWarrant && (
                    <button
                      type="button"
                      onClick={() => handleTabChange("suspects")}
                      className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-400/60 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <span>⚖️</span>
                      <span>IR A SOSPECHOSOS</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Grid 2 Columns: Left = Briefing & Initial Clues, Right = Witness Evidence Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                {/* Left Column (5 of 12): Briefing & Initial Clues */}
                <div className="lg:col-span-5 flex flex-col gap-5">
                  {/* Case Briefing Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#132032] to-[#0c1522] border-2 border-[rgba(255,243,199,0.18)] shadow-lg flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-[rgba(255,243,199,0.12)] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📁</span>
                        <h4 className="font-mono font-bold text-xs sm:text-sm text-amber-300 uppercase tracking-wider">
                          Informe Policial Inicial
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-red-950/60 border border-red-500/40 text-red-300">
                        CONFIDENCIAL
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#FFF3C7]/90 font-mono leading-relaxed whitespace-pre-line bg-[rgba(10,15,25,0.6)] p-3.5 rounded-xl border border-[rgba(255,243,199,0.08)]">
                      {effectiveBriefing || "Cargando informe del caso..."}
                    </p>
                  </div>

                  {/* Initial Clues from Police HQ */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#132032] to-[#0c1522] border-2 border-[rgba(255,243,199,0.18)] shadow-lg flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-[rgba(255,243,199,0.12)] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🏷️</span>
                        <h4 className="font-mono font-bold text-xs sm:text-sm text-amber-300 uppercase tracking-wider">
                          Pistas del Expediente Inicial
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                        {effectiveInitialClues.length}
                      </span>
                    </div>

                    {effectiveInitialClues.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {effectiveInitialClues.map((clue, idx) => (
                          <div
                            key={`initial-${idx}`}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-[rgba(10,15,25,0.6)] border border-[rgba(255,243,199,0.1)] text-xs font-mono text-[#FFF3C7]/90 leading-relaxed shadow-sm"
                          >
                            <span className="text-amber-400 font-bold text-sm shrink-0">›</span>
                            <span>{clue}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-[#FFF3C7]/40 italic py-2 text-center">
                        No hay pistas iniciales registradas en este caso.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column (7 of 12): Witness Evidence Cards */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#132032] to-[#0c1522] border-2 border-[rgba(255,243,199,0.18)] shadow-lg flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[rgba(255,243,199,0.12)] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🔍</span>
                        <h4 className="font-mono font-bold text-xs sm:text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                          Evidencias Obtenidas de Testigos
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold">
                        {discoveredClues.length} TESTIMONIOS
                      </span>
                    </div>

                    {/* Progress Bar Towards Warrant */}
                    <div className="p-3.5 rounded-xl bg-[rgba(10,15,25,0.7)] border border-[rgba(255,243,199,0.1)] flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#FFF3C7]/75">Progreso para emitir orden judicial de arresto:</span>
                        <span className="font-bold text-amber-300">
                          {Math.min(discoveredClues.length, requiredClues)} / {requiredClues} pistas
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-[rgba(255,243,199,0.15)]">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (discoveredClues.length / requiredClues) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Clues List / Cards */}
                    {discoveredClues.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                        {discoveredClues.map((clue, idx) => (
                          <div
                            key={`disc-${idx}`}
                            className="flex flex-col gap-2 p-3.5 rounded-xl bg-gradient-to-r from-[rgba(10,35,25,0.6)] to-[rgba(10,25,35,0.5)] border border-emerald-500/35 shadow-md hover:border-emerald-400 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                                <span className="text-xs">📜</span>
                                <span>DECLARACIÓN #{String(idx + 1).padStart(2, "0")}</span>
                              </span>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-semibold">
                                EVIDENCIA VERIFICADA
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-mono text-emerald-100/95 leading-relaxed pl-1 border-l-2 border-emerald-500/40">
                              &ldquo;{clue}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[rgba(10,15,25,0.5)] border border-dashed border-[rgba(255,243,199,0.15)] text-center gap-3">
                        <div className="size-14 rounded-2xl bg-[rgba(20,30,42,0.6)] border border-[rgba(255,243,199,0.15)] flex items-center justify-center text-2xl text-slate-400">
                          🕵️‍♂️
                        </div>
                        <div>
                          <h5 className="font-mono text-xs sm:text-sm font-bold text-[#E1C380]">
                            No hay testimonios registrados todavía
                          </h5>
                          <p className="font-mono text-xs text-[#FFF3C7]/60 max-w-sm mt-1 leading-relaxed">
                            Viajá a las locaciones e interrogá a los testigos en cada punto operativo para obtener pistas clave sobre el sospechoso.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. WINDOW FOOTER ACTION BAR                                               */}
        {/* ========================================================================= */}
        <div className="w-full bg-[#060b12] border-t border-[rgba(255,243,199,0.14)] p-3 sm:p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFF3C7]/60">
            <span className="hidden sm:inline">Pestaña activa:</span>
            <span className="text-amber-300 font-bold uppercase">
              {activeTab === "clues" ? "Pistas y Evidencias" : "Nómina de Sospechosos"}
            </span>
          </div>

          <GameButton
            icon="✕"
            label="CERRAR EXPEDIENTE"
            variant="secondary"
            onClick={onClose}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ARREST CONFIRMATION PORTAL MODAL                                       */}
      {/* ========================================================================= */}
      {selectedSuspect && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
          onClick={handleCancelArrest}
        >
          <div
            className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl backdrop-blur-xs border border-red-500/40 bg-[rgba(18,22,32,0.98)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-[#FFF3C7] flex flex-col items-center text-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative size-20 rounded-2xl overflow-hidden border-2 border-red-500/60 bg-black/60 shadow-[0_10px_25px_rgba(239,68,68,0.3)] flex items-center justify-center">
              <Image
                src="/images/icons/icon_arrestorder.jpg"
                alt="Orden de Arresto"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-red-400 font-semibold px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/30">
                Orden Judicial de Captura
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-[#FFF3C7] mt-2">
                ¿Emitir orden de captura para {selectedSuspect.name}?
              </h3>
            </div>

            <p className="text-xs text-[#FFF3C7]/80 font-mono bg-[rgba(10,15,25,0.6)] p-3.5 rounded-xl border border-[rgba(255,243,199,0.12)] leading-relaxed">
              {isFacingCriminal
                ? "¡Estás en el escondite del sospechoso! Esta orden es definitiva: si elegís al culpable correcto, ganás el caso; si te equivocás, escapará."
                : "Esta orden es definitiva y vinculante: no podrás cambiar de sospechoso. La captura se ejecutará automáticamente cuando localices su escondite."}
            </p>

            {warrantError && (
              <p className="w-full text-xs font-mono text-red-300 bg-red-950/50 p-2.5 rounded-xl border border-red-500/40">
                {warrantError}
              </p>
            )}

            <div className="flex flex-row gap-3 w-full pt-1">
              <button
                type="button"
                onClick={handleConfirmArrest}
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-400/60 shadow-[0_10px_25px_rgba(220,38,38,0.4)] transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <span>✓</span>
                <span>{submitting ? "EMITIENDO..." : "SÍ, EMITIR"}</span>
              </button>

              <button
                type="button"
                onClick={handleCancelArrest}
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-[rgba(20,30,42,0.6)] hover:bg-[rgba(255,243,199,0.1)] text-[#FFF3C7]/80 hover:text-[#FFF3C7] border border-[rgba(255,243,199,0.2)] transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <span>✕</span>
                <span>CANCELAR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
