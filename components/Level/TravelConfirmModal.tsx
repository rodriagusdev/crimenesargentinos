"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import GameButton from "../buttons/GameButton";

interface TravelConfirmModalProps {
  isOpen: boolean;
  title: string;
  destinationName: string;
  destinationIcon?: string;
  cost: {
    time: number;
    pi: number;
  };
  currentResources: {
    time: number;
    pi: number;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TravelConfirmModal({
  isOpen,
  title,
  destinationName,
  destinationIcon,
  cost,
  currentResources,
  onConfirm,
  onCancel,
}: TravelConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || typeof window === "undefined") {
    return null;
  }

  const hasEnoughTime = currentResources.time >= cost.time;
  const hasEnoughPI = currentResources.pi >= cost.pi;
  const canTravel = hasEnoughTime && hasEnoughPI;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in select-none"
      onClick={onCancel}
    >
      <div
        className="
          relative w-full max-w-md
          p-6 sm:p-7 rounded-2xl
          backdrop-blur-xs
          border border-[rgba(255,243,199,0.18)]
          bg-[rgba(16,24,36,0.92)]
          shadow-[0_20px_50px_rgba(0,0,0,0.7)]
          text-[#FFF3C7]
          flex flex-col items-center text-center gap-4
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono de Destino */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[rgba(255,243,199,0.25)] bg-black/40 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center justify-center">
          {destinationIcon ? (
            <Image
              src={destinationIcon}
              alt={destinationName}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-3xl">📍</span>
          )}
        </div>

        {/* Encabezado */}
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#E1C380]/80 font-semibold">
            {title}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#FFF3C7] mt-0.5">
            {destinationName}
          </h2>
        </div>

        {/* Tarjeta de desglose de costos */}
        <div className="w-full p-4 rounded-xl bg-[rgba(10,15,25,0.6)] border border-[rgba(255,243,199,0.12)] shadow-inner flex flex-col gap-3">
          <p className="text-xs text-[#FFF3C7]/80 font-mono text-center">
            El desplazamiento consumirá los siguientes recursos de investigación:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Costo de Tiempo */}
            <div className="flex flex-col items-center p-2.5 rounded-lg bg-[rgba(28,42,58,0.6)] border border-[rgba(255,243,199,0.1)]">
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                  Tiempo
                </span>
              </div>
              <span className="text-base font-bold font-mono text-red-400">
                -{cost.time} HS
              </span>
              <span className="text-[9px] text-[#FFF3C7]/60 font-mono mt-0.5">
                (Quedan {Math.max(0, currentResources.time - cost.time)} HS)
              </span>
            </div>

            {/* Costo de PI */}
            <div className="flex flex-col items-center p-2.5 rounded-lg bg-[rgba(28,42,58,0.6)] border border-[rgba(255,243,199,0.1)]">
              <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3.5"
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
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                  Investigación
                </span>
              </div>
              <span className="text-base font-bold font-mono text-red-400">
                -{cost.pi} PI
              </span>
              <span className="text-[9px] text-[#FFF3C7]/60 font-mono mt-0.5">
                (Quedan {Math.max(0, currentResources.pi - cost.pi)} PI)
              </span>
            </div>
          </div>

          {!canTravel && (
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 text-[11px] font-mono">
              ⚠️ No tienes suficientes recursos para realizar este viaje.
            </div>
          )}
        </div>

        {/* Botones de Confirmación y Cancelación */}
        <div className="flex flex-col gap-2.5 w-full pt-1">
          <GameButton
            icon="✈️"
            label="CONFIRMAR DESPLAZAMIENTO"
            variant="primary"
            onClick={onConfirm}
            disabled={!canTravel}
          />

          <GameButton
            icon="✕"
            label="CANCELAR"
            variant="secondary"
            onClick={onCancel}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
