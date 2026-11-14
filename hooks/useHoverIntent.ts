"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Dispara `action(key)` solo si el puntero se queda `delayMs` sobre el elemento.
 * Pasar el mouse por encima de paso (mouseleave antes del delay) no hace nada.
 */
export function useHoverIntent<K>(action: (key: K) => void, delayMs = 150) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionRef = useRef(action);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(
    (key: K) => {
      cancel();
      timer.current = setTimeout(() => {
        timer.current = null;
        actionRef.current(key);
      }, delayMs);
    },
    [cancel, delayMs]
  );

  useEffect(() => cancel, [cancel]);

  return { start, cancel };
}
