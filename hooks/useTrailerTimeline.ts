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

export function useTrailerTimeline(scenes: TimelineScene[]) {
  const [state, setState] = useState<TrailerState>({ phase: "poster" });
  const [now, setNow] = useState(0);

  const starts = useMemo(() => {
    const acc: number[] = [];
    scenes.reduce((sum, s) => (acc.push(sum), sum + s.ms), 0);
    return acc;
  }, [scenes]);
  const total = useMemo(() => scenes.reduce((sum, s) => sum + s.ms, 0), [scenes]);

  const elapsed =
    state.phase === "playing"
      ? Math.min(total, state.offset + Math.max(0, now - state.startedAt))
      : state.phase === "paused"
        ? state.elapsed
        : state.phase === "ended"
          ? total
          : 0;

  let scene = starts.findIndex((start, i) => elapsed >= start && elapsed < start + scenes[i].ms);
  if (scene === -1) scene = scenes.length - 1;
  const sceneElapsed = elapsed - starts[scene];

  // Reloj mientras se reproduce; al llegar al final, termina
  useEffect(() => {
    if (state.phase !== "playing") return;
    const timer = setInterval(() => {
      const t = performance.now();
      setNow(t);
      if (state.offset + (t - state.startedAt) >= total) setState({ phase: "ended" });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [state, total]);

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

  return { state, scene, sceneElapsed, elapsed, total, starts, play, pause, skip };
}
