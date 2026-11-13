"use client";

import HomeNav from "./HomeNav";
import { CaseFolderItem, MapItem, NewspaperItem, RadioItem, RankingItem, RulesBookItem } from "./DeskItems";
import { useRedirectIfLoggedIn } from "@/hooks/useRedirectIfLoggedIn";

// Portada "La mesa del detective": cada objeto del escritorio lleva a una sección
export default function HomeScreen({ redirectIfLoggedIn = false }: { redirectIfLoggedIn?: boolean }) {
  useRedirectIfLoggedIn(redirectIfLoggedIn);

  return (
    <div className="relative min-h-screen flex flex-col text-[#FFF3C7] bg-[#070c16] bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,#3a2414_0%,#1c110a_55%,#070c16_100%)] overflow-x-hidden">
      {/* Halo de la lámpara sobre la mesa */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-72 bg-gradient-to-b from-amber-400/15 to-transparent blur-3xl" aria-hidden />

      <HomeNav />

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-10 flex flex-col gap-8">
        <div className="text-center">
          <p className="text-[10px] sm:text-[11px] tracking-[0.25em] text-[#E1C380]">BUENOS AIRES · 03:14 HS</p>
          <h1 className="mt-4 text-lg sm:text-2xl leading-relaxed [text-shadow:0_4px_0_#1E2A36]">Tu escritorio te espera, agente.</h1>
          <p className="mt-3 font-mono text-base sm:text-lg text-[#FFF3C7]/75">Tocá cualquier objeto de la mesa para empezar.</p>
        </div>

        {/* La mesa */}
        <div className="relative grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-7 gap-y-14 p-6 pt-14 sm:p-8 sm:pt-16 rounded-2xl bg-[#4a2e18] bg-[repeating-linear-gradient(92deg,#4a2e18_0_18px,rgba(40,24,12,0.6)_18px_20px)] shadow-[inset_0_0_80px_rgba(0,0,0,0.65),0_30px_60px_rgba(0,0,0,0.6)]">
          {/* Mancha de café */}
          <div
            className="pointer-events-none absolute bottom-6 right-[30%] size-24 rounded-full bg-[radial-gradient(circle,transparent_58%,rgba(20,10,4,0.45)_62%,rgba(20,10,4,0.15)_70%,transparent_74%)]"
            aria-hidden
          />
          <MapItem />
          <CaseFolderItem />
          <RulesBookItem />
          <RadioItem />
          <NewspaperItem />
          <RankingItem />
        </div>
      </main>

      <footer className="relative z-10 pb-6 text-center font-mono text-xs text-[#FFF3C7]/40">
        Crímenes Argentinos · un juego de detectives por todo el país
      </footer>
    </div>
  );
}
