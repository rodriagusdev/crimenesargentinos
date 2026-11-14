"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, useCallback, useRef, useSyncExternalStore } from "react";
import CaseBriefingSheet from "./CaseBriefingSheet";
import { getGameData } from "@/services/levelService";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { audioManager } from "@/lib/audioManager";


interface CaseBriefingModalProps {
  levelId: number;
  initialInfo?: string;
  onClose?: () => void;
}

// Solo del lado del cliente (el portal necesita document.body)
const noopSubscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

export default function CaseBriefingModal({
  levelId,
  initialInfo,
  onClose,
}: CaseBriefingModalProps) {
  const isClient = useIsClient();
  const [closedLocally, setClosedLocally] = useState<boolean>(false);
  // Info traída del servicio (solo si no vino por props ni está en el store)
  const [fetched, setFetched] = useState<{ levelId: number; info: string } | null>(null);
  // Texto que ya terminó de escribirse (o se salteó): mientras no coincida con el actual, se está tipeando
  const [typedText, setTypedText] = useState<string | null>(null);
  const soundPlayedRef = useRef<boolean>(false);

  const session = useGameSessionStore((state) => state.session);
  const storeBriefing = useGameSessionStore((state) => state.briefing);
  const markBriefingSeen = useGameSessionStore((state) => state.markBriefingSeen);
  const initialClues = useGameSessionStore((state) => state.initialClues);
  const initialTime = useGameSessionStore((state) => state.initialTime);
  const initialPI = useGameSessionStore((state) => state.initialPI);

  // Se muestra únicamente cuando la sesión de la partida indica que el briefing NO ha sido visto todavía
  const shouldShow = isClient && Boolean(session && !session.briefingSeen && !closedLocally);

  const fullText = initialInfo || storeBriefing || (fetched?.levelId === levelId ? fetched.info : "");
  const typing = typedText !== fullText;

  // Reproducir sonido de expediente abierto al mostrarse
  useEffect(() => {
    if (shouldShow && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      audioManager.play("opencasefile");
    }
  }, [shouldShow]);

  // Sin info en props ni en el store: se trae vía servicio
  const needsFetch = shouldShow && !initialInfo && !storeBriefing;
  useEffect(() => {
    if (!needsFetch) return;

    let cancelled = false;
    async function loadInfo() {
      try {
        const data = await getGameData(levelId);
        if (!cancelled && data?.info) {
          setFetched({ levelId, info: data.info });
        }
      } catch (err) {
        console.error("Error al cargar gameData:", err);
      }
    }
    loadInfo();

    return () => {
      cancelled = true;
    };
  }, [levelId, needsFetch]);

  const handleClose = useCallback(async () => {
    setClosedLocally(true);
    try {
      await markBriefingSeen();
    } catch (err) {
      console.error("No se pudo marcar el briefing como visto:", err);
    }
    onClose?.();
  }, [markBriefingSeen, onClose]);

  // Fin del tipeo (o salteo con un toque): se muestra el texto completo
  const handleTyped = useCallback(() => setTypedText(fullText), [fullText]);

  if (!shouldShow) return null;

  return createPortal(
    // Fondo: la oficina a oscuras; tocar afuera (o la hoja) completa el tipeo
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-3 pt-10 sm:p-6 sm:pt-12 bg-black/75 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] backdrop-blur-sm select-none"
      onClick={handleTyped}
    >
      <CaseBriefingSheet
        caseNumber={levelId.toString().padStart(2, "0")}
        hours={initialTime}
        pi={initialPI}
        clues={initialClues}
        text={fullText}
        typing={typing}
        onTyped={handleTyped}
        onSkip={handleTyped}
        onClose={handleClose}
      />
    </div>,
    document.body
  );
}
