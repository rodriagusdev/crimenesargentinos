"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import GameButton from "../buttons/GameButton";
import { getGameData } from "@/services/levelService";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { audioManager } from "@/lib/audioManager";

interface CaseBriefingModalProps {
  levelId: number;
  initialInfo?: string;
  onClose?: () => void;
}

export default function CaseBriefingModal({
  levelId,
  initialInfo,
  onClose,
}: CaseBriefingModalProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [closedLocally, setClosedLocally] = useState<boolean>(false);
  const [fullText, setFullText] = useState<string>(initialInfo ?? "");
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const soundPlayedRef = useRef<boolean>(false);

  const session = useGameSessionStore((state) => state.session);
  const storeBriefing = useGameSessionStore((state) => state.briefing);
  const markBriefingSeen = useGameSessionStore((state) => state.markBriefingSeen);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Se muestra únicamente cuando la sesión de la partida indica que el briefing NO ha sido visto todavía
  const shouldShow = mounted && Boolean(session && !session.briefingSeen && !closedLocally);

  // Reproducir sonido de expediente abierto al mostrarse
  useEffect(() => {
    if (shouldShow && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      audioManager.play("opencasefile");
    }
  }, [shouldShow]);

  // Cargar info del nivel desde el store o vía servicio
  useEffect(() => {
    if (!shouldShow) return;

    if (initialInfo) {
      setFullText(initialInfo);
      return;
    }

    if (storeBriefing) {
      setFullText(storeBriefing);
      return;
    }

    let cancelled = false;
    async function loadInfo() {
      try {
        const data = await getGameData(levelId);
        if (!cancelled && data?.info) {
          setFullText(data.info);
        }
      } catch (err) {
        console.error("Error al cargar gameData:", err);
      }
    }
    loadInfo();

    return () => {
      cancelled = true;
    };
  }, [levelId, initialInfo, storeBriefing, shouldShow]);

  // Efecto máquina de escribir (letra por letra con audioManager)
  useEffect(() => {
    if (!shouldShow || !fullText) return;

    setDisplayedText("");
    setIsTyping(true);

    let currentIndex = 0;
    const typingSpeed = 25; // ms por letra

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        const nextChar = fullText.charAt(currentIndex);
        setDisplayedText((prev) => prev + nextChar);

        if (currentIndex % 3 === 0) {
          audioManager.play("typewriter", { volume: 0.3 });
        }

        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [fullText, shouldShow]);

  const handleClose = useCallback(async () => {
    setClosedLocally(true);
    try {
      await markBriefingSeen();
    } catch (err) {
      console.error("No se pudo marcar el briefing como visto:", err);
    }
    onClose?.();
  }, [markBriefingSeen, onClose]);

  const handleSkipTyping = () => {
    if (isTyping) {
      setDisplayedText(fullText);
      setIsTyping(false);
    }
  };

  if (!shouldShow || typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in select-none"
      onClick={handleSkipTyping}
    >
      <div
        className="
          relative w-full max-w-lg sm:max-w-xl
          p-6 sm:p-8 rounded-2xl
          backdrop-blur-xs
          border border-[rgba(255,243,199,0.18)]
          shadow-[0_20px_50px_rgba(0,0,0,0.6)]
          text-[#FFF3C7]
          flex flex-col gap-5
          cursor-default
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera / Sello de Caso */}
        <div className="flex items-center justify-between border-b border-[rgba(255,243,199,0.12)] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📁</span>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#E1C380]/80 font-mono">
                Expediente Policial
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#E1C380] tracking-wider font-mono">
                CASO #{levelId.toString().padStart(2, "0")} — INFORME
              </h2>
            </div>
          </div>

          <div className="px-3 py-1 rounded-xl border border-red-500/40 bg-red-950/40 text-red-400 font-mono text-[10px] tracking-widest uppercase">
            Confidencial
          </div>
        </div>

        {/* Cuerpo con texto de máquina de escribir */}
        <div className="min-h-[120px] sm:min-h-[140px] p-5 rounded-xl bg-[rgba(10,15,25,0.5)] border border-[rgba(255,243,199,0.12)] shadow-inner flex flex-col justify-between">
          <p className="text-xs sm:text-sm text-[#FFF3C7]/95 font-mono leading-relaxed whitespace-pre-line">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-2 h-4 ml-1 bg-[#E1C380] animate-pulse align-middle" />
            )}
          </p>
        </div>

        {/* Botón de acción */}
        <div className="w-full pt-2">
          <GameButton
            icon="✓"
            label="ENTENDIDO"
            onClick={handleClose}
            disabled={isTyping}
            variant="primary"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
