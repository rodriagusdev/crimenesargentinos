"use client";

import { useSyncExternalStore } from "react";

// Hora en vivo sin problemas de hidratación: en el servidor muestra "--:--:--"
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const readTime = () => new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

export function useWallClock() {
  return useSyncExternalStore(subscribe, readTime, () => "--:--:--");
}
