"use client";

import Image from "next/image";
import Link from "next/link";
import HomeNav from "../HomeNav";
import DiarioCoupon from "./DiarioCoupon";
import DiarioPastimes from "./DiarioPastimes";
import DiarioTicker from "./DiarioTicker";
import { diarioScreenMessages } from "./DiarioScreen.messages";
import { useT } from "@/hooks/useT";

const COLUMN_TITLE = "text-lg sm:text-xl leading-snug font-mono font-bold";
const COLUMN_BODY = "font-mono text-base leading-relaxed";

// Portada "Diario de tapa": toda la home es la tapa de El Vespertino
export default function DiarioScreen() {
  const t = useT(diarioScreenMessages);
  return (
    <div className="min-h-screen bg-[#1a140d] bg-[repeating-linear-gradient(92deg,#1f170f_0_22px,#1a140d_22px_24px)] overflow-x-hidden">
      <HomeNav />

      <div className="px-3 sm:px-6 py-8 sm:py-12">
        <article className="home-paper-in relative max-w-6xl mx-auto p-4 sm:p-8 text-[#1b1813] bg-[#ece4cf] bg-[radial-gradient(ellipse_at_center,#efe7d2_55%,#d9caa3_100%)] shadow-[0_30px_70px_rgba(0,0,0,0.75)]">
          {/* Pliegue y mancha de café */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-gradient-to-b from-transparent via-black/[0.06] to-transparent" aria-hidden />
          <div
            className="pointer-events-none absolute top-[38%] right-[6%] size-28 rounded-full bg-[radial-gradient(circle,transparent_58%,rgba(110,70,25,0.35)_62%,rgba(110,70,25,0.12)_70%,transparent_74%)] rotate-12"
            aria-hidden
          />

          {/* Cabecera con "orejas" */}
          <header className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
            <div className="hidden md:flex items-center gap-3 text-left">
              <Image src="/images/logofinal.png" alt="" width={90} height={60} className="w-20 h-auto" />
              <span className="font-mono text-sm leading-tight">{t("masthead")}</span>
            </div>
            <h1 className="px-2 py-2 border-y-[6px] border-double border-[#1b1813] font-serif font-black text-5xl sm:text-7xl tracking-wide">
              El Vespertino
            </h1>
            <div className="hidden md:block ml-auto max-w-56 p-2 border-2 border-[#1b1813] text-left">
              <p className="text-[8px]">{t("forecastLabel")}</p>
              <p className="mt-1 font-mono text-sm leading-tight">{t("forecast")}</p>
            </div>
          </header>
          <div className="mt-3 flex flex-wrap justify-between gap-2 text-[8px] sm:text-[9px]">
            <span>{t("issue")}</span>
            <span>{t("edition")}</span>
            <span>{t("price")}</span>
          </div>

          <div className="mt-3 -mx-4 sm:-mx-8">
            <DiarioTicker />
          </div>

          {/* Titular */}
          <div className="relative mt-6 text-center">
            <span className="home-extra absolute -top-3 right-0 sm:right-6 size-16 sm:size-20 rounded-full bg-[#b91c1c] text-[#fff3c7] flex items-center justify-center text-[10px] sm:text-xs shadow-[0_5px_0_#5a0d0d]">
              {t("extra")}
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-5xl leading-tight px-14">{t("headline")}</h2>
            <p className="mt-3 font-mono italic text-lg">{t("subhead")}</p>
          </div>

          {/* Nota principal + cupón */}
          <div className="mt-7 pt-6 border-t-2 border-[#1b1813] grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-8">
            <div className="flex flex-col gap-4">
              <figure>
                <div className="relative aspect-video border-2 border-[#1b1813] overflow-hidden bg-[#1d2733]">
                  <Image
                    src="/images/test_composite.webp"
                    alt={t("photoAlt")}
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className="object-cover grayscale contrast-125 sepia-[.25]"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.25)_0_1px,transparent_1.5px)] bg-[length:4px_4px]" aria-hidden />
                </div>
                <figcaption className="mt-1.5 font-mono text-sm">{t("photoCaption")}</figcaption>
              </figure>
              <p className={`${COLUMN_BODY} first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:font-black first-letter:text-6xl first-letter:leading-[0.8]`}>
                {t("lead")}
              </p>
              <Link href="/reglas" className="self-start text-[9px] text-[#7a1212] hover:underline">
                {t("continued")}
              </Link>
            </div>
            <DiarioCoupon />
          </div>

          {/* Columnas */}
          <div className="mt-8 pt-6 border-t-2 border-[#1b1813] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-7">
            <div className="flex flex-col gap-2">
              <p className="text-[9px] text-[#7a1212]">{t("travelLabel")}</p>
              <h3 className={COLUMN_TITLE}>{t("travelTitle")}</h3>
              <p className={COLUMN_BODY}>{t("travelBody")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[9px] text-[#7a1212]">{t("interrogationLabel")}</p>
              <h3 className={COLUMN_TITLE}>{t("interrogationTitle")}</h3>
              <p className={COLUMN_BODY}>{t("interrogationBody")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[9px] text-[#7a1212]">{t("rankingLabel")}</p>
              <h3 className={COLUMN_TITLE}>{t("rankingTitle")}</h3>
              <p className={COLUMN_BODY}>{t("rankingBody")}</p>
              <Link href="/login" className="self-start text-[9px] text-[#7a1212] hover:underline">
                {t("rankingLink")}
              </Link>
            </div>
          </div>

          <DiarioPastimes />

          <p className="mt-8 pt-3 border-t border-[#1b1813] text-center font-mono text-xs">
            {t("imprint")}
          </p>
        </article>
      </div>
    </div>
  );
}
