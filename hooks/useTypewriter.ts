"use client";

import { useEffect, useState } from "react";
import { audioManager } from "@/lib/audioManager";

export const TYPE_MS = 50;

/** Duración total de tipear un texto (para dimensionar el paso de la secuencia) */
export function typingDuration(text: string, pauseMs = 350): number {
  return text.length * TYPE_MS + pauseMs;
}

/**
 * Escribe `text` letra por letra con sonido de máquina mientras `active` sea true.
 * Con `complete` devuelve el texto entero (al saltear la animación).
 */
export function useTypewriter(text: string, active: boolean, complete: boolean): string {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || complete || count >= text.length) return;
    const timer = setTimeout(() => {
      if (text[count] !== " ") audioManager.play("typewriter");
      setCount((c) => c + 1);
    }, TYPE_MS);
    return () => clearTimeout(timer);
  }, [active, complete, count, text]);

  return complete ? text : text.slice(0, count);
}
