"use client";

import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
  es: { doNotCross: "NO PASAR · CASO RESTRINGIDO", locked: "🔒 RESOLVÉ EL NIVEL ANTERIOR" },
  en: { doNotCross: "DO NOT CROSS · RESTRICTED CASE", locked: "🔒 SOLVE THE PREVIOUS LEVEL" },
});

// Cinta policial cruzada sobre la imagen de un nivel bloqueado
const tape =
  "absolute -left-[10%] -right-[10%] h-7 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.7)] " +
  "bg-[repeating-linear-gradient(45deg,#eab308,#eab308_12px,#111827_12px,#111827_24px)]";

const label = "px-2.5 py-1 bg-black/85 font-['Press_Start_2P'] text-[7px] sm:text-[8px] tracking-widest text-yellow-400 whitespace-nowrap";

export default function PoliceTapeOverlay() {
  const t = useT(messages);
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
      <div className={`${tape} top-[38%] -rotate-[9deg]`}>
        <span className={label}>{t("doNotCross")}</span>
      </div>
      <div className={`${tape} top-[56%] rotate-[6deg] opacity-85`}>
        <span className={label}>{t("locked")}</span>
      </div>
    </div>
  );
}
