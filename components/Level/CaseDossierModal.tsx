"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ISuspect } from "@/models/ISuspect";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useAudioStore } from "@/stores/useAudioStore";
import GameButton from "../buttons/GameButton";
import InvestigationBoard from "./InvestigationBoard";

interface CaseDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelId: number;
  briefing?: string;
  initialClues?: string[];
  suspects?: ISuspect[];
  isFacingCriminal?: boolean;
}

export default function CaseDossierModal({
  isOpen,
  onClose,
  levelId,
  briefing,
  initialClues = [],
  suspects = [],
  isFacingCriminal = false,
}: CaseDossierModalProps) {
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted || !isOpen || typeof window === "undefined") {
    return null;
  }

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
      className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-3 bg-black/85 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className={`
          relative w-[95vw] max-w-[95vw]
          max-h-[96vh] sm:max-h-[94vh]
          flex flex-col
          rounded-2xl
          bg-[#0a111a]
          border-2 ${isFacingCriminal
            ? "border-red-500/80 shadow-[0_25px_70px_rgba(239,68,68,0.35),0_0_30px_rgba(239,68,68,0.2)]"
            : "border-[rgba(255,243,199,0.2)] shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
          }
          text-[#FFF3C7]
          overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* 1. CHROME / TERMINAL RETRO TITLE BAR (NO TABS)                            */}
        {/* ========================================================================= */}
        <div className="w-full bg-[#060b12] border-b border-[rgba(255,243,199,0.14)] py-3 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 select-none">
          {/* Left section: Window Controls & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-mono font-bold text-xs sm:text-sm text-amber-200 uppercase tracking-wider">
                Tablero de Investigacion del Caso
              </h2>
            </div>
          </div>

          {/* Right section: Case Badge, Clues Count & Window Close Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {isFacingCriminal ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-red-950/80 border border-red-500/70 text-red-300 animate-pulse">
                <span className="size-2 rounded-full bg-red-500 animate-ping" />
                🚨 FRENTE AL CRIMINAL
              </span>
            ) : (
              <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-amber-500/15 border border-amber-500/35 text-amber-300">
                CASO #{levelId.toString().padStart(2, "0")}
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              onMouseEnter={() => playSfx("typewriter")}
              className="size-8 sm:size-9 rounded-xl bg-[rgba(255,243,199,0.06)] hover:bg-red-950/60 border border-[rgba(255,243,199,0.15)] hover:border-red-500/50 flex items-center justify-center text-[#FFF3C7]/70 hover:text-white transition-all duration-150 cursor-pointer shadow-sm active:scale-95"
              title="Cerrar Tablero (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BODY CONTENT: EL TABLERO UNIFICADO DE INVESTIGACIÓN                    */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0f1a28] custom-scrollbar flex flex-col gap-4">
          {/* Facing Criminal Critical Notice */}
          {isFacingCriminal && (
            <div className="flex items-start sm:items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-red-950/90 via-red-900/80 to-red-950/90 border border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse shrink-0">
              <span className="text-2xl sm:text-3xl shrink-0">🚨</span>
              <div className="flex flex-col gap-0.5 text-left">
                <span className="font-mono font-bold text-xs sm:text-sm text-red-200 uppercase tracking-wider">
                  ¡Escondite localizado — Estás frente al criminal!
                </span>
                <span className="font-mono text-[11px] sm:text-xs text-red-100/90 leading-relaxed">
                  Revisá los indicios en el tablero y emití la orden de captura sobre el culpable definitivo para arrestarlo.
                </span>
              </div>
            </div>
          )}

          {/* El Tablero Completo */}
          <InvestigationBoard
            briefing={effectiveBriefing}
            suspects={effectiveSuspects}
            initialClues={effectiveInitialClues}
            discoveredClues={discoveredClues}
            canIssueWarrant={canIssueWarrant}
            warrantSuspectId={warrantSuspectId}
            onEmitArrest={handleArrestClick}
          />
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. ARREST CONFIRMATION PORTAL MODAL                                       */}
      {/* ========================================================================= */}
      {selectedSuspect && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
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
                onMouseEnter={() => playSfx("typewriter")}
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-400/60 shadow-[0_10px_25px_rgba(220,38,38,0.4)] transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <span>✓</span>
                <span>{submitting ? "EMITIENDO..." : "SÍ, EMITIR"}</span>
              </button>

              <button
                type="button"
                onClick={handleCancelArrest}
                onMouseEnter={() => playSfx("typewriter")}
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
