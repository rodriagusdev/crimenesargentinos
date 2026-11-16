"use client";

import { useEffect } from "react";
import { msUntilTokenExpires } from "@/lib/auth";
import { refreshAuthToken } from "@/lib/tokenRefresh";

// Se renueva solo si el jugador hizo algo en los últimos 5 minutos…
const ACTIVITY_WINDOW_MS = 5 * 60 * 1000;
// …y al token le quedan menos de 10 minutos
const RENEW_BEFORE_MS = 10 * 60 * 1000;
// Cada cuánto se revisa
const CHECK_EVERY_MS = 60 * 1000;
// Las señales de actividad se registran como mucho cada 5 s (mover el mouse no cuenta: solo acciones)
const ACTIVITY_THROTTLE_MS = 5 * 1000;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

/**
 * Mientras se juega, renueva el token antes de que venza para no sacar al jugador en plena partida.
 * Solo con actividad real reciente y con la pestaña visible: si dejó la partida quieta o se fue, el token vence
 * como siempre. Se usa en el layout de /level/** (no en /principal ni en otras pantallas).
 */
export function useTokenKeepAlive() {
  useEffect(() => {
    let lastActivity = Date.now();
    let lastMark = 0;

    const markActivity = () => {
      const now = Date.now();
      if (now - lastMark < ACTIVITY_THROTTLE_MS) return;
      lastMark = now;
      lastActivity = now;
    };

    const maybeRenew = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastActivity > ACTIVITY_WINDOW_MS) return;
      const remaining = msUntilTokenExpires();
      // Sin token o ya vencido no se puede renovar (el vigilante de sesión manda al login)
      if (remaining === null || remaining <= 0 || remaining > RENEW_BEFORE_MS) return;
      void refreshAuthToken();
    };

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, markActivity, { passive: true }));
    const interval = setInterval(maybeRenew, CHECK_EVERY_MS);
    // Al volver a la pestaña con actividad reciente, revisar enseguida
    const onVisible = () => document.visibilityState === "visible" && maybeRenew();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, markActivity));
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}
