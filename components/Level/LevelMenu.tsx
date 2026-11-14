"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTypewriterSound } from "@/hooks/useTypewriterSound";
import { MENU_ACTIONS } from "@/data/menuActions";
import { IGameData } from "@/models/IGameData";
import { getGameData } from "@/services/levelService";
import { abandonSession } from "@/services/gameSessionService";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { audioManager } from "@/lib/audioManager";
import { clearAllBriefingSeenFlags } from "@/lib/briefingStorage";
import { useT } from "@/hooks/useT";
import { levelMenuMessages } from "./LevelMenu.messages";

import dynamic from "next/dynamic";

import { useShallow } from "zustand/react/shallow";

// El tablero de investigación (pesado) se descarga recién al abrirlo
const CaseDossierModal = dynamic(() => import("./CaseDossierModal"), { ssr: false });

interface LevelMenuProps {
  levelId: number;
}

export default function LevelMenu({ levelId }: LevelMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const playTypewriter = useTypewriterSound();
  const t = useT(levelMenuMessages);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [info, setInfo] = useState<IGameData | null>(null);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const {
    discoveredClues,
    resetSession,
    currentTime,
    currentPI,
    storeLevelId,
    storeBriefing,
    storeInitialClues,
    storeSuspects,
    isOpen,
    setIsOpen,
    closeMenu,
  } = useGameSessionStore(
    useShallow((state) => ({
      discoveredClues: state.discoveredClues,
      resetSession: state.resetSession,
      currentTime: state.currentTime,
      currentPI: state.currentPI,
      storeLevelId: state.levelId,
      storeBriefing: state.briefing,
      storeInitialClues: state.initialClues,
      storeSuspects: state.suspects,
      isOpen: state.isInvestigationMenuOpen,
      setIsOpen: state.setInvestigationMenuOpen,
      closeMenu: state.closeInvestigationMenu,
    }))
  );

  // El menú vive en el layout y no se desmonta al navegar: se cierran sus paneles al cambiar de pantalla
  useEffect(() => {
    closeMenu();
    setDossierOpen(false);
    setShowRestartConfirm(false);
  }, [pathname, closeMenu]);

  const isCurrentLevel = storeLevelId === levelId;
  const displayBriefing = (isCurrentLevel && storeBriefing) ? storeBriefing : info?.info;
  const displayInitialClues = (isCurrentLevel && storeInitialClues && storeInitialClues.length > 0)
    ? storeInitialClues
    : (info?.initialClues ?? []);
  const displaySuspects = (isCurrentLevel && storeSuspects && storeSuspects.length > 0)
    ? storeSuspects
    : (info?.suspects ?? []);

  const handleRestartLevel = async () => {
    try {
      setIsRestarting(true);
      const session = useGameSessionStore.getState().session;
      if (session) {
        try {
          await abandonSession(session.sessionId);
        } catch (err) {
          console.warn("Could not abandon session on backend:", err);
        }
      }
      resetSession();
      clearAllBriefingSeenFlags();
      closeMenu();
      setShowRestartConfirm(false);
      router.push("/principal");
    } catch (err) {
      console.error("Error al volver al menú principal:", err);
      router.push("/principal");
    } finally {
      setIsRestarting(false);
    }
  };

  useEffect(() => {
    // Si ya está en el store del nivel actual, no repetimos la petición innecesariamente
    if (isCurrentLevel && storeBriefing && storeSuspects.length > 0) {
      return;
    }

    let cancelled = false;
    const fetchData = async () => {
      try {
        const infoData = await getGameData(levelId);
        if (!cancelled) {
          setInfo(infoData);
        }
      } catch (error) {
        console.error("Error fetching level data:", error);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [levelId, isCurrentLevel, storeBriefing, storeSuspects.length]);



  return (
    <>
      <aside className="mt-3 sm:mt-4 xl:mt-6 ml-3 sm:ml-4 xl:ml-6 rounded-2xl z-30 absolute left-0 top-0 w-[360px] md:w-[380px] xl:w-[480px] max-w-[calc(100vw-2rem)] backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-[#FFF3C7] overflow-hidden">
        <button
          onClick={() => {
            const next = !isOpen;
            if (next) {
              audioManager.play("opencasefile");
            }
            setIsOpen(next);
          }}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-2 sm:py-3.5 border-b border-[rgba(255,243,199,0.12)] hover:bg-[rgba(255,243,199,0.06)] transition-colors duration-200 cursor-pointer gap-3"
        >
          <div className="flex flex-col text-left shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-[#E1C380]/80 font-mono font-semibold">
              {t("caseNumber", { n: levelId.toString().padStart(2, "0") })}
            </span>
            <h1 className="text-[10px] sm:text-sm font-bold text-[#FFF3C7] leading-tight">
              {t("investigation")}
            </h1>
          </div>

          {/* Recursos de investigación siempre visibles */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[rgba(10,15,25,0.55)] px-2 sm:px-3 py-1.5 rounded-xl border border-[rgba(255,243,199,0.12)] font-mono">
            {/* TIEMPO */}
            <div className="flex items-center gap-1.5" title={t("hoursLeft")}>
              <span className="text-xs">⏳</span>
              <span
                className={`text-[10px] sm:text-xs font-bold ${
                  currentTime <= 12
                    ? "text-red-400 animate-pulse"
                    : "text-[#FFF3C7]"
                }`}
              >
                {currentTime}<span className="hidden sm:inline">{t("hoursUnit")}</span>
              </span>
            </div>

            <div className="h-3.5 w-[1px] bg-[rgba(255,243,199,0.15)]" />

            {/* PUNTOS DE INVESTIGACIÓN */}
            <div className="flex items-center gap-1.5" title={t("pointsTitle")}>
              <span className="text-xs">🔍</span>
              <span
                className={`text-[10px] sm:text-xs font-bold ${
                  currentPI <= 30
                    ? "text-red-400 animate-pulse"
                    : "text-[#FFF3C7]"
                }`}
              >
                {currentPI}<span className="hidden sm:inline">{t("pointsUnit")}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center size-6 rounded-lg bg-[rgba(255,243,199,0.05)] border border-[rgba(255,243,199,0.1)] shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`size-3.5 text-[#E1C380]/70 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[min(500px,calc(100dvh-6rem))] overflow-y-auto opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 sm:px-6 pt-4 pb-5 sm:pb-6 flex flex-col gap-4">
            <h2 className="text-xs uppercase tracking-wider text-[#FFF3C7]/60 font-semibold">
              {t("caseFile")}
            </h2>

            {/* Informe del caso */}
            <div className="rounded-2xl border border-[rgba(255,243,199,0.18)] bg-[rgba(20,30,42,0.6)] backdrop-blur-xs p-4 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3.5 text-[#E1C380] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs uppercase tracking-wider text-[#E1C380]/80 font-mono font-semibold">
                  {t("caseReport")}
                </span>
              </div>
              {displayBriefing ? (
                <p className="text-[10px] sm:text-xs text-[#FFF3C7]/90 leading-relaxed font-mono">
                  {displayBriefing}
                </p>
              ) : (
                <div className="space-y-1.5 animate-pulse">
                  <div className="h-2.5 bg-[rgba(255,243,199,0.15)] rounded w-full" />
                  <div className="h-2.5 bg-[rgba(255,243,199,0.15)] rounded w-4/5" />
                  <div className="h-2.5 bg-[rgba(255,243,199,0.15)] rounded w-3/5" />
                </div>
              )}
            </div>

            {/* Botón principal unificado de investigación */}
            <div className="flex flex-col gap-2">
              {MENU_ACTIONS.map((action) => {
                const totalCluesCount = discoveredClues.length + displayInitialClues.length;
                const actionTitle = action.id === "board" ? t("boardTitle") : action.title;
                const actionDescription = action.id === "board" ? t("boardDescription") : action.description;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => {
                      audioManager.play("opencasefile");
                      setIsOpen(false);
                      setDossierOpen(true);
                    }}
                    onMouseEnter={playTypewriter}
                    title={t("open", { title: actionTitle })}
                    className="
                      w-full p-3 rounded-2xl
                      bg-gradient-to-r from-[rgba(20,30,42,0.85)] via-[rgba(28,42,58,0.9)] to-[rgba(36,26,18,0.85)]
                      hover:from-[rgba(28,44,66,0.95)] hover:to-[rgba(52,36,22,0.95)]
                      border-2 border-amber-500/40 hover:border-amber-400
                      backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)]
                      hover:shadow-[0_14px_36px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.25)]
                      hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group cursor-pointer select-none
                    "
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-400/40 bg-black/40 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-200">
                        <Image
                          src={action.icon}
                          alt={actionTitle}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        <span className="absolute bottom-0 right-0 text-xs">📌</span>
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="font-mono font-bold text-[10px] sm:text-xs text-amber-200 group-hover:text-amber-100 uppercase tracking-wider">
                          {actionTitle}
                        </span>
                        <span className="text-[10px] text-[#FFF3C7]/65 font-mono line-clamp-1">
                          {actionDescription}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-mono font-bold text-amber-300">
                        {totalCluesCount}
                      </span>
                      <span className="text-amber-400 text-xs group-hover:translate-x-1 transition-transform">➔</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volver al menú principal */}
            <div className="pt-2 border-t border-[rgba(255,243,199,0.1)] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowRestartConfirm(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-400 text-red-200 hover:text-red-100 font-mono text-[10px] sm:text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md group"
              >
                <span className="text-sm group-hover:-translate-x-1 transition-transform duration-200">↩</span>
                <span>{t("backToMainMenu")}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Modal unificado del Tablero de Investigación */}
      {dossierOpen && (
        <CaseDossierModal
          isOpen={dossierOpen}
          onClose={() => setDossierOpen(false)}
          levelId={levelId}
          briefing={displayBriefing}
          initialClues={displayInitialClues}
          suspects={displaySuspects}
        />
      )}

      {/* Modal de confirmación para volver al menú principal */}
      {showRestartConfirm && typeof window !== "undefined" && createPortal(
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
                onClick={handleRestartLevel}
                disabled={isRestarting}
                className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-400/60 shadow-[0_10px_25px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.6)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>✓</span>
                <span>{isRestarting ? t("leaving") : t("confirmYes")}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRestartConfirm(false)}
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
      )}
    </>
  );
}
