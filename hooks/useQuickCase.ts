"use client";

import { useCallback, useEffect, useState } from "react";
import { audioManager } from "@/lib/audioManager";

export type QuickClue = {
  testimony: string;
  answer: string; // nombre de provincia (clave de lib/mapCalibration)
  options: string[];
  explanation: string;
};

// Pistas de pura geografía: no salen de ningún caso real (no spoilean nada)
export const QUICK_CLUES: QuickClue[] = [
  {
    testimony: "Pidió un mate con yerba de la tierra colorada y preguntó cómo llegar a las cataratas.",
    answer: "misiones",
    options: ["mendoza", "misiones", "santa cruz"],
    explanation: "La tierra colorada, la yerba y las cataratas del Iguazú apuntaban a Misiones.",
  },
  {
    testimony: "Se llevó tres botellas de Malbec y no paraba de mirar el Aconcagua por la ventana.",
    answer: "mendoza",
    options: ["chaco", "buenos aires", "mendoza"],
    explanation: "El Malbec y el Aconcagua son de Mendoza.",
  },
  {
    testimony: "Compró un abrigo de pluma y un pasaje para ver el glaciar Perito Moreno.",
    answer: "santa cruz",
    options: ["santa cruz", "salta", "corrientes"],
    explanation: "El glaciar Perito Moreno está en Santa Cruz.",
  },
  {
    testimony: "Se subió al Tren a las Nubes con una empanada en cada mano.",
    answer: "salta",
    options: ["la pampa", "salta", "chubut"],
    explanation: "El Tren a las Nubes sale de Salta.",
  },
];

const TIME_LIMIT_MS = 30_000;

// Máquina de estados del caso relámpago
export type QuickCaseState =
  | { phase: "playing"; clue: number; endsAt: number }
  | { phase: "won"; clue: number; picked: string }
  | { phase: "lost"; clue: number; picked: string | null }; // picked null = se acabó el tiempo

export function useQuickCase() {
  const [state, setState] = useState<QuickCaseState>(() => ({ phase: "playing", clue: 0, endsAt: Date.now() + TIME_LIMIT_MS }));
  const [now, setNow] = useState(() => Date.now());

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
      const won = province === QUICK_CLUES[state.clue].answer;
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
    setState((s) => ({ phase: "playing", clue: (s.clue + 1) % QUICK_CLUES.length, endsAt: t + TIME_LIMIT_MS }));
  }, []);

  const secondsLeft = state.phase === "playing" ? Math.max(0, Math.ceil((state.endsAt - now) / 1000)) : 0;

  return { state, clue: QUICK_CLUES[state.clue], secondsLeft, pick, next };
}
