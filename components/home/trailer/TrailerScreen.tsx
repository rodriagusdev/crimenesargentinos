"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import HomeNav from "../HomeNav";
import TrailerControls from "./TrailerControls";
import { trailerScreenMessages } from "./TrailerScreen.messages";
import { TRAILER_SCENES } from "./trailerScenes";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useRedirectIfLoggedIn } from "@/hooks/useRedirectIfLoggedIn";
import { useT } from "@/hooks/useT";
import { useTrailerTimeline } from "@/hooks/useTrailerTimeline";

// Portada "Tráiler" (la de "/"): un tráiler de cine que se reproduce solo (póster con ▶, escenas con franjas negras y placa final)
export default function TrailerScreen({ redirectIfLoggedIn = false }: { redirectIfLoggedIn?: boolean }) {
  useRedirectIfLoggedIn(redirectIfLoggedIn);
  const t = useT(trailerScreenMessages);
  const { state, scene, sceneElapsed, elapsed, total, starts, play, pause, skip } = useTrailerTimeline(TRAILER_SCENES);
  const watching = state.phase === "playing" || state.phase === "paused";

  // Espacio pausa/sigue, Escape salta al final (solo mientras se ve el tráiler)
  useEffect(() => {
    if (!watching) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (state.phase === "playing") pause();
        else play();
      } else if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [watching, state.phase, play, pause, skip]);

  if (watching) {
    const current = TRAILER_SCENES[scene];
    return (
      <div className="relative h-svh bg-black text-[#FFF3C7] overflow-hidden select-none">
        <div key={scene} className="home-cut absolute inset-0">
          {current.render(sceneElapsed, t)}
        </div>

        {/* Textura de película y franjas de cine */}
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          <div className="splash-grain absolute -inset-[50%]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]" />
          <div className="absolute top-0 inset-x-0 h-[9vh] bg-black" />
          <div className="absolute bottom-0 inset-x-0 h-[9vh] bg-black" />
        </div>

        <TrailerControls
          playing={state.phase === "playing"}
          elapsed={elapsed}
          total={total}
          starts={starts}
          onToggle={state.phase === "playing" ? pause : play}
          onSkip={skip}
        />
      </div>
    );
  }

  const ended = state.phase === "ended";

  return (
    <div className="relative min-h-svh flex flex-col bg-black text-[#FFF3C7] overflow-hidden">
      <Image
        src="/images/principal_background.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className={`object-cover ${ended ? "opacity-20 blur-sm" : "opacity-45"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black" aria-hidden />

      <HomeNav className="bg-black/60" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-7 px-4 py-12 text-center">
        <Image src="/images/logofinal.png" alt="Crímenes Argentinos" width={600} height={400} priority className="w-[min(78vw,440px)] h-auto" />

        {ended ? (
          <>
            <h1 className="text-lg sm:text-2xl leading-relaxed [text-shadow:0_4px_0_#1E2A36]">{t("endTitle")}</h1>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login?registro" className="px-6 py-4 rounded-xl bg-[#c81e1e] hover:bg-[#a51818] text-xs">
                {t("playNow")}
              </Link>
              <Link href="/reglas" className="px-6 py-4 rounded-xl border-2 border-[#E1C380] hover:bg-[#E1C380]/10 text-xs">
                {t("rules")}
              </Link>
              <button type="button" onClick={play} className="px-6 py-4 rounded-xl text-xs text-[#FFF3C7]/70 hover:text-[#E1C380] cursor-pointer">
                {t("replay")}
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={play}
              className="group flex items-center gap-4 pl-5 pr-7 py-4 rounded-full bg-[#c81e1e] hover:bg-[#a51818] shadow-[0_0_40px_rgba(200,30,30,0.45)] cursor-pointer"
            >
              <span className="size-12 flex items-center justify-center rounded-full bg-[#FFF3C7] text-[#c81e1e] transition-transform group-hover:scale-110">
                <svg className="size-5 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 4v16l13-8z" />
                </svg>
              </span>
              <span className="text-xs sm:text-sm">{t("watch")}</span>
            </button>
            <p className="font-mono text-sm text-[#FFF3C7]/60">
              {t("posterNote", { seconds: Math.round(total / 1000) })}
            </p>
            {/* En celular la barra no tiene lugar para el selector de idioma */}
            <LanguageSwitcher className="sm:hidden" />
          </>
        )}
      </main>
    </div>
  );
}
