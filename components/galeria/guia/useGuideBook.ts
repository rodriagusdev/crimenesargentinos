"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { audioManager } from "@/lib/audioManager";

// Libro abierto a doble página desde lg; en pantallas más chicas, una página por vez
const WIDE = "(min-width: 1024px)";
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useWide = () => useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);

// Al saltar lejos (índice o buscador), las hojas pasan de a una, rápido, como al hojear con el pulgar
const RIFFLE_MS = 110;

/** Hoja que se está dando vuelta: dirección y un contador para reiniciar la animación */
type Turn = { dir: "next" | "prev"; n: number };

/** Navegación del libro: qué hojas se ven, vuelta de hoja y hojeo rápido hasta una página */
export function useGuideBook(pageCount: number) {
  const perView = useWide() ? 2 : 1;
  const [first, setFirst] = useState(0);
  const [turn, setTurn] = useState<Turn>({ dir: "next", n: 0 });
  const riffle = useRef<ReturnType<typeof setInterval> | null>(null);

  // Primera página de la vista, alineada a la doble página y dentro del libro
  const lastView = Math.max(0, Math.floor((pageCount - 1) / perView) * perView);
  const view = Math.min(Math.floor(first / perView) * perView, lastView);

  const stopRiffle = () => {
    if (riffle.current) clearInterval(riffle.current);
    riffle.current = null;
  };
  useEffect(() => stopRiffle, []);

  const step = (dir: "next" | "prev", from: number) => {
    const to = dir === "next" ? Math.min(from + perView, lastView) : Math.max(from - perView, 0);
    if (to === from) return from;
    setFirst(to);
    setTurn((t) => ({ dir, n: t.n + 1 }));
    return to;
  };

  return {
    perView,
    view,
    turn,
    canPrev: view > 0,
    canNext: view < lastView,
    flip: (dir: "next" | "prev") => {
      stopRiffle();
      audioManager.play("slide");
      step(dir, view);
    },
    /** Hojea hasta la vista que contiene `page` */
    goTo: (page: number) => {
      stopRiffle();
      const target = Math.floor(Math.min(page, pageCount - 1) / perView) * perView;
      if (target === view) return;
      audioManager.play("slide");
      const dir = target > view ? "next" : "prev";
      let at = view;
      riffle.current = setInterval(() => {
        at = step(dir, at);
        if (at === target || (dir === "next" ? at > target : at < target)) stopRiffle();
      }, RIFFLE_MS);
    },
    /** Vuelve a la primera hoja (al llegar una edición nueva) */
    reset: () => {
      stopRiffle();
      setFirst(0);
    },
  };
}
