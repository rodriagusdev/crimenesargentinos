"use client";

import SplashLogo from "../SplashLogo";
import { newspaperSplashMessages } from "./NewspaperSplash.messages";
import type { SplashSceneProps, SplashVariant } from "./types";
import { useT } from "@/hooks/useT";

// Pasos: 0 rotativa imprimiendo · 1 la portada gira hacia la cámara · 2 sello EXTRA y foto del logo
function NewspaperScene({ progress, agentName }: SplashSceneProps) {
  const t = useT(newspaperSplashMessages);
  const paperIn = progress >= 1;
  const extra = progress >= 2;

  return (
    <div className="absolute inset-0 bg-[#0d0a07]">
      {/* Rotativa: papel corriendo a toda velocidad */}
      <div
        className={`splash-press absolute inset-0 transition-opacity duration-700 ${paperIn ? "opacity-25" : "opacity-80"}`}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(255,220,150,0.18),transparent_75%)]" aria-hidden />

      <div className="relative z-10 h-full flex items-center justify-center px-4 pb-24">
        <article
          className={`splash-paper relative w-[min(92vw,660px)] p-3 sm:p-5 bg-[#ece4cf] text-[#1b1813] shadow-[0_30px_70px_rgba(0,0,0,0.85)] ${
            paperIn ? "splash-paper--in" : ""
          }`}
        >
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,rgba(80,60,30,0.35)_0_1px,transparent_1.5px)] bg-[length:5px_5px] pointer-events-none" />

          <header className="relative text-center">
            <div className="flex justify-between text-[6px] sm:text-[9px] tracking-widest">
              <span>{t("issue")}</span>
              <span>{t("edition")}</span>
              <span className="hidden sm:inline">{t("price")}</span>
            </div>
            <h2 className="my-2 py-1 sm:py-2 border-y-4 border-double border-[#1b1813] text-xl sm:text-5xl tracking-wider">
              {t("name")}
            </h2>
            <h3 className="text-[11px] sm:text-2xl leading-snug">{t("headline")}</h3>
          </header>

          <div className="relative mt-3 grid grid-cols-[1.4fr_1fr] gap-3 sm:gap-4">
            {/* Foto de portada: el escudo del caso */}
            <figure className="relative aspect-[4/3] bg-[#1d2733] overflow-hidden border-2 border-[#1b1813]">
              <div className="absolute inset-0 flex items-center justify-center">
                <SplashLogo visible={extra} className="w-[92%]" />
              </div>
              <figcaption className="absolute bottom-0 inset-x-0 px-1 py-0.5 bg-[#ece4cf]/90 text-[5px] sm:text-[8px]">
                {t("photoCaption")}
              </figcaption>
            </figure>

            <div className="flex flex-col gap-2 text-[6px] sm:text-[9px] leading-relaxed">
              <p>
                {t("bodyBefore")} <strong>{agentName}</strong> {t("bodyAfter")}
              </p>
              {[100, 92, 96, 80, 88, 70].map((w) => (
                <span key={w} className="block h-[3px] bg-[#1b1813]/35" style={{ width: `${w}%` }} />
              ))}
              <p className="mt-auto text-right italic">{t("continued")}</p>
            </div>
          </div>

          {/* Sello EXTRA */}
          {extra && (
            <span className="splash-extra absolute -top-5 -right-3 sm:-top-7 sm:-right-6 size-16 sm:size-24 rounded-full bg-red-700 text-[#fff3c7] flex items-center justify-center text-sm sm:text-xl tracking-widest shadow-[0_6px_0_#5a0d0d,0_12px_24px_rgba(0,0,0,0.6)]">
              {t("extra")}
            </span>
          )}
        </article>
      </div>
    </div>
  );
}

export const newspaperSplash: SplashVariant = {
  id: "newspaper",
  steps: () => [
    { ms: 1000, sfx: "slide" },
    { ms: 1500, sfx: "swoosh" },
    { ms: 1100, sfx: "stamp" },
  ],
  Scene: NewspaperScene,
};
