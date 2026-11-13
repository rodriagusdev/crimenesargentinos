"use client";

import { useSyncExternalStore } from "react";

// Sello de fecha y hora de las cámaras, en vivo; en el servidor muestra guiones para no romper la hidratación
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const pad = (n: number) => String(n).padStart(2, "0");
const readStamp = () => {
  const d = new Date();
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export function useCrtClock() {
  return useSyncExternalStore(subscribe, readStamp, () => "--/--/---- --:--:--");
}
