"use client";

import { useEffect, useState } from "react";
import type { ScriptLine } from "./script";
import { audioManager } from "@/lib/audioManager";

const CHAR_MS = 32;
const LINE_PAUSE_MS = 650;
const EFFECT_MS = 1400;

export type Broadcast =
  | { status: "idle" }
  | { status: "playing"; line: number; chars: number }
  | { status: "done" };

// Emisión del capítulo: escribe cada línea letra por letra y dispara el efecto de sonido de las líneas [EFECTO]
export function useBroadcast(script: ScriptLine[]) {
  const [state, setState] = useState<Broadcast>({ status: "idle" });
  const line = state.status === "playing" ? state.line : -1;
  const playing = state.status === "playing";

  useEffect(() => {
    if (!playing) return;
    const current = script[line];
    const isEffect = current.kind === "efecto";
    if (isEffect) audioManager.play(current.sfx);

    const typer = isEffect
      ? undefined
      : setInterval(() => {
          setState((s) => (s.status === "playing" && s.line === line ? { ...s, chars: s.chars + 1 } : s));
        }, CHAR_MS);
    const next = setTimeout(
      () => {
        setState((s) => {
          if (s.status !== "playing" || s.line !== line) return s;
          return line + 1 < script.length ? { status: "playing", line: line + 1, chars: 0 } : { status: "done" };
        });
      },
      isEffect ? EFFECT_MS : current.text.length * CHAR_MS + LINE_PAUSE_MS,
    );
    return () => {
      clearInterval(typer);
      clearTimeout(next);
    };
  }, [playing, line, script]);

  const play = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setState(reduced ? { status: "done" } : { status: "playing", line: 0, chars: 0 });
  };
  const stop = () => setState({ status: "idle" });

  return { state, play, stop };
}

/** Cuánto de cada línea se ve según el estado de la emisión (null = todavía no salió al aire) */
export function visibleText(state: Broadcast, script: ScriptLine[], i: number): string | null {
  if (state.status === "done") return script[i].text;
  if (state.status === "idle" || i > state.line) return null;
  if (i < state.line || script[i].kind === "efecto") return script[i].text;
  return script[i].text.slice(0, state.chars);
}
