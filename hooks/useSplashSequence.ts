"use client";

import { useCallback, useEffect, useReducer } from "react";
import { audioManager, SfxType } from "@/lib/audioManager";

// Un paso de la animación de un splash: cuánto dura y qué sonido dispara al empezar
export type SplashStep = { ms: number; sfx?: SfxType };

// Máquina de estados común a todos los splash: se reproducen los pasos, queda esperando una tecla y sale
export type SplashState = { phase: "playing"; step: number } | { phase: "ready" } | { phase: "exiting" };

type SplashAction = { type: "next"; total: number } | { type: "skip" } | { type: "exit" };

function reducer(state: SplashState, action: SplashAction): SplashState {
  switch (action.type) {
    case "next":
      if (state.phase !== "playing") return state;
      return state.step + 1 < action.total ? { phase: "playing", step: state.step + 1 } : { phase: "ready" };
    case "skip":
      return state.phase === "playing" ? { phase: "ready" } : state;
    case "exit":
      return state.phase === "exiting" ? state : { phase: "exiting" };
  }
}

/** Paso actual de la animación; al saltear o terminar vale `total` (todo revelado) */
export function progressOf(state: SplashState, total: number): number {
  return state.phase === "playing" ? state.step : total;
}

const EXIT_MS = 900;

export function useSplashSequence(steps: SplashStep[], onFinish: () => void) {
  const [state, dispatch] = useReducer(reducer, { phase: "playing", step: 0 });

  useEffect(() => {
    if (state.phase === "playing") {
      const step = steps[state.step];
      if (step.sfx) audioManager.play(step.sfx);
      const timer = setTimeout(() => dispatch({ type: "next", total: steps.length }), step.ms);
      return () => clearTimeout(timer);
    }
    if (state.phase === "exiting") {
      audioManager.play("stamp");
      const timer = setTimeout(onFinish, EXIT_MS);
      return () => clearTimeout(timer);
    }
  }, [state, steps, onFinish]);

  // Cualquier tecla o clic: primero saltea la animación, después entra al cuartel. Escape sale directo.
  const advance = useCallback(() => {
    dispatch(state.phase === "playing" ? { type: "skip" } : { type: "exit" });
  }, [state.phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "Escape") dispatch({ type: "exit" });
      else advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  return { state, progress: progressOf(state, steps.length), advance };
}
