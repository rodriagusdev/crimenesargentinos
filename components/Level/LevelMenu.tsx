"use client";

<<<<<<< HEAD
import { usePathname, useRouter } from "next/navigation";
=======
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppPathname } from "@/hooks/useAppPathname";
>>>>>>> ae55200a7b6eb941d2f4bf1d16c2087db019adc1
import { useEffect, useState } from "react";
import { MENU_ACTIONS } from "@/data/menuActions";
import { abandonSession } from "@/services/gameSessionService";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { audioManager } from "@/lib/audioManager";
import { clearAllBriefingSeenFlags } from "@/lib/briefingStorage";
import { useT } from "@/hooks/useT";
import { useLevelMenuData } from "@/hooks/useLevelMenuData";
import { levelMenuMessages } from "./LevelMenu.messages";
import LevelMenuHeader from "./LevelMenuHeader";
import RestartConfirmModal from "./RestartConfirmModal";
import LevelMenuActionButton from "../buttons/LevelMenuActionButton";

import dynamic from "next/dynamic";

import { useShallow } from "zustand/react/shallow";

// El tablero de investigación (pesado) se descarga recién al abrirlo
const CaseDossierModal = dynamic(() => import("./CaseDossierModal"), { ssr: false });

interface LevelMenuProps {
  levelId: number;
}

export default function LevelMenu({ levelId }: LevelMenuProps) {
  const router = useRouter();
<<<<<<< HEAD
  const pathname = usePathname();
=======
  const pathname = useAppPathname();
  const playTypewriter = useTypewriterSound();
>>>>>>> ae55200a7b6eb941d2f4bf1d16c2087db019adc1
  const t = useT(levelMenuMessages);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  // Pantalla en la que se abrieron los paneles locales (tablero / confirmación)
  const [panelsPathname, setPanelsPathname] = useState(pathname);

  const {
    discoveredClues,
    resetSession,
    currentTime,
    currentPI,
    isOpen,
    setIsOpen,
    closeMenu,
  } = useGameSessionStore(
    useShallow((state) => ({
      discoveredClues: state.discoveredClues,
      resetSession: state.resetSession,
      currentTime: state.currentTime,
      currentPI: state.currentPI,
      isOpen: state.isInvestigationMenuOpen,
      setIsOpen: state.setInvestigationMenuOpen,
      closeMenu: state.closeInvestigationMenu,
    }))
  );

  const {
    briefing: displayBriefing,
    initialClues: displayInitialClues,
    suspects: displaySuspects,
  } = useLevelMenuData(levelId);

  // El menú vive en el layout y no se desmonta al navegar: se cierran sus paneles al cambiar de pantalla
  // (los locales se ajustan durante el render; el menú desplegable vive en el store)
  if (panelsPathname !== pathname) {
    setPanelsPathname(pathname);
    setDossierOpen(false);
    setShowRestartConfirm(false);
  }

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

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

  const totalCluesCount = discoveredClues.length + displayInitialClues.length;

  return (
    <>
      <aside className="mt-3 sm:mt-4 xl:mt-6 ml-3 sm:ml-4 xl:ml-6 rounded-2xl z-30 absolute left-0 top-0 w-[360px] md:w-[380px] xl:w-[480px] max-w-[calc(100vw-2rem)] backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-[#FFF3C7] overflow-hidden">
        <LevelMenuHeader
          levelId={levelId}
          currentTime={currentTime}
          currentPI={currentPI}
          isOpen={isOpen}
          onToggle={() => {
            const next = !isOpen;
            if (next) {
              audioManager.play("opencasefile");
            }
            setIsOpen(next);
          }}
        />

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
              {MENU_ACTIONS.map((action) => (
                <LevelMenuActionButton
                  key={action.id}
                  action={action}
                  cluesCount={totalCluesCount}
                  onClick={() => {
                    audioManager.play("opencasefile");
                    setIsOpen(false);
                    setDossierOpen(true);
                  }}
                />
              ))}
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
      {showRestartConfirm && (
        <RestartConfirmModal
          isRestarting={isRestarting}
          onConfirm={handleRestartLevel}
          onCancel={() => setShowRestartConfirm(false)}
        />
      )}
    </>
  );
}
