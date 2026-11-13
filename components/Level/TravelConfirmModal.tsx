"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import GameButton from "../buttons/GameButton";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
  es: {
    intro: "El desplazamiento consumirá los siguientes recursos de investigación:",
    time: "Tiempo",
    hoursCost: "-{n} HS",
    hoursLeft: "(Quedan {n} HS)",
    investigation: "Investigación",
    piCost: "-{n} PI",
    piLeft: "(Quedan {n} PI)",
    confirm: "CONFIRMAR DESPLAZAMIENTO",
    cancel: "CANCELAR",
  },
  en: {
    intro: "This trip will use up the following investigation resources:",
    time: "Time",
    hoursCost: "-{n} HRS",
    hoursLeft: "({n} HRS left)",
    investigation: "Investigation",
    piCost: "-{n} IP",
    piLeft: "({n} IP left)",
    confirm: "CONFIRM TRIP",
    cancel: "CANCEL",
  },
});

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
  loading?: boolean;
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
  loading = false,
  onConfirm,
  onCancel,
}: TravelConfirmModalProps) {
  const [mounted, setMounted] = useState(false);
  const t = useT(messages);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || typeof window === "undefined") {
    return null;
  }

  const canTravel = currentResources.time > 0 && currentResources.pi > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in select-none"
      onClick={onCancel}
    >
      <div
        className="
          relative w-full max-w-md
          max-h-[calc(100svh-2rem)] overflow-y-auto
          p-5 sm:p-7 rounded-2xl
          backdrop-blur-xs
          border border-[rgba(255,243,199,0.18)]
          bg-[rgba(16,24,36,0.92)]
          shadow-[0_20px_50px_rgba(0,0,0,0.7)]
          text-[#FFF3C7]
          flex flex-col items-center text-center gap-3 sm:gap-4
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono de Destino */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 [@media(max-height:500px)_and_(pointer:coarse)]:w-12 [@media(max-height:500px)_and_(pointer:coarse)]:h-12 shrink-0 rounded-2xl overflow-hidden border-2 border-[rgba(255,243,199,0.25)] bg-black/40 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center justify-center">
          {destinationIcon ? (
            <Image
              src={destinationIcon}
              alt={destinationName}
              fill
              sizes="80px"
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
          <h2 className="text-base sm:text-2xl font-bold font-mono text-[#FFF3C7] mt-0.5 break-words leading-snug">
            {destinationName}
          </h2>
        </div>

        {/* Tarjeta de desglose de costos */}
        <div className="w-full p-3 sm:p-4 rounded-xl bg-[rgba(10,15,25,0.6)] border border-[rgba(255,243,199,0.12)] shadow-inner flex flex-col gap-3">
          <p className="text-[10px] sm:text-xs text-[#FFF3C7]/80 font-mono text-center leading-relaxed">
            {t("intro")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1">
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
                  {t("time")}
                </span>
              </div>
              <span className="text-base font-bold font-mono text-red-400">
                {t("hoursCost", { n: cost.time })}
              </span>
              <span className="text-[10px] sm:text-[9px] text-[#FFF3C7]/60 font-mono mt-0.5">
                {t("hoursLeft", { n: Math.max(0, currentResources.time - cost.time) })}
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
                  {t("investigation")}
                </span>
              </div>
              <span className="text-base font-bold font-mono text-red-400">
                {t("piCost", { n: cost.pi })}
              </span>
              <span className="text-[10px] sm:text-[9px] text-[#FFF3C7]/60 font-mono mt-0.5">
                {t("piLeft", { n: Math.max(0, currentResources.pi - cost.pi) })}
              </span>
            </div>
          </div>
        </div>

        {/* Botones de Confirmación y Cancelación */}
        <div className="flex flex-col gap-2.5 w-full pt-1">
          <GameButton
            icon="✈️"
            label={t("confirm")}
            variant="primary"
            className="max-sm:px-3 max-sm:text-[10px]"
            onClick={onConfirm}
            loading={loading}
            disabled={!canTravel || loading}
          />

          <GameButton
            icon="✕"
            label={t("cancel")}
            variant="secondary"
            className="max-sm:px-3 max-sm:text-[10px]"
            onClick={onCancel}
            disabled={loading}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
