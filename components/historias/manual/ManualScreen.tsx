"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ManualCasePage from "./ManualCasePage";
import ManualFooter from "./ManualFooter";
import ManualIndexPage from "./ManualIndexPage";
import { Staple } from "./ManualParts";
import ManualTab from "./ManualTab";
import GameBackdrop, { GAME_BG } from "@/components/galeria/GameBackdrop";
import { audioManager } from "@/lib/audioManager";
import { CASE_STORIES } from "@/lib/caseStories";

// Folio 0 = índice; del 1 al 8, un caso cada uno
const TABS = [
  { id: "indice", number: "§", label: "Índice" },
  ...CASE_STORIES.map((s) => ({ id: s.id, number: String(s.level).padStart(2, "0"), label: s.title })),
];

// "Manual de expedientes": el cuadernillo de "¿Cómo se juega?" con una pestaña por caso y el parte policial de cada uno
export default function ManualScreen() {
  const [page, setPage] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const story = page > 0 ? CASE_STORIES[page - 1] : null;

  // Al cambiar de folio la página arranca arriba y la pestaña activa queda a la vista (en celular la cinta se desplaza)
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    tabsRef.current?.querySelector(`[data-idx="${page}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [page]);

  const goTo = useCallback(
    (idx: number, sfx: "opencasefile" | "click" = "opencasefile") => {
      if (idx === page || idx < 0 || idx >= TABS.length) return;
      audioManager.play(sfx);
      setPage(idx);
    },
    [page],
  );

  // Flechas / Re Pág / Av Pág pasan de folio
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") goTo(page + 1, "click");
      else if (e.key === "ArrowLeft" || e.key === "PageUp") goTo(page - 1, "click");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, goTo]);

  return (
    <div className={`relative h-svh w-full overflow-hidden flex items-center justify-center p-0 sm:p-4 select-none ${GAME_BG}`}>
      <GameBackdrop />

      <main className="relative z-10 w-full sm:w-[96%] md:w-[94%] xl:w-[92%] max-w-[1240px] h-full sm:h-[90svh] max-h-[860px] sm:min-h-[560px] rounded-none sm:rounded-sm border-0 sm:border-2 border-[#4a3928] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(30,20,10,0.6)] bg-[#f6efe1] flex overflow-hidden">
        {/* Lomo del cuadernillo, con grapas */}
        <div className="hidden sm:flex w-11 shrink-0 bg-[#e8deca] border-r-2 border-[#bfae92] flex-col justify-between items-center py-6 shadow-[inset_-4px_0_10px_rgba(0,0,0,0.12)]">
          <Staple />
          <div className="[writing-mode:vertical-rl] rotate-180 text-[9px] font-mono tracking-widest text-[#78664f] uppercase opacity-60">
            PFA • Archivo de casos
          </div>
          <Staple />
        </div>

        <div className="flex-1 min-w-0 min-h-0 flex flex-col p-1.5 sm:p-5 md:p-6 overflow-hidden bg-[#f7f0e2]">
          {/* Doble marco antiguo */}
          <div className="flex-1 min-h-0 border-2 border-[#9e835c] px-3 py-2.5 sm:p-5 md:p-6 rounded-sm flex flex-col bg-[#faf5ea] shadow-inner">
            <header className="shrink-0 pb-2 sm:pb-3 border-b border-[#cbbca3]">
              {/* En celular el botón "← PROPUESTAS" queda arriba a la derecha: el título le deja lugar */}
              <div className="pr-36 sm:pr-0">
                <h1 className="font-serif font-black text-lg sm:text-2xl md:text-3xl tracking-wide text-[#342617] uppercase leading-tight [text-shadow:_0_1px_1px_rgba(255,255,255,0.8)]">
                  Crímenes Argentinos
                </h1>
                <div className="h-0.5 w-28 sm:w-36 bg-[#9e835c] my-0.5" />
                <div className="text-[10px] sm:text-[11px] font-serif font-bold tracking-widest text-[#665038] uppercase">
                  Manual de expedientes
                </div>
              </div>

              <div className="hidden sm:flex mt-2.5 pt-1.5 border-t border-[#dfd4c1] items-center justify-between gap-3 text-xs font-serif text-[#544330]">
                <div>
                  <span className="font-semibold text-[#7d6850]">Autoridad: </span>
                  <span className="font-bold text-[#2d2217]">Policía Federal Argentina</span>
                </div>
                <div className="hidden lg:block">
                  <span className="font-semibold text-[#7d6850]">Sección: </span>
                  <span className="font-bold text-[#2d2217]">{story ? story.title : "Índice"}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#7d6850]">Clasificación: </span>
                  <span className="font-bold text-[#2d2217]">Parte público</span>
                </div>
              </div>

              {/* Cinta de pestañas: una por caso */}
              <div
                ref={tabsRef}
                className="mt-2 sm:mt-2.5 -mx-1 px-1 flex items-center gap-1.5 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {TABS.map((tab, idx) => (
                  <ManualTab key={tab.id} idx={idx} number={tab.number} label={tab.label} active={idx === page} onSelect={goTo} />
                ))}
              </div>
            </header>

            <div ref={bodyRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-3 sm:py-4 px-3.5 sm:pr-3">
              <div key={page} className="home-cut">
                {story ? <ManualCasePage story={story} /> : <ManualIndexPage onOpen={goTo} />}
              </div>
            </div>

            <ManualFooter page={page} total={TABS.length} onPrev={() => goTo(page - 1, "click")} onNext={() => goTo(page + 1, "click")} />
          </div>
        </div>
      </main>
    </div>
  );
}
