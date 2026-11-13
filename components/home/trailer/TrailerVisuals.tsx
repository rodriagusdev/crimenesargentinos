"use client";

import { useEffect, type CSSProperties } from "react";
import SuspectSilhouette from "@/components/splash/SuspectSilhouette";
import { audioManager } from "@/lib/audioManager";
import { getCalibratedProvinceCoordinates } from "@/lib/mapCalibration";

// Escenas del tráiler. Cada una arranca cuando `active` pasa a true (al entrar en pantalla).

export function ClueVisual({ active }: { active: boolean }) {
  return (
    <div
      className={`w-[min(80vw,300px)] p-3.5 pb-5 bg-[#f4efe2] text-[#2a2a2a] shadow-[0_18px_30px_rgba(0,0,0,0.6)] transition-all duration-700 ease-out ${
        active ? "opacity-100 rotate-[-4deg] translate-y-0" : "opacity-0 rotate-[25deg] -translate-y-24"
      }`}
    >
      <div className="relative aspect-[3/2]">
        <SuspectSilhouette variant="fedora" />
      </div>
      <p className="mt-4 font-mono text-base leading-snug">“Lo vi comprando alfajores… tenía un sombrero.”</p>
    </div>
  );
}

// Monitor táctico recortado de la sala (misma proporción que el monitor, para usar la calibración de provincias tal cual)
const MONITOR_BG: CSSProperties = {
  backgroundImage: "url(/images/test_composite.webp)",
  backgroundSize: "161.88% auto",
  backgroundPosition: "50.19% 25.25%",
};
const FROM = getCalibratedProvinceCoordinates({ name: "buenos aires" });
const TO = getCalibratedProvinceCoordinates({ name: "misiones" });

export function MapVisual({ active }: { active: boolean }) {
  useEffect(() => {
    if (active) audioManager.play("plane");
  }, [active]);

  const planeStyle = { "--x1": FROM.left, "--y1": FROM.top, "--x2": TO.left, "--y2": TO.top } as CSSProperties;

  return (
    <div
      className="relative w-full aspect-[1.4927] rounded-xl overflow-hidden border-2 border-sky-300/40 bg-[#0b1a20] bg-no-repeat"
      style={MONITOR_BG}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        <line
          x1={parseFloat(FROM.left)}
          y1={parseFloat(FROM.top)}
          x2={parseFloat(TO.left)}
          y2={parseFloat(TO.top)}
          pathLength={1}
          stroke="#E1C380"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className={`home-route ${active ? "home-route--draw" : ""}`}
        />
      </svg>
      {[FROM, TO].map((p, i) => (
        <span
          key={i}
          className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 border-2 border-[#FFF3C7] shadow-[0_0_10px_rgba(255,60,60,0.9)]"
          style={{ left: p.left, top: p.top }}
        />
      ))}
      {active && (
        <span className="home-plane absolute -translate-x-1/2 -translate-y-1/2 text-xl text-[#FFF3C7] drop-shadow-[0_2px_0_#000]" style={planeStyle} aria-hidden>
          ✈
        </span>
      )}
    </div>
  );
}

const BUBBLES = [
  { who: "testigo", text: "“Se fue apurado, rumbo al puerto.”" },
  { who: "agente", text: "¿QUÉ LLEVABA PUESTO?" },
  { who: "testigo", text: "“Una camiseta del 86, te lo juro.”" },
];

export function InterrogationVisual({ active }: { active: boolean }) {
  useEffect(() => {
    if (active) audioManager.play("click");
  }, [active]);

  return (
    <div className="w-full flex flex-col gap-3">
      {BUBBLES.map((b, i) => (
        <p
          key={b.text}
          style={{ transitionDelay: `${i * 600}ms` }}
          className={`max-w-sm px-4 py-3.5 transition-all duration-500 ${
            b.who === "agente"
              ? "self-end rounded-[14px_14px_2px_14px] bg-[#E1C380] text-[#1b1813] text-[9px] leading-loose"
              : "self-start rounded-[14px_14px_14px_2px] bg-[#1b2633] font-mono text-base"
          } ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {b.text}
        </p>
      ))}
    </div>
  );
}

export function WarrantVisual({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => audioManager.play("stamp"), 700);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="relative w-[min(86vw,340px)] px-8 py-7 rotate-2 bg-[#f4efe2] text-[#1b1813] text-center shadow-[0_18px_30px_rgba(0,0,0,0.6)]">
      <p className="text-[11px]">ORDEN DE ARRESTO</p>
      <p className="mt-4 font-mono text-base">Sospechoso: ________________</p>
      <p className="mt-2 font-mono text-base">Provincia: ________________</p>
      <div className="h-16 mt-4 flex items-center justify-center">
        {active && (
          <span className="home-stamp px-4 py-2.5 border-4 border-double border-red-700 text-red-700 text-sm">EMITIDA</span>
        )}
      </div>
    </div>
  );
}
