"use client";

import { useCallback, useEffect, useReducer } from "react";
import { audioManager } from "@/lib/audioManager";

export const CASE_LABEL = "EXPTE. N° 0001 — REP. ARGENTINA";

// Máquina de estados del splash: cada fase avanza sola por tiempo, o el jugador la saltea.
export type SplashState =
  | { phase: "dark" }
  | { phase: "lamp" }
  | { phase: "typing"; typed: number }
  | { phase: "opening" }
  | { phase: "ready" }
  | { phase: "exiting" };

export type SplashPhase = SplashState["phase"];

const PHASE_ORDER: SplashPhase[] = ["dark", "lamp", "typing", "opening", "ready", "exiting"];

/** true si la secuencia ya llegó (o pasó) la fase indicada */
export function reached(state: SplashState, phase: SplashPhase): boolean {
  return PHASE_ORDER.indexOf(state.phase) >= PHASE_ORDER.indexOf(phase);
}

type SplashAction = { type: "next" } | { type: "type" } | { type: "skip" } | { type: "exit" };

function reducer(state: SplashState, action: SplashAction): SplashState {
  switch (action.type) {
    case "next":
      if (state.phase === "dark") return { phase: "lamp" };
      if (state.phase === "lamp") return { phase: "typing", typed: 0 };
      if (state.phase === "typing") return { phase: "opening" };
      if (state.phase === "opening") return { phase: "ready" };
      return state;
    case "type":
      return state.phase === "typing" ? { phase: "typing", typed: state.typed + 1 } : state;
    case "skip":
      return reached(state, "ready") ? state : { phase: "ready" };
    case "exit":
      return state.phase === "exiting" ? state : { phase: "exiting" };
  }
}

const DARK_MS = 1100;
const LAMP_MS = 900;
const KEY_MS = 50;
const OPENING_MS = 1500;
const EXIT_MS = 900;

export function useSplashSequence(onFinish: () => void) {
  const [state, dispatch] = useReducer(reducer, { phase: "dark" });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    switch (state.phase) {
      case "dark":
        timer = setTimeout(() => dispatch({ type: "next" }), DARK_MS);
        break;
      case "lamp":
        audioManager.play("click", { playbackRate: 0.6 });
        timer = setTimeout(() => dispatch({ type: "next" }), LAMP_MS);
        break;
      case "typing":
        if (state.typed < CASE_LABEL.length) {
          timer = setTimeout(() => {
            if (CASE_LABEL[state.typed] !== " ") audioManager.play("typewriter");
            dispatch({ type: "type" });
          }, KEY_MS);
        } else {
          timer = setTimeout(() => dispatch({ type: "next" }), 350);
        }
        break;
      case "opening":
        audioManager.play("opencasefile");
        timer = setTimeout(() => dispatch({ type: "next" }), OPENING_MS);
        break;
      case "exiting":
        audioManager.play("stamp");
        timer = setTimeout(onFinish, EXIT_MS);
        break;
    }

    return () => clearTimeout(timer);
  }, [state, onFinish]);

  // Cualquier tecla o clic: primero saltea la animación, después entra al cuartel. Escape sale directo.
  const advance = useCallback(() => {
    dispatch(reached(state, "ready") ? { type: "exit" } : { type: "skip" });
  }, [state]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "Escape") dispatch({ type: "exit" });
      else advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  return { state, advance };
}
