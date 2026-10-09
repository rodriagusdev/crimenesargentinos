"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ISuspect } from "@/models/ISuspect";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useAudioStore } from "@/stores/useAudioStore";

interface LevelSuspectsProps {
  suspects?: ISuspect[];
  detail?: string;
  onEmitArrest?: (suspect: ISuspect) => void;
}

export default function LevelSuspects({
  suspects = [],
  detail,
  onEmitArrest,
}: LevelSuspectsProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState<ISuspect | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [warrantError, setWarrantError] = useState<string | null>(null);
  const playSfx = useAudioStore((state) => state.playSfx);

  // La orden la valida y la resuelve el backend: acá solo se muestra su estado
  const session = useGameSessionStore((state) => state.session);
  const discoveredClues = useGameSessionStore((state) => state.discoveredClues);
  const issueArrestWarrant = useGameSessionStore((state) => state.issueArrestWarrant);

  const warrantSuspectId = session?.warrantSuspectId ?? null;
  const canIssueWarrant = Boolean(session?.canIssueWarrant);
  const requiredClues = session?.requiredCluesForWarrant ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasSuspects = suspects && suspects.length > 0;
  const count = hasSuspects ? suspects.length : 3;

  const handleArrestClick = (suspect: ISuspect) => {
    if (!canIssueWarrant) return;
    setWarrantError(null);
    setSelectedSuspect(suspect);
  };

  const handleConfirmArrest = async () => {
    if (!selectedSuspect || submitting) return;

    try {
      setSubmitting(true);
      playSfx("stamp");
      await issueArrestWarrant(selectedSuspect.id);
      onEmitArrest?.(selectedSuspect);
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

  return (
    <>
      <div className="w-full flex flex-col gap-3 mb-6">
        {detail && (
          <p className="text-xs text-[#FFF3C7]/80 leading-relaxed bg-[rgba(10,15,25,0.5)] p-3 rounded-xl border border-[rgba(255,243,199,0.12)]">
            {detail}
          </p>
        )}

        {/* Header bar */}
        <div className="flex items-center justify-between px-1">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-[11px] uppercase tracking-wider text-[#E1C380]/90 font-mono font-semibold">
              Nómina de Sospechosos
            </span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
            {count} PERFILES
          </span>
        </div>

        {/* Estado de la orden de arresto */}
        {warrantSuspectId ? (
          <p className="text-[10px] font-mono text-red-200/90 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
            ⚖️ La orden de arresto ya fue emitida y es definitiva: se ejecuta cuando llegues al escondite del criminal.
          </p>
        ) : (
          !canIssueWarrant && (
            <p className="text-[10px] font-mono text-amber-200/90 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/30">
              🔒 Para emitir la orden de arresto necesitás al menos {requiredClues} pistas de testigos (tenés{" "}
              {discoveredClues.length}).
            </p>
          )
        )}

        {/* Suspects Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[55vh] overflow-y-auto p-1 text-left">
          {hasSuspects
            ? suspects.map((suspect, index) => {
                const isWarrantActive = warrantSuspectId === suspect.id;
                return (
                  <div
                    key={suspect.id || `suspect-${index}`}
                    className={`group relative flex flex-col items-center p-3.5 rounded-xl bg-[rgba(10,15,25,0.65)] border transition-all duration-200 shadow-md ${
                      isWarrantActive
                        ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)] ring-1 ring-red-500/50"
                        : "border-[rgba(255,243,199,0.14)] hover:border-[#E1C380]/40"
                    }`}
                  >
                    {/* Active warrant badge */}
                    {isWarrantActive && (
                      <div className="absolute -top-2.5 right-2 px-2.5 py-0.5 rounded-full bg-red-600 border border-red-300 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 z-10 animate-pulse">
                        <span>⚖️</span>
                        <span>ORDEN EMITIDA</span>
                      </div>
                    )}

                    {/* Photo frame */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black/50 border border-[rgba(255,243,199,0.2)] mb-3 flex items-center justify-center shrink-0 shadow-inner">
                      {suspect.image ? (
                        <Image
                          src={suspect.image}
                          alt={suspect.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#E1C380]/40 group-hover:text-[#E1C380]/70 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-8 stroke-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="text-[9px] font-mono tracking-wider mt-1 text-[#FFF3C7]/40">
                            SIN FOTO
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info & Name */}
                    <div className="w-full text-center mb-2">
                      <span className="block text-[10px] font-mono font-bold text-[#E1C380] uppercase tracking-wider">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                      <h4 className="text-sm font-bold font-mono text-[#FFF3C7] tracking-wide mt-0.5 truncate">
                        {suspect.name || `Sospechoso ${index + 1}`}
                      </h4>
                    </div>

                    {/* Traits / Descriptions */}
                    <div className="w-full flex flex-col gap-1 mt-auto pt-2 border-t border-[rgba(255,243,199,0.1)]">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-[#E1C380]/70 font-semibold text-center mb-1">
                        Rasgos y Antecedentes
                      </span>

                      {suspect.description && suspect.description.length > 0 ? (
                        <div className="flex flex-col gap-1 max-h-24 overflow-y-auto pr-0.5">
                          {suspect.description.map((trait, tIdx) => (
                            <div
                              key={tIdx}
                              className="flex items-start gap-1.5 text-[10px] font-mono text-[#FFF3C7]/90 bg-[rgba(20,30,42,0.5)] p-1.5 rounded border border-[rgba(255,243,199,0.08)] leading-tight"
                            >
                              <span className="text-[#E1C380] font-bold shrink-0">›</span>
                              <span>{trait}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] font-mono text-[#FFF3C7]/40 italic text-center py-1">
                          Sin rasgos registrados
                        </p>
                      )}
                    </div>

                    {/* Arrest order action button */}
                    <button
                      type="button"
                      onClick={() => handleArrestClick(suspect)}
                      disabled={!canIssueWarrant}
                      className={`w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 shadow-md group/btn disabled:cursor-not-allowed ${
                        isWarrantActive
                          ? "bg-red-800/80 border border-red-400 text-white font-bold"
                          : "bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-400 text-red-200 cursor-pointer disabled:opacity-40 disabled:hover:bg-red-950/40 disabled:hover:border-red-500/30"
                      }`}
                    >
                      <div className="relative size-5 rounded overflow-hidden border border-red-500/40 shrink-0">
                        <Image
                          src="/images/icons/icon_arrestorder.jpg"
                          alt="Orden de arresto"
                          fill
                          className="object-cover group-hover/btn:scale-110 transition-transform duration-200"
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                        {isWarrantActive ? "Orden Activa" : "Orden de Arresto"}
                      </span>
                    </button>
                  </div>
                );
              })
            : Array.from({ length: 3 }).map((_, index) => {
              return (
                <div
                  key={`empty-suspect-${index}`}
                  className="group relative flex flex-col items-center p-3.5 rounded-xl bg-[rgba(10,15,25,0.6)] border border-[rgba(255,243,199,0.12)] hover:border-[#E1C380]/40 transition-all duration-200"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black/40 border border-dashed border-[rgba(255,243,199,0.15)] flex flex-col items-center justify-center mb-2.5 text-[#E1C380]/40 group-hover:text-[#E1C380]/70 group-hover:border-[#E1C380]/30 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-8 stroke-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-[9px] font-mono tracking-wider mt-1 text-[#FFF3C7]/40">
                      SIN FOTO
                    </span>
                  </div>

                  <div className="w-full text-center">
                    <span className="block text-[10px] font-mono font-bold text-[#E1C380] uppercase tracking-wider">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[11px] font-mono text-[#FFF3C7]/80 truncate">
                      Sospechoso {index + 1}
                    </p>
                    <span className="inline-block mt-1 text-[9px] font-mono text-[#FFF3C7]/40 bg-[rgba(255,243,199,0.05)] px-1.5 py-0.5 rounded border border-[rgba(255,243,199,0.08)]">
                      Sin datos
                    </span>
                  </div>

                  {/* Arrest order action button for placeholder */}
                  {/* Sin datos del caso no hay a quién emitirle la orden */}
                  <button
                    type="button"
                    disabled
                    className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 shadow-md opacity-40 cursor-not-allowed"
                  >
                    <div className="relative size-5 rounded overflow-hidden border border-red-500/40 shrink-0">
                      <Image
                        src="/images/icons/icon_arrestorder.jpg"
                        alt="Orden de arresto"
                        fill
                        className="object-cover group-hover/btn:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                      Orden de Arresto
                    </span>
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* Confirmation Modal for Arrest Order */}
      {selectedSuspect && mounted && typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
            onClick={handleCancelArrest}
          >
            <div
              className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl backdrop-blur-xs border border-red-500/30 bg-[rgba(18,22,32,0.95)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-[#FFF3C7] flex flex-col items-center text-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Arrest Icon Badge */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-red-500/50 bg-black/50 shadow-[0_10px_25px_rgba(239,68,68,0.25)]">
                <Image
                  src="/images/icons/icon_arrestorder.jpg"
                  alt="Orden de Arresto"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Header / Title */}
              <div>
                <span className="text-[10px] font-mono tracking-widest text-red-400 font-semibold px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/30">
                  Orden Judicial de Captura
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-mono text-[#FFF3C7] mt-2">
                  Emitir orden de arresto para {selectedSuspect.name}
                </h3>
              </div>

              <p className="text-xs text-[#FFF3C7]/80 font-mono bg-[rgba(10,15,25,0.6)] p-3 rounded-xl border border-[rgba(255,243,199,0.12)]">
                ¿Estás seguro de que deseas formalizar la captura de este sospechoso? La orden es definitiva: no se puede cambiar.
              </p>

              {warrantError && (
                <p className="w-full text-xs font-mono text-red-300 bg-red-950/50 p-2.5 rounded-xl border border-red-500/40">
                  {warrantError}
                </p>
              )}

              {/* Action Buttons: Yes / No */}
              <div className="flex flex-row gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={handleConfirmArrest}
                  disabled={submitting}
                  className="disabled:opacity-50 disabled:cursor-wait flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-400/60 shadow-[0_10px_25px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.6)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>✓</span>
                  <span>{submitting ? "EMITIENDO..." : "SÍ"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelArrest}
                  disabled={submitting}
                  className="disabled:opacity-50 flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-[rgba(20,30,42,0.6)] hover:bg-[rgba(255,243,199,0.1)] text-[#FFF3C7]/80 hover:text-[#FFF3C7] border border-[rgba(255,243,199,0.2)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>✕</span>
                  <span>NO</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
