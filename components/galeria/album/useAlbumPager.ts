"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { audioManager } from "@/lib/audioManager";

export type TurnDir = "next" | "prev";

/** Hojeo del álbum: quieto en una página (null = la de inicio) o dando vuelta una hoja */
export type PagerState = { kind: "idle"; index: number | null } | { kind: "turning"; from: number; to: number; dir: TurnDir };

const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Paginador con vuelta de hoja: botones, flechas del teclado y fin de animación */
export function useAlbumPager(pageCount: number, startIndex: number) {
  const [state, setState] = useState<PagerState>({ kind: "idle", index: null });
  const current = state.kind === "turning" ? state.to : Math.min(state.index ?? startIndex, pageCount - 1);

  const go = (target: number) => {
    if (state.kind === "turning" || target === current || target < 0 || target >= pageCount) return;
    audioManager.play("slide");
    // Con movimiento reducido, cambio instantáneo
    if (prefersReducedMotion()) setState({ kind: "idle", index: target });
    else setState({ kind: "turning", from: current, to: target, dir: target > current ? "next" : "prev" });
  };

  const finish = () => {
    if (state.kind === "turning") setState({ kind: "idle", index: state.to });
  };

  const reset = () => setState({ kind: "idle", index: null });

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(current + 1);
    if (e.key === "ArrowLeft") go(current - 1);
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return { state, current, go, finish, reset };
}
