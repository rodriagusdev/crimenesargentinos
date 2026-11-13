"use client";

import { useCallback, useEffect, useState } from "react";
import { audioManager } from "@/lib/audioManager";
import { defineMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";
import { useLocale } from "@/stores/useLocaleStore";

export type QuickClue = {
  testimony: string;
  answer: string; // nombre de provincia (clave de lib/mapCalibration)
  options: string[];
  explanation: string;
};

// Pistas de pura geografía: no salen de ningún caso real (no spoilean nada)
const clueTexts = defineMessages({
  es: {
    testimony0: "Pidió un mate con yerba de la tierra colorada y preguntó cómo llegar a las cataratas.",
    explanation0: "La tierra colorada, la yerba y las cataratas del Iguazú apuntaban a Misiones.",
    testimony1: "Se llevó tres botellas de Malbec y no paraba de mirar el Aconcagua por la ventana.",
    explanation1: "El Malbec y el Aconcagua son de Mendoza.",
    testimony2: "Compró un abrigo de pluma y un pasaje para ver el glaciar Perito Moreno.",
    explanation2: "El glaciar Perito Moreno está en Santa Cruz.",
    testimony3: "Se subió al Tren a las Nubes con una empanada en cada mano.",
    explanation3: "El Tren a las Nubes sale de Salta.",
  },
  en: {
    testimony0: "Asked for a mate brewed with yerba from the red-earth country and how to get to the falls.",
    explanation0: "The red earth, the yerba and the Iguazú Falls all pointed to Misiones.",
    testimony1: "Walked off with three bottles of Malbec and kept staring at Aconcagua through the window.",
    explanation1: "Malbec and Aconcagua both belong to Mendoza.",
    testimony2: "Bought a down jacket and a ticket to see the Perito Moreno Glacier.",
    explanation2: "The Perito Moreno Glacier is in Santa Cruz.",
    testimony3: "Hopped on the Tren a las Nubes with an empanada in each hand.",
    explanation3: "The Tren a las Nubes departs from Salta.",
  },
});

type ClueIndex = 0 | 1 | 2 | 3;

const QUICK_CLUE_ANSWERS: { index: ClueIndex; answer: string; options: string[] }[] = [
  { index: 0, answer: "misiones", options: ["mendoza", "misiones", "santa cruz"] },
  { index: 1, answer: "mendoza", options: ["chaco", "buenos aires", "mendoza"] },
  { index: 2, answer: "santa cruz", options: ["santa cruz", "salta", "corrientes"] },
  { index: 3, answer: "salta", options: ["la pampa", "salta", "chubut"] },
];

function localizedClue(clue: number, locale: Locale): QuickClue {
  const { index, answer, options } = QUICK_CLUE_ANSWERS[clue];
  const texts = clueTexts[locale];
  return { testimony: texts[`testimony${index}`], answer, options, explanation: texts[`explanation${index}`] };
}

const TIME_LIMIT_MS = 30_000;

// Máquina de estados del caso relámpago
export type QuickCaseState =
  | { phase: "playing"; clue: number; endsAt: number }
  | { phase: "won"; clue: number; picked: string }
  | { phase: "lost"; clue: number; picked: string | null }; // picked null = se acabó el tiempo

export function useQuickCase() {
  const [state, setState] = useState<QuickCaseState>(() => ({ phase: "playing", clue: 0, endsAt: Date.now() + TIME_LIMIT_MS }));
  const [now, setNow] = useState(() => Date.now());
  const locale = useLocale();

  // Reloj: corre solo mientras se juega; al llegar a cero, el sospechoso se escapa
  useEffect(() => {
    if (state.phase !== "playing") return;
    const endsAt = state.endsAt;
    const clue = state.clue;
    const timer = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endsAt) {
        audioManager.play("defeat");
        setState({ phase: "lost", clue, picked: null });
      }
    }, 250);
    return () => clearInterval(timer);
  }, [state]);

  const pick = useCallback(
    (province: string) => {
      if (state.phase !== "playing") return;
      const won = province === QUICK_CLUE_ANSWERS[state.clue].answer;
      audioManager.play(won ? "winning" : "defeat");
      setState(won ? { phase: "won", clue: state.clue, picked: province } : { phase: "lost", clue: state.clue, picked: province });
    },
    [state],
  );

  // Otro caso: la pista siguiente, con el reloj de nuevo en 30 segundos
  const next = useCallback(() => {
    audioManager.play("click");
    const t = Date.now();
    setNow(t);
    setState((s) => ({ phase: "playing", clue: (s.clue + 1) % QUICK_CLUE_ANSWERS.length, endsAt: t + TIME_LIMIT_MS }));
  }, []);

  const secondsLeft = state.phase === "playing" ? Math.max(0, Math.ceil((state.endsAt - now) / 1000)) : 0;

  return { state, clue: localizedClue(state.clue, locale), secondsLeft, pick, next };
}
