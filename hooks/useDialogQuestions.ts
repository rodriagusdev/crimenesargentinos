"use client";

import { useEffect, useRef, useState } from "react";
import IDialog, { IDialogQuestion } from "@/models/IDialog";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useHintSound } from "@/hooks/useHintSound";

// Tiempo en pantalla de los avisos: costo (5s) y pista (8s)
const COST_TOAST_MS = 5000;
const CLUE_TOAST_MS = 8000;

// Preguntas del interrogatorio: filtra las disponibles, hace la pregunta y maneja los avisos de costo y pista
export function useDialogQuestions(dialog: IDialog) {
  const [costToast, setCostToast] = useState<{ time: number; pi: number } | null>(null);
  const [clueToast, setClueToast] = useState<string | null>(null);
  const [askingQuestionId, setAskingQuestionId] = useState<string | null>(null);
  const costTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clueTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const askingRef = useRef(false);

  const playHintSound = useHintSound();

  const flags = useGameSessionStore((state) => state.flags);
  // Preguntas ya hechas en esta partida (también en visitas anteriores): quedan deshabilitadas
  const askedQuestions = useGameSessionStore((state) => state.askedQuestions);
  const askQuestion = useGameSessionStore((state) => state.askQuestion);

  useEffect(() => {
    return () => {
      if (costTimeoutRef.current) clearTimeout(costTimeoutRef.current);
      if (clueTimeoutRef.current) clearTimeout(clueTimeoutRef.current);
    };
  }, []);

  // Filtra las preguntas: solo muestra las que no tienen requiredFlag o si todos los flags requeridos ya fueron desbloqueados
  const availableQuestions = dialog.questions.filter((q) => {
    if (!q.requiredFlag) return true;
    const required = Array.isArray(q.requiredFlag) ? q.requiredFlag : [q.requiredFlag];
    return required.every((flag) => flags.includes(flag));
  });

  // El servidor cobra (solo la primera vez), desbloquea pistas y flags y guarda la pregunta en el chat
  const onQuestionClicked = async (q: IDialogQuestion) => {
    if (!q.answer || askingRef.current || askedQuestions.includes(q.id)) return;
    askingRef.current = true;
    setAskingQuestionId(q.id);

    useGameSessionStore.getState().closeInvestigationMenu();

    try {
      // La respuesta se agrega al chat de la locación en el store
      const result = await askQuestion(q.id, { locationId: dialog.locationId, question: q.text });

      // Mostrar feedback visual de costo solo cuando se descuenta
      if (result.costCharged && result.cost) {
        if (costTimeoutRef.current) clearTimeout(costTimeoutRef.current);
        setCostToast(result.cost);
        costTimeoutRef.current = setTimeout(() => {
          setCostToast(null);
          costTimeoutRef.current = null;
        }, COST_TOAST_MS);
      }

      // Mostrar feedback visual de pista descubierta
      if (result.newClue) {
        if (clueTimeoutRef.current) clearTimeout(clueTimeoutRef.current);
        setClueToast(result.newClue);
        playHintSound();
        clueTimeoutRef.current = setTimeout(() => {
          setClueToast(null);
          clueTimeoutRef.current = null;
        }, CLUE_TOAST_MS);
      }
    } catch (err) {
      console.error("No se pudo hacer la pregunta:", err);
    } finally {
      askingRef.current = false;
      setAskingQuestionId(null);
    }
  };

  return { costToast, clueToast, askingQuestionId, askedQuestions, availableQuestions, onQuestionClicked };
}
