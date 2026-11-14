"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { audioManager, SfxType } from "@/lib/audioManager";

export type TimelineScene = { ms: number; sfx?: SfxType };

// Reproductor del tráiler: póster → reproduciendo ⇄ pausado → terminado
export type TrailerState =
  | { phase: "poster" }
  | { phase: "playing"; startedAt: number; offset: number } // offset = ms ya vistos antes de esta tanda
  | { phase: "paused"; elapsed: number }
  | { phase: "ended" };

const TICK_MS = 50;

/** Duración total de una secuencia de escenas */
export const timelineTotal = (scenes: TimelineScene[]) => scenes.reduce((sum, s) => sum + s.ms, 0);

/** ms vistos del tráiler en el instante `now` (performance.now()) */
export function elapsedAt(state: TrailerState, now: number, total: number): number {
  switch (state.phase) {
    case "playing":
      return Math.min(total, state.offset + Math.max(0, now - state.startedAt));
    case "paused":
      return state.elapsed;
    case "ended":
      return total;
    default:
      return 0;
  }
}

const startPlaying = (): TrailerState => ({ phase: "playing", startedAt: performance.now(), offset: 0 });

/**
 * Línea de tiempo del tráiler. Solo vuelve a renderizar al cambiar de escena o de fase (no en cada tick):
 * lo que necesita el tiempo fino (barra de progreso, contador) se suscribe con `useTimelineElapsed`.
 * Con `autoplay` arranca reproduciendo desde el montaje.
 */
export function useTrailerTimeline(scenes: TimelineScene[], { autoplay = false }: { autoplay?: boolean } = {}) {
  const [state, setState] = useState<TrailerState>(() => (autoplay ? startPlaying() : { phase: "poster" }));
  // Último instante muestreado: se actualiza solo en los cortes de escena
  const [now, setNow] = useState(() => (state.phase === "playing" ? state.startedAt : 0));

  const starts = useMemo(() => {
    const acc: number[] = [];
    scenes.reduce((sum, s) => (acc.push(sum), sum + s.ms), 0);
    return acc;
  }, [scenes]);
  const total = useMemo(() => timelineTotal(scenes), [scenes]);

  const elapsed = elapsedAt(state, now, total);
  let scene = starts.findIndex((start, i) => elapsed >= start && elapsed < start + scenes[i].ms);
  if (scene === -1) scene = scenes.length - 1;

  // Mientras se reproduce, despierta en el próximo corte de escena (o al final, donde termina)
  useEffect(() => {
    if (state.phase !== "playing") return;
    const nextCut = scene + 1 < starts.length ? starts[scene + 1] : total;
    const timer = setTimeout(() => {
      const t = performance.now();
      setNow(t);
      if (state.offset + (t - state.startedAt) >= total) setState({ phase: "ended" });
    }, Math.max(0, nextCut - elapsed));
    return () => clearTimeout(timer);
  }, [state, scene, starts, total, elapsed]);

  // Sonido de cada escena al empezar
  const playing = state.phase === "playing";
  useEffect(() => {
    if (!playing) return;
    const sfx = scenes[scene]?.sfx;
    if (sfx) audioManager.play(sfx);
  }, [playing, scene, scenes]);

  const play = useCallback(() => {
    const t = performance.now();
    setNow(t);
    setState((s) => ({ phase: "playing", startedAt: t, offset: s.phase === "paused" ? s.elapsed : 0 }));
  }, []);

  const pause = useCallback(() => {
    setState((s) => (s.phase === "playing" ? { phase: "paused", elapsed: s.offset + (performance.now() - s.startedAt) } : s));
  }, []);

  const skip = useCallback(() => setState({ phase: "ended" }), []);

  return { state, scene, total, starts, play, pause, skip };
}

/**
 * Tiempo visto, refrescado cada 50 ms mientras se reproduce. Usarlo solo en los componentes chicos que lo muestran
 * (barra de progreso, contador) para que el resto del reproductor no se vuelva a renderizar en cada tick.
 */
export function useTimelineElapsed(state: TrailerState, total: number): number {
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (state.phase !== "playing") return;
    const timer = setInterval(() => setNow(performance.now()), TICK_MS);
    return () => clearInterval(timer);
  }, [state]);

  return elapsedAt(state, now, total);
}
