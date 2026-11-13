"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import HomeNav from "../HomeNav";
import ProvincePin from "./ProvincePin";
import { useQuickCase } from "@/hooks/useQuickCase";

// Monitor táctico recortado de la sala (misma proporción que el monitor, así los pines usan la calibración tal cual)
const MONITOR_BG: CSSProperties = {
  backgroundImage: "url(/images/test_composite.webp)",
  backgroundSize: "161.88% auto",
  backgroundPosition: "50.19% 25.25%",
};

// Portada "Caso relámpago": una pista, tres provincias y 30 segundos, sin cuenta
export default function RelampagoScreen() {
  const { state, clue, secondsLeft, pick, next } = useQuickCase();
  const playing = state.phase === "playing";
  const picked = state.phase === "playing" ? null : state.picked;

  const pinStatus = (province: string) => {
    if (playing) return "idle" as const;
    if (province === clue.answer) return "correct" as const;
    return province === picked ? ("wrong" as const) : ("dimmed" as const);
  };

  return (
    <div className="min-h-screen bg-[#070c16] bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,#13203a_0%,#070c16_75%)] text-[#FFF3C7] overflow-x-hidden">
      <HomeNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="#E1C380" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <h1 className="text-base sm:text-lg leading-relaxed">Caso relámpago</h1>
          </div>
          <span
            className={`px-3 py-2.5 rounded-lg border text-[10px] tabular-nums ${
              playing && secondsLeft <= 10 ? "border-red-500 bg-[#2a0f0f] text-red-300 animate-pulse" : "border-[#c81e1e] bg-[#2a0f0f] text-[#ff8a8a]"
            }`}
            aria-live="off"
          >
            00:{String(secondsLeft).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 items-stretch">
          <div className="relative flex-[1_1_320px] aspect-[1.4927] rounded-xl overflow-hidden border-2 border-sky-300/40 bg-[#0b1a20] bg-no-repeat" style={MONITOR_BG}>
            {clue.options.map((p) => (
              <ProvincePin key={p} province={p} status={pinStatus(p)} disabled={!playing} onPick={pick} />
            ))}
          </div>

          <div className="flex-[1_1_360px] flex flex-col gap-4">
            <div className="p-5 bg-[#f4efe2] text-[#1b1813] -rotate-1 shadow-[0_14px_26px_rgba(0,0,0,0.55)]">
              <p className="text-[9px] text-[#7a1212]">DECLARACIÓN DEL TESTIGO</p>
              <p className="mt-3 font-mono text-lg leading-relaxed">“{clue.testimony}”</p>
            </div>
            <p className="text-[10px] leading-loose text-[#E1C380]">¿A QUÉ PROVINCIA VIAJÓ EL SOSPECHOSO?</p>
            <div className="flex flex-wrap gap-3">
              {clue.options.map((p) => {
                const status = pinStatus(p);
                return (
                  <button
                    key={p}
                    type="button"
                    disabled={!playing}
                    onClick={() => pick(p)}
                    className={`min-h-12 px-4 py-3.5 rounded-xl border-2 text-[10px] uppercase transition-colors cursor-pointer disabled:cursor-default ${
                      status === "correct"
                        ? "bg-[#3ddc84] border-[#3ddc84] text-[#06200f]"
                        : status === "wrong"
                          ? "bg-[#c81e1e] border-[#c81e1e]"
                          : "bg-[#1b2633] border-[#E1C380]/50 hover:border-[#E1C380] disabled:opacity-50"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {state.phase === "won" && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#0f2a1b] border-2 border-[#3ddc84]" role="status">
            <div>
              <p className="text-sm text-[#7dffb3]">¡BIEN, AGENTE!</p>
              <p className="mt-2 font-mono text-lg">Lo agarraste en {capitalize(state.picked)}. Hay 24 casos más esperándote.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={next} className="px-4 py-3.5 rounded-xl border-2 border-[#E1C380] text-[10px] cursor-pointer hover:bg-[#E1C380]/10">
                OTRO CASO
              </button>
              <Link href="/login?registro" className="px-4 py-3.5 rounded-xl bg-[#c81e1e] hover:bg-[#a51818] text-[10px]">
                CREAR MI LEGAJO
              </Link>
            </div>
          </div>
        )}

        {state.phase === "lost" && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#2a0f0f] border-2 border-[#c81e1e]" role="status">
            <div>
              <p className="text-sm text-[#ff8a8a]">{state.picked ? "SE TE ESCAPÓ" : "SE ACABÓ EL TIEMPO"}</p>
              <p className="mt-2 font-mono text-lg">{clue.explanation}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={next} className="px-4 py-3.5 rounded-xl border-2 border-[#E1C380] text-[10px] cursor-pointer hover:bg-[#E1C380]/10">
                OTRO CASO
              </button>
              <Link href="/login?registro" className="px-4 py-3.5 rounded-xl bg-[#c81e1e] hover:bg-[#a51818] text-[10px]">
                JUGAR EL JUEGO
              </Link>
            </div>
          </div>
        )}

        <p className="text-center font-mono text-base text-[#FFF3C7]/55">
          Demo sin cuenta: una pista, tres provincias, 30 segundos. El juego completo tiene interrogatorios, viajes y órdenes de arresto.
        </p>
      </main>
    </div>
  );
}

// "santa cruz" → "Santa Cruz"
function capitalize(province: string) {
  return province.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}
