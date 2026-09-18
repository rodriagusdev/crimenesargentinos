"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import GameButton from "../buttons/GameButton";
import { getInfoPerLevel } from "@/services/levelService";

interface CaseBriefingModalProps {
  levelId: number;
  initialInfo?: string;
  onClose: () => void;
}

export default function CaseBriefingModal({
  levelId,
  initialInfo,
  onClose,
}: CaseBriefingModalProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const [fullText, setFullText] = useState<string>(initialInfo ?? "");
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Verificar si ya fue visto en esta sesión del nivel
  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem(`level_${levelId}_briefing_seen`);
    if (!seen) {
      setShouldShow(true);
    } else {
      onClose();
    }
  }, [levelId, onClose]);

  // Cargar info del nivel si no vino por prop
  useEffect(() => {
    if (!shouldShow) return;

    if (initialInfo) {
      setFullText(initialInfo);
      return;
    }

    let cancelled = false;
    async function loadInfo() {
      try {
        const data = await getInfoPerLevel(levelId);
        if (!cancelled && data?.info) {
          setFullText(data.info);
        }
      } catch (err) {
        console.error("Error al cargar infoPerLevel:", err);
      }
    }
    loadInfo();

    return () => {
      cancelled = true;
    };
  }, [levelId, initialInfo, shouldShow]);

  // Inicializar audio
  useEffect(() => {
    if (!shouldShow) return;
    try {
      const audio = new Audio("/sounds/typewriter.wav");
      audio.volume = 0.08;
      audioRef.current = audio;
    } catch {
      // Ignorar errores de creación de audio
    }
  }, [shouldShow]);

  // Efecto máquina de escribir (letra por letra)
  useEffect(() => {
    if (!shouldShow || !fullText) return;

    setDisplayedText("");
    setIsTyping(true);

    let currentIndex = 0;
    const typingSpeed = 30; // ms por letra

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        const nextChar = fullText.charAt(currentIndex);
        setDisplayedText((prev) => prev + nextChar);

        // Reproducir sonido de tecla periódicamente
        if (currentIndex % 3 === 0 && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => { });
        }

        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [fullText, shouldShow]);

  const handleClose = useCallback(() => {
    try {
      sessionStorage.setItem(`level_${levelId}_briefing_seen`, "true");
    } catch {
      // Ignorar
    }
    onClose();
  }, [levelId, onClose]);

  const handleSkipTyping = () => {
    if (isTyping) {
      setDisplayedText(fullText);
      setIsTyping(false);
    }
  };

  if (!mounted || !shouldShow || typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in select-none"
      onClick={handleSkipTyping}
    >
      <div
        className="
          relative w-full max-w-lg sm:max-w-xl
          p-6 sm:p-8 rounded-2xl
          bg-[rgba(20,30,42,0.95)]
          backdrop-blur-2xl
          border-2 border-[#E1C380]/40
          shadow-[0_25px_60px_rgba(0,0,0,0.85)]
          text-[#FFF3C7]
          flex flex-col gap-5
          cursor-default
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera / Sello de Caso */}
        <div className="flex items-center justify-between border-b border-[#E1C380]/20 pb-4">
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

          <div className="px-3 py-1 rounded border border-red-500/40 bg-red-950/40 text-red-400 font-mono text-[10px] tracking-widest uppercase">
            Confidencial
          </div>
        </div>

        {/* Cuerpo con texto de máquina de escribir */}
        <div className="min-h-[120px] sm:min-h-[140px] p-5 rounded-xl bg-[rgba(10,15,25,0.7)] border border-[rgba(255,243,199,0.1)] shadow-inner flex flex-col justify-between">
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
