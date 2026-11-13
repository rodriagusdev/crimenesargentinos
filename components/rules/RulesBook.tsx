"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SeamlessBackgroundVideo from "@/components/login/SeamlessBackgroundVideo";
import { useAudioStore } from "@/stores/useAudioStore";
import { useT } from "@/hooks/useT";
import { rulesBookMessages } from "./RulesBook.messages";
import { RulesReturnContext, SECTIONS, type RulesReturnPath } from "./RulesSections";

export type { RulesReturnPath };


export default function RulesBook({ returnTo = "/login" }: { returnTo?: RulesReturnPath }) {
  const router = useRouter();
  const t = useT(rulesBookMessages);
  const playSfx = useAudioStore((state) => state.playSfx);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const section = SECTIONS[currentPage];
  const tabsRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Al cambiar de folio la página arranca arriba y la pestaña activa queda a la vista (en celular la cinta se desplaza)
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    tabsRef.current
      ?.querySelector(`[data-idx="${currentPage}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [currentPage]);

  const handleSelectPage = (idx: number) => {
    if (idx === currentPage) return;
    try {
      playSfx("opencasefile");
    } catch {}
    setCurrentPage(idx);
  };

  const handleNext = () => {
    if (currentPage < SECTIONS.length - 1) {
      try {
        playSfx("click");
      } catch {}
      handleSelectPage(currentPage + 1);
    } else {
      try {
        playSfx("click");
      } catch {}
      router.push(returnTo);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      try {
        playSfx("click");
      } catch {}
      handleSelectPage(currentPage - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        if (currentPage < SECTIONS.length - 1) {
          handleSelectPage(currentPage + 1);
        }
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (currentPage > 0) {
          handleSelectPage(currentPage - 1);
        }
      } else if (e.key === "Escape") {
        router.push(returnTo);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, returnTo]);

  return (
    <RulesReturnContext.Provider value={returnTo}>
    <div className="relative h-svh w-full overflow-hidden flex items-center justify-center p-0 sm:p-4 bg-[#0a0705] select-none font-sans">
      {/* Background Seamless Looping Video */}
      <SeamlessBackgroundVideo
        src="/videos/introvid.mp4"
        poster="/images/principal_background.webp"
        fadeDuration={0.8}
      />

      {/* Atmospheric Dark Tabletop Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px] pointer-events-none" />

      {/* Main Physical Booklet Container - widened to 92-94% width up to 1380px for generous spacing */}
      <main className="relative z-10 w-full sm:w-[96%] md:w-[94%] xl:w-[92%] 2xl:w-[90%] max-w-[1380px] h-full sm:h-[94svh] max-h-[860px] sm:min-h-[560px] rounded-none sm:rounded-sm border-0 sm:border-2 border-[#4a3928] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(30,20,10,0.6)] bg-[#f6efe1] flex overflow-hidden">
        
        {/* Left Book Spine (Stapled Booklet Fold Margin) */}
        <div className="hidden sm:flex w-11 shrink-0 bg-[#e8deca] border-r-2 border-[#bfae92] flex-col justify-between items-center py-6 select-none relative shadow-[inset_-4px_0_10px_rgba(0,0,0,0.12)]">
          {/* Metallic Staples */}
          <div className="w-1.5 h-6 rounded-sm bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-600 shadow-sm border border-zinc-700/80 my-4" />
          
          <div className="[writing-mode:vertical-rl] text-[9px] font-mono tracking-widest text-[#78664f] uppercase rotate-180 opacity-60">
            {t("spine")}
          </div>
          
          <div className="w-1.5 h-6 rounded-sm bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-600 shadow-sm border border-zinc-700/80 my-4" />
        </div>

        {/* Right Booklet Page Area */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col p-1.5 sm:p-5 md:p-6 overflow-hidden bg-[#f7f0e2] relative">
          
          {/* Outer Vintage Double Frame */}
          <div className="flex-1 min-h-0 border-2 border-[#9e835c] px-3 py-2.5 sm:p-5 md:p-6 rounded-sm flex flex-col justify-between relative bg-[#faf5ea] shadow-inner">
            
            {/* Top Booklet Title Bar */}
            <header className="shrink-0 pb-2 sm:pb-3 border-b border-[#cbbca3]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="font-serif font-black text-lg sm:text-2xl md:text-3xl tracking-wide text-[#342617] uppercase leading-tight [text-shadow:_0_1px_1px_rgba(255,255,255,0.8)]">
                    {t("gameTitle")}
                  </h1>
                  <div className="h-0.5 w-28 sm:w-36 bg-[#9e835c] my-0.5" />
                  <div className="text-[10px] sm:text-[11px] font-serif font-bold tracking-widest text-[#665038] uppercase">
                    {t("manualSubtitle")}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={returnTo}
                    onClick={() => {
                      try {
                        playSfx("click");
                      } catch {}
                    }}
                    className="flex items-center justify-center gap-1.5 min-w-10 min-h-10 sm:min-w-0 sm:min-h-0 rounded border border-[#8f744e] bg-[#ede2cb] hover:bg-[#dfd1b5] text-[#3d2e1c] px-3 py-1.5 text-xs font-serif font-bold tracking-wider transition-all shadow-xs"
                    title={t("closeTitle")}
                  >
                    <span>✕</span>
                    <span className="hidden sm:inline">{t("close")}</span>
                  </Link>
                </div>
              </div>

              {/* Publisher / Designer Metadata row */}
              <div className="hidden sm:flex mt-2.5 pt-1.5 border-t border-[#dfd4c1] items-center justify-between gap-3 text-xs font-serif text-[#544330]">
                <div>
                  <span className="font-semibold text-[#7d6850]">{t("authorityLabel")}</span>
                  <span className="font-bold text-[#2d2217]">{t("authority")}</span>
                </div>
                <div className="hidden lg:block">
                  <span className="font-semibold text-[#7d6850]">{t("sectionLabel")}</span>
                  <span className="font-bold text-[#2d2217]">{t(`${section.id}Title`)}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#7d6850]">{t("jurisdictionLabel")}</span>
                  <span className="font-bold text-[#2d2217]">{t("jurisdiction")}</span>
                </div>
              </div>

              {/* Quick Section Tabs Ribbon */}
              <div ref={tabsRef} className="mt-2 sm:mt-2.5 -mx-1 px-1 flex items-center gap-1.5 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SECTIONS.map((sec, idx) => (
                  <button
                    key={sec.id}
                    type="button"
                    data-idx={idx}
                    onClick={() => handleSelectPage(idx)}
                    className={`shrink-0 whitespace-nowrap px-2.5 sm:px-3 py-1.5 sm:py-1 rounded text-[10px] sm:text-xs font-serif tracking-wider transition-all border ${
                      currentPage === idx
                        ? "bg-[#382b1d] text-[#f8f2e4] border-[#382b1d] font-bold shadow-xs"
                        : "bg-[#eee4cf] text-[#5a4835] border-[#cbbba2] hover:bg-[#dfd3bc]"
                    }`}
                  >
                    <span className="font-mono text-[9px] mr-1.5 opacity-80">{sec.number}</span>
                    <span>{t(`${sec.id}Tab`)}</span>
                  </button>
                ))}
              </div>
            </header>

            {/* Scrollable Page Body with generous spacing */}
            <div ref={bodyRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-3 sm:py-3.5 pr-1 sm:pr-3 scrollbar-thin scrollbar-thumb-[#c2b093] scrollbar-track-transparent">
              {section.render(t)}
            </div>

            {/* Bottom Rulebook Footer */}
            <footer className="shrink-0 pt-2.5 sm:pt-3 border-t border-[#cbbca3] flex items-center justify-between gap-2 sm:gap-3 relative">
              {/* Left: Page Number Box */}
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="size-8 sm:size-9 rounded border-2 border-[#8f744e] bg-[#ede0c7] flex items-center justify-center font-serif font-black text-xs sm:text-sm text-[#382b1d] shadow-inner select-none">
                  {currentPage + 1}
                </div>
                <div className="text-[11px] sm:text-xs font-serif text-[#66523c] hidden sm:block">
                  {t("pageOf", { n: currentPage + 1, total: SECTIONS.length })}
                </div>
              </div>

              {/* Center: Flip Buttons */}
              <div className="flex flex-1 sm:flex-none items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2.5 sm:py-1.5 rounded border border-[#8f744e] bg-[#eee4cf] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#e0d2b7] text-[#342617] text-xs font-serif font-bold transition-all shadow-xs"
                >
                  {t("prev")}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-1.5 rounded border border-[#443323] bg-[#3a2d1f] hover:bg-[#291f14] text-[#f9f3e6] text-xs font-serif font-bold transition-all shadow-xs"
                >
                  {currentPage === SECTIONS.length - 1 ? (
                    <>{t("start")}<span className="hidden sm:inline">{t("startSuffix")}</span></>
                  ) : (
                    t("next")
                  )}
                </button>
              </div>

              {/* Right: Vintage Circular Rubber Stamp / Seal */}
              <div className="hidden sm:flex shrink-0 size-14 rounded-full border-2 border-[#695138] bg-[#e7d8be] p-0.5 shadow-sm flex-col items-center justify-center text-center select-none rotate-[-4deg]">
                <div className="size-full rounded-full border border-dashed border-[#695138] flex flex-col items-center justify-center p-0.5">
                  <span className="text-[6px] sm:text-[7px] font-serif font-bold tracking-widest text-[#5c442c] uppercase">
                    {t("sealTop")}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-black tracking-wider text-[#342414] leading-tight">
                    PFA
                  </span>
                  <span className="text-[6px] sm:text-[7px] font-serif font-semibold text-[#5c442c] uppercase">
                    {t("sealBottom")}
                  </span>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </main>
    </div>
    </RulesReturnContext.Provider>
  );
}
