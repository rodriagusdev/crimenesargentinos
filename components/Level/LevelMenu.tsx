"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTypewriterSound } from "@/hooks/useTypewriterSound";
import IMenuAction from "@/models/IMenuAction";
import { MENU_ACTIONS } from "@/data/menuActions";
import { IGameData } from "@/models/IGameData";
import { getGameData } from "@/services/levelService";
import { abandonSession } from "@/services/gameSessionService";
import { useGameSessionStore } from "@/stores/useGameSessionStore";

import GameButton from "../buttons/GameButton";
import LevelSuspects from "./LevelSuspects";

interface LevelMenuProps {
  levelId: number;
}

export default function LevelMenu({ levelId }: LevelMenuProps) {
  const router = useRouter();
  const playTypewriter = useTypewriterSound();
  const [activeModal, setActiveModal] = useState<IMenuAction | null>(null);
  const [info, setInfo] = useState<IGameData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const discoveredClues = useGameSessionStore((state) => state.discoveredClues);
  const resetSession = useGameSessionStore((state) => state.resetSession);
  const currentTime = useGameSessionStore((state) => state.currentTime);
  const currentPI = useGameSessionStore((state) => state.currentPI);

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
      try {
        Object.keys(sessionStorage).forEach((key) => {
          if (key.endsWith("_briefing_seen")) {
            sessionStorage.removeItem(key);
          }
        });
      } catch {
        // Ignorar errores en SSR
      }
      setIsOpen(false);
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
    const fetchData = async () => {
      try {
        const infoData = await getGameData(levelId);
        setInfo(infoData);
      } catch (error) {
        console.error("Error fetching level data:", error);
      }
    };

    fetchData();
  }, [levelId]);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
      setActiveModal(null);
    };

    window.addEventListener("close-investigation-menu", handleClose);
    return () => {
      window.removeEventListener("close-investigation-menu", handleClose);
    };
  }, []);

  return (
    <>
      <aside className="mt-6 ml-6 rounded-2xl z-100 absolute left-0 top-0 w-[480px] max-w-[calc(100vw-3rem)] backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-20 text-[#FFF3C7] overflow-hidden">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-5 py-3.5 border-b border-[rgba(255,243,199,0.12)] hover:bg-[rgba(255,243,199,0.06)] transition-colors duration-200 cursor-pointer gap-3"
        >
          <div className="flex flex-col text-left shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-[#E1C380]/80 font-mono font-semibold">
              CASO #{levelId.toString().padStart(2, "0")}
            </span>
            <h1 className="text-sm font-bold text-[#FFF3C7] leading-tight">
              Investigación
            </h1>
          </div>

          {/* Recursos de investigación siempre visibles */}
          <div className="flex items-center gap-3 bg-[rgba(10,15,25,0.55)] px-3 py-1.5 rounded-xl border border-[rgba(255,243,199,0.12)] font-mono">
            {/* TIEMPO */}
            <div className="flex items-center gap-1.5" title="Horas restantes de investigación">
              <span className="text-xs">⏳</span>
              <span
                className={`text-xs font-bold ${
                  currentTime <= 12
                    ? "text-red-400 animate-pulse"
                    : "text-[#FFF3C7]"
                }`}
              >
                {currentTime} HS
              </span>
            </div>

            <div className="h-3.5 w-[1px] bg-[rgba(255,243,199,0.15)]" />

            {/* PUNTOS DE INVESTIGACIÓN */}
            <div className="flex items-center gap-1.5" title="Puntos de Investigación (PI)">
              <span className="text-xs">🔍</span>
              <span
                className={`text-xs font-bold ${
                  currentPI <= 30
                    ? "text-red-400 animate-pulse"
                    : "text-[#FFF3C7]"
                }`}
              >
                {currentPI} PTS
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
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pt-4 pb-6 flex flex-col gap-4">
            <h2 className="text-xs uppercase tracking-wider text-[#FFF3C7]/60 font-semibold">
              Expediente del Caso
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
                  Informe del caso
                </span>
              </div>
              {info ? (
                <p className="text-xs text-[#FFF3C7]/90 leading-relaxed font-mono">
                  {info.info}
                </p>
              ) : (
                <div className="space-y-1.5 animate-pulse">
                  <div className="h-2.5 bg-[rgba(255,243,199,0.15)] rounded w-full" />
                  <div className="h-2.5 bg-[rgba(255,243,199,0.15)] rounded w-4/5" />
                  <div className="h-2.5 bg-[rgba(255,243,199,0.15)] rounded w-3/5" />
                </div>
              )}
            </div>

            {/* Lista de acciones */}
            <div className="flex flex-row gap-3 justify-center">
              {MENU_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setActiveModal(action)}
                  onMouseEnter={playTypewriter}
                  className="w-16 p-1 rounded-2xl bg-[rgba(20,30,42,0.6)] hover:bg-[rgba(28,42,58,0.85)] border border-[rgba(255,243,199,0.18)] hover:border-[#E1C380]/40 backdrop-blur-xs shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-200 flex items-center group cursor-pointer"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[rgba(255,243,199,0.12)] bg-black/40 shrink-0">
                    <Image
                      src={action.icon}
                      alt={action.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Volver al menú principal */}
            <div className="pt-2 border-t border-[rgba(255,243,199,0.1)]">
              <button
                type="button"
                onClick={() => setShowRestartConfirm(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-400 text-red-200 hover:text-red-100 font-mono text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md group"
              >
                <span className="text-sm group-hover:-translate-x-1 transition-transform duration-200">↩</span>
                <span>VOLVER AL MENÚ PRINCIPAL</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Modal interactivo al pulsar una acción */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
          <div
            className={`relative w-full ${
              activeModal.id === "suspects" ? "max-w-4xl" : "max-w-xl"
            } max-h-[90vh] overflow-y-auto backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl p-6 flex flex-col items-center text-center text-[#FFF3C7]`}
          >
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[rgba(255,243,199,0.25)] mb-4 shadow-[0_12px_30px_rgba(0,0,0,0.7)] bg-black/50">
              <Image
                src={activeModal.icon}
                alt={activeModal.title}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-xl font-bold text-[#FFF3C7] mb-1">
              {activeModal.title}
            </h3>
            <p className="text-xs uppercase tracking-widest text-[#E1C380]/80 font-mono mb-3">
              CASO #{levelId.toString().padStart(2, "0")}
            </p>

            {activeModal.id === "clues" ? (
              <div className="w-full flex flex-col gap-3 mb-6">
                <p className="text-xs text-[#FFF3C7]/80 leading-relaxed bg-[rgba(10,15,25,0.5)] p-3 rounded-xl border border-[rgba(255,243,199,0.12)]">
                  {activeModal.detail}
                </p>

                <div className="flex flex-col gap-2 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-3.5 text-[#E1C380]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="text-[11px] uppercase tracking-wider text-[#E1C380]/90 font-mono font-semibold">
                        Pistas en el Expediente
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                      {(info?.initialClues?.length ?? 0) + discoveredClues.length} PISTAS
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[rgba(10,15,25,0.6)] border border-[rgba(255,243,199,0.12)] shadow-inner max-h-56 overflow-y-auto">
                    {/* Pistas iniciales */}
                    {info?.initialClues && info.initialClues.length > 0 && (
                      <div className="flex flex-col gap-1.5 mb-1">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-[#E1C380]/60 font-semibold">
                          Pistas del Informe Inicial:
                        </span>
                        {info.initialClues.map((clue, idx) => (
                          <div
                            key={`initial-${idx}`}
                            className="flex items-start gap-2 text-xs font-mono text-[#FFF3C7]/90 leading-relaxed bg-[rgba(20,30,42,0.4)] p-2 rounded-lg border border-[rgba(255,243,199,0.06)]"
                          >
                            <span className="text-[#E1C380] font-bold shrink-0">›</span>
                            <span>{clue}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pistas descubiertas en interrogatorios */}
                    {discoveredClues.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-400/80 font-semibold flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Evidencias Obtenidas de Testigos:
                        </span>
                        {discoveredClues.map((clue, idx) => (
                          <div
                            key={`disc-${idx}`}
                            className="flex items-start gap-2 text-xs font-mono text-emerald-200/95 leading-relaxed bg-[rgba(10,35,25,0.5)] p-2 rounded-lg border border-emerald-500/25"
                          >
                            <span>{clue}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {(!info?.initialClues || info.initialClues.length === 0) &&
                      discoveredClues.length === 0 && (
                        <p className="text-xs font-mono text-[#FFF3C7]/50 italic text-center py-2">
                          No hay pistas registradas todavía.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            ) : activeModal.id === "suspects" ? (
              <LevelSuspects
                suspects={info?.suspects}
                detail={activeModal.detail}
              />
            ) : (
              <p className="text-sm text-[#FFF3C7]/90 leading-relaxed mb-6 bg-[rgba(10,15,25,0.5)] p-4 rounded-2xl border border-[rgba(255,243,199,0.12)] shadow-inner">
                {activeModal.detail}
              </p>
            )}

            <div className="w-full">
              <GameButton
                icon="✕"
                label="CERRAR EXPEDIENTE"
                variant="secondary"
                onClick={() => setActiveModal(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para volver al menú principal */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-md backdrop-blur-xs border border-red-500/30 bg-[rgba(18,22,32,0.95)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center text-[#FFF3C7] gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-3xl shadow-inner">
              ↩
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 font-semibold px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/30">
                Nivel #{levelId.toString().padStart(2, "0")}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-[#FFF3C7] mt-2">
                ¿Volver al menú principal?
              </h3>
            </div>

            <p className="text-xs text-[#FFF3C7]/80 font-mono bg-[rgba(10,15,25,0.6)] p-3.5 rounded-xl border border-[rgba(255,243,199,0.12)] leading-relaxed">
              Esta acción abandonará el caso actual y te llevará al menú principal. Podrás comenzar una nueva investigación desde cero.
            </p>

            <div className="flex flex-row gap-3 w-full pt-1">
              <button
                type="button"
                onClick={handleRestartLevel}
                disabled={isRestarting}
                className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-400/60 shadow-[0_10px_25px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.6)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>✓</span>
                <span>{isRestarting ? "VOLVIENDO..." : "SÍ, VOLVER AL MENÚ"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRestartConfirm(false)}
                disabled={isRestarting}
                className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-[rgba(20,30,42,0.6)] hover:bg-[rgba(255,243,199,0.1)] text-[#FFF3C7]/80 hover:text-[#FFF3C7] border border-[rgba(255,243,199,0.2)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>✕</span>
                <span>CANCELAR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
