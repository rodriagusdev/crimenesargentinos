"use client";

import { useSyncExternalStore } from "react";

// Margen para comparar la ventana con la pantalla (bordes, escalado del sistema, zoom)
const TOLERANCE_PX = 4;

/**
 * ¿La página ocupa toda la pantalla? Cubre la pantalla completa que pide el juego (Fullscreen API) y la que activa
 * el jugador (F11 / botón del navegador), que no tiene API: se detecta con display-mode o comparando la ventana
 * con la pantalla. En el servidor devuelve false.
 */
function isFullscreen(): boolean {
  if (document.fullscreenElement) return true;
  if (window.matchMedia("(display-mode: fullscreen)").matches) return true;
  return window.innerHeight >= window.screen.height - TOLERANCE_PX && window.innerWidth >= window.screen.width - TOLERANCE_PX;
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(display-mode: fullscreen)");
  window.addEventListener("resize", onChange);
  document.addEventListener("fullscreenchange", onChange);
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
    document.removeEventListener("fullscreenchange", onChange);
    mq.removeEventListener("change", onChange);
  };
}

export function useIsFullscreen(): boolean {
  return useSyncExternalStore(subscribe, isFullscreen, () => false);
}
