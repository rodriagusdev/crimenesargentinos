"use client";

import { diarioTickerMessages } from "./DiarioTicker.messages";
import { useT } from "@/hooks/useT";

const NEWS_KEYS = ["news1", "news2", "news3", "news4", "news5"] as const;

// Cinta roja de ÚLTIMO MOMENTO que corre como marquesina (el contenido va duplicado para el loop sin cortes)
export default function DiarioTicker() {
  const t = useT(diarioTickerMessages);
  const news = NEWS_KEYS.map((key) => t(key));
  const items = [...news, ...news];
  return (
    <div className="flex items-stretch overflow-hidden bg-[#7a1212] text-[#f6efdc] border-y-2 border-[#1b1813]">
      <span className="shrink-0 z-10 px-3 py-2 bg-[#1b1813] text-[9px] sm:text-[10px] flex items-center">{t("label")}</span>
      <div className="relative flex-1 overflow-hidden">
        <div className="home-ticker flex w-max gap-10 py-2 pl-6 font-mono text-sm sm:text-base whitespace-nowrap" aria-hidden>
          {items.map((n, i) => (
            <span key={i}>▸ {n}</span>
          ))}
        </div>
        <p className="sr-only">{news.join(". ")}</p>
      </div>
    </div>
  );
}
