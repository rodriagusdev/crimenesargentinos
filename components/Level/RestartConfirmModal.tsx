"use client";

import { createPortal } from "react-dom";
import { useT } from "@/hooks/useT";
import { levelMenuMessages } from "./LevelMenu.messages";

interface RestartConfirmModalProps {
  isRestarting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Confirmación para abandonar el caso y volver al menú principal
export default function RestartConfirmModal({ isRestarting, onConfirm, onCancel }: RestartConfirmModalProps) {
  const t = useT(levelMenuMessages);

  if (typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md max-h-[calc(100svh-2rem)] overflow-y-auto backdrop-blur-xs border border-red-500/30 bg-[rgba(18,22,32,0.95)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] rounded-2xl p-5 sm:p-7 flex flex-col items-center text-center text-[#FFF3C7] gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-3xl shadow-inner">
          ↩
        </div>

        <h3 className="text-sm sm:text-xl font-bold font-mono text-[#FFF3C7] leading-snug">
          {t("confirmTitle")}
        </h3>

        <p className="text-[10px] sm:text-xs text-[#FFF3C7]/80 font-mono bg-[rgba(10,15,25,0.6)] p-3.5 rounded-xl border border-[rgba(255,243,199,0.12)] leading-relaxed">
          {t("confirmBody")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-1">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isRestarting}
            className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-400/60 shadow-[0_10px_25px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.6)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>✓</span>
            <span>{isRestarting ? t("leaving") : t("confirmYes")}</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isRestarting}
            className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-[rgba(20,30,42,0.6)] hover:bg-[rgba(255,243,199,0.1)] text-[#FFF3C7]/80 hover:text-[#FFF3C7] border border-[rgba(255,243,199,0.2)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>✕</span>
            <span>{t("cancel")}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
