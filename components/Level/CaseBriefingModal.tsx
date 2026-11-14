"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import CaseBriefingSheet from "./CaseBriefingSheet";
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
  const initialClues = useGameSessionStore((state) => state.initialClues);
  const initialTime = useGameSessionStore((state) => state.initialTime);
  const initialPI = useGameSessionStore((state) => state.initialPI);

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
    // Fondo: la oficina a oscuras; tocar afuera (o la hoja) completa el tipeo
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-3 pt-10 sm:p-6 sm:pt-12 bg-black/75 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] backdrop-blur-sm select-none"
      onClick={handleSkipTyping}
    >
      <CaseBriefingSheet
        caseNumber={levelId.toString().padStart(2, "0")}
        hours={initialTime}
        pi={initialPI}
        clues={initialClues}
        text={displayedText}
        typing={isTyping}
        onSkip={handleSkipTyping}
        onClose={handleClose}
      />
    </div>,
    document.body
  );
}
