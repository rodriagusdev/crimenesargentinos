"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audioManager } from "@/lib/audioManager";

// Cómo llegó la tapa que se ve: al abrir, hojeando hacia un lado u otro, o saltando desde la tira de miniaturas
export type Turn = "open" | "next" | "prev" | "jump";
type Shelf = { index: number; turn: Turn };

const SWIPE_PX = 50;

// Hojear la hemeroteca: flechas en pantalla, flechas del teclado, deslizar el dedo y saltar a una tapa
export function useHemeroteca(count: number) {
  const [shelf, setShelf] = useState<Shelf>({ index: 0, turn: "open" });
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: 1 | -1) => {
      audioManager.play("slide");
      setShelf((s) => ({ index: (s.index + delta + count) % count, turn: delta > 0 ? "next" : "prev" }));
    },
    [count],
  );

  const jump = (index: number) => {
    if (index === shelf.index) return;
    audioManager.play("swoosh");
    setShelf({ index, turn: "jump" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => {
      touchX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      touchX.current = null;
      if (Math.abs(dx) >= SWIPE_PX) go(dx < 0 ? 1 : -1);
    },
  };

  return { ...shelf, go, jump, swipe };
}
