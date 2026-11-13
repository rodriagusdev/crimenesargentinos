"use client";

import { useSyncExternalStore } from "react";

// Minutos del día en vivo; en el servidor (y antes de hidratar) el reloj marca 10:10, como en las vidrieras
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 10_000);
  return () => clearInterval(id);
};
const readMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
const SERVER_MINUTES = 10 * 60 + 10;

// Reloj de pared de oficina pública, con la hora real
export default function WallClock() {
  const minutes = useSyncExternalStore(subscribe, readMinutes, () => SERVER_MINUTES);
  const hourDeg = ((minutes / 60) % 12) * 30;
  const minuteDeg = (minutes % 60) * 6;
  const label = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

  return (
    <div
      role="img"
      aria-label={`Reloj de pared: ${label}`}
      className="relative size-14 sm:size-20 shrink-0 rounded-full border-4 border-[#2b2117] bg-[#f6f0de] shadow-[0_6px_14px_rgba(0,0,0,0.6),inset_0_0_8px_rgba(0,0,0,0.25)]"
    >
      {[0, 1, 2, 3].map((q) => (
        <span key={q} className="absolute inset-0" style={{ rotate: `${q * 90}deg` }} aria-hidden>
          <span className="absolute left-1/2 top-1 h-1.5 w-0.5 -translate-x-1/2 bg-[#2b2117]" />
        </span>
      ))}
      <span
        className="absolute left-1/2 top-1/2 h-[30%] w-1 -translate-x-1/2 -translate-y-full origin-bottom rounded-full bg-[#2b2117]"
        style={{ rotate: `${hourDeg}deg` }}
        aria-hidden
      />
      <span
        className="absolute left-1/2 top-1/2 h-[40%] w-0.5 -translate-x-1/2 -translate-y-full origin-bottom rounded-full bg-[#2b2117]"
        style={{ rotate: `${minuteDeg}deg` }}
        aria-hidden
      />
      <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c81e1e]" aria-hidden />
    </div>
  );
}
