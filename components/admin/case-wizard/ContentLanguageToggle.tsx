"use client";

import { useT } from "@/hooks/useT";
import { LOCALES } from "@/lib/i18n/locale";
import { caseEditorMessages } from "./CaseEditor.messages";
import { useContentLanguageStore } from "./contentLanguage";

// "Contenido: ES | EN": qué idioma de los textos del caso editan los campos y muestra la vista previa
export default function ContentLanguageToggle() {
  const t = useT(caseEditorMessages);
  const lang = useContentLanguageStore((s) => s.lang);
  const setLang = useContentLanguageStore((s) => s.setLang);

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-slate-400" title={t("contentToggleTitle")}>
      <span>{t("content")}</span>
      <div className="inline-flex overflow-hidden rounded-md border border-white/10">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={lang === l}
            onClick={() => setLang(l)}
            className={`px-2.5 py-1 font-medium uppercase transition ${lang === l ? (l === "en" ? "bg-sky-400/20 text-sky-200" : "bg-[#E1C380]/20 text-[#E1C380]") : "text-slate-400 hover:bg-white/[0.04]"}`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
