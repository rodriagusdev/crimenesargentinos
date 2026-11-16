"use client";

import Image from "next/image";
import { ISuspect } from "@/models/ISuspect";
import { useAudioStore } from "@/stores/useAudioStore";
import { useT } from "@/hooks/useT";
import { caseDossierModalMessages } from "./CaseDossierModal.messages";

interface ArrestConfirmModalProps {
  suspect: ISuspect;
  isFacingCriminal: boolean;
  submitting: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

// Confirmación de la orden de captura sobre un sospechoso (por encima del tablero)
export default function ArrestConfirmModal({
  suspect,
  isFacingCriminal,
  submitting,
  error,
  onConfirm,
  onCancel,
}: ArrestConfirmModalProps) {
  const playSfx = useAudioStore((state) => state.playSfx);
  const t = useT(caseDossierModalMessages);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md max-h-[90svh] overflow-y-auto p-5 sm:p-7 rounded-2xl backdrop-blur-xs border border-red-500/40 bg-[rgba(18,22,32,0.98)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-[#FFF3C7] flex flex-col items-center text-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative size-20 rounded-2xl overflow-hidden border-2 border-red-500/60 bg-black/60 shadow-[0_10px_25px_rgba(239,68,68,0.3)] flex items-center justify-center">
          <Image
            src="/images/icons/icon_arrestorder.jpg"
            alt={t("arrestWarrant")}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div>
          <span className="text-[10px] font-mono tracking-widest text-red-400 font-semibold px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/30">
            {t("courtWarrant")}
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-mono text-[#FFF3C7] mt-2 break-words">
            {t("confirmQuestion", { name: suspect.name })}
          </h3>
        </div>

        <p className="text-xs text-[#FFF3C7]/80 font-mono bg-[rgba(10,15,25,0.6)] p-3.5 rounded-xl border border-[rgba(255,243,199,0.12)] leading-relaxed">
          {isFacingCriminal
            ? t("finalAtHideout")
            : t("finalBinding")}
        </p>

        {error && (
          <p className="w-full text-xs font-mono text-red-300 bg-red-950/50 p-2.5 rounded-xl border border-red-500/40">
            {error}
          </p>
        )}

        <div className="flex flex-row gap-3 w-full pt-1">
          <button
            type="button"
            onClick={onConfirm}
            onMouseEnter={() => playSfx("typewriter")}
            disabled={submitting}
            className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-400/60 shadow-[0_10px_25px_rgba(220,38,38,0.4)] transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <span>✓</span>
            <span>{submitting ? t("issuing") : t("confirmIssue")}</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            onMouseEnter={() => playSfx("typewriter")}
            disabled={submitting}
            className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-[rgba(20,30,42,0.6)] hover:bg-[rgba(255,243,199,0.1)] text-[#FFF3C7]/80 hover:text-[#FFF3C7] border border-[rgba(255,243,199,0.2)] transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <span>✕</span>
            <span>{t("cancel")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
