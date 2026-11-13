"use client";

import { useCallback, useEffect, useState } from "react";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Cuántos caracteres de un texto de `total` caracteres ya escribió la máquina. Arranca de cero (o completo con
 * movimiento reducido) y avanza de a `step` caracteres. Solo se usa en el parte, que se monta del lado del cliente.
 */
export function useTypewriter(total: number, step = 2, speedMs = 22) {
  const [shown, setShown] = useState(() => (reducedMotion() ? total : 0));

  useEffect(() => {
    if (shown >= total) return;
    const id = setTimeout(() => setShown((s) => Math.min(total, s + step)), speedMs);
    return () => clearTimeout(id);
  }, [shown, total, step, speedMs]);

  const skip = useCallback(() => setShown(total), [total]);
  return { shown, done: shown >= total, skip };
}
