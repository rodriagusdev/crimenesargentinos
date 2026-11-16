"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ISuspect } from "@/models/ISuspect";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useAudioStore } from "@/stores/useAudioStore";
import InvestigationBoard from "./InvestigationBoard";
import DossierTitleBar from "./DossierTitleBar";
import ArrestConfirmModal from "./ArrestConfirmModal";
import { useT } from "@/hooks/useT";
import { caseDossierModalMessages } from "./CaseDossierModal.messages";

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
  const [selectedSuspect, setSelectedSuspect] = useState<ISuspect | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [warrantError, setWarrantError] = useState<string | null>(null);

  const playSfx = useAudioStore((state) => state.playSfx);
  const t = useT(caseDossierModalMessages);

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

  // Solo se monta en el cliente (next/dynamic con ssr:false): el portal se puede crear directamente
  if (!isOpen) {
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
      setWarrantError(err instanceof Error ? err.message : t("warrantFailed"));
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
          max-h-[96svh] sm:max-h-[94vh] lg:h-[94vh]
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
        <DossierTitleBar levelId={levelId} isFacingCriminal={isFacingCriminal} onClose={onClose} />

        {/* ========================================================================= */}
        {/* 2. BODY CONTENT: EL TABLERO UNIFICADO DE INVESTIGACIÓN                    */}
        {/* ========================================================================= */}
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden overflow-x-hidden p-2 sm:p-6 lg:p-4 bg-[#0f1a28] custom-scrollbar flex flex-col gap-4">
          {/* Facing Criminal Critical Notice */}
          {isFacingCriminal && (
            <div className="flex items-start sm:items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-red-950/90 via-red-900/80 to-red-950/90 border border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse shrink-0">
              <span className="text-2xl sm:text-3xl shrink-0">🚨</span>
              <div className="flex flex-col gap-0.5 text-left">
                <span className="font-mono font-bold text-xs sm:text-sm text-red-200 uppercase tracking-wider">
                  {t("hideoutFound")}
                </span>
                <span className="font-mono text-[11px] sm:text-xs text-red-100/90 leading-relaxed">
                  {t("hideoutHint")}
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
        <ArrestConfirmModal
          suspect={selectedSuspect}
          isFacingCriminal={isFacingCriminal}
          submitting={submitting}
          error={warrantError}
          onConfirm={handleConfirmArrest}
          onCancel={handleCancelArrest}
        />
      )}
    </div>,
    document.body
  );
}
