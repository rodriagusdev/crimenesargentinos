"use client";

import { useRouter } from "next/navigation";
import { useT } from "@/hooks/useT";
import { audioManager } from "@/lib/audioManager";
import { LOCALES, type Locale } from "@/lib/i18n/locale";
import { defineMessages } from "@/lib/i18n/messages";
import { useLocaleStore } from "@/stores/useLocaleStore";

const messages = defineMessages({
  es: { label: "Idioma", es: "Castellano", en: "Inglés" },
  en: { label: "Language", es: "Spanish", en: "English" },
});

interface LanguageSwitcherProps {
  className?: string;
}

/** Selector ES / EN: el idioma queda guardado en la cookie y la API devuelve los casos en ese idioma */
export default function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const router = useRouter();
  const t = useT(messages);
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const choose = (next: Locale) => {
    if (next === locale) return;
    audioManager.play("click");
    setLocale(next);
    router.refresh(); // textos del servidor (metadata, <html lang>)
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`inline-flex rounded-xl overflow-hidden border border-[#FFF3C7]/25 bg-[#070c16]/60 backdrop-blur-sm font-mono text-[10px] tracking-widest ${className}`}
    >
      {LOCALES.map((option) => {
        const active = option === locale;
        return (
          <button
            key={option}
            type="button"
            onClick={() => choose(option)}
            aria-pressed={active}
            title={t(option)}
            className={`px-3 py-2.5 cursor-pointer transition-colors ${
              active ? "bg-amber-400/20 text-[#E1C380]" : "text-[#FFF3C7]/70 hover:text-[#E1C380]"
            }`}
          >
            {option.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
