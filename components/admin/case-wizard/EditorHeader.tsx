"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import { useT } from "@/hooks/useT";
import type { CaseDraft } from "@/models/ICaseDraft";
import { caseEditorMessages } from "./CaseEditor.messages";
import ContentLanguageToggle from "./ContentLanguageToggle";
import { missingEnglishByStep, useContentLanguage } from "./contentLanguage";
import { WIZARD_STEPS } from "./steps";
import { stepsMessages } from "./steps.messages";

interface Props {
  draft: CaseDraft;
  step: number;
  showPreview: boolean;
  onTogglePreview: () => void;
  onGoTo: (step: number) => void;
  onClose: () => void;
}

// Encabezado del editor: caso y paso, idioma del contenido, vista previa y la barra de pasos
export default function EditorHeader({ draft, step, showPreview, onTogglePreview, onGoTo, onClose }: Props) {
  const t = useT(caseEditorMessages);
  const ts = useT(stepsMessages);
  const lang = useContentLanguage();
  const missing = lang === "en" ? missingEnglishByStep(draft) : {};

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
            {draft.id != null ? t("editingCase", { id: draft.id }) : t("newCase")} · {t("stepOf", { n: step + 1, total: WIZARD_STEPS.length })}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-50">{ts(WIZARD_STEPS[step].title)}</h3>
        </div>
        <div className="flex items-center gap-2">
          <ContentLanguageToggle />
          <button type="button" onClick={onTogglePreview} className="hidden items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/[0.04] lg:inline-flex">
            <AdminIcon name="image" className="size-3.5" />
            {showPreview ? t("hidePreview") : t("showPreview")}
          </button>
          <button className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/[0.06] hover:text-slate-100" onClick={onClose} aria-label={t("close")}>
            <AdminIcon name="close" />
          </button>
        </div>
      </header>

      <ol className="flex gap-1 overflow-x-auto border-b border-white/10 px-5 py-3">
        {WIZARD_STEPS.map((s, i) => (
          <li key={s.title} className="min-w-28 flex-1">
            <button type="button" onClick={() => onGoTo(i)} className="w-full text-left">
              <span className={`block h-1 rounded-full ${i <= step ? "bg-[#E1C380]" : "bg-white/10"}`} />
              <span className={`mt-1.5 block text-xs font-medium ${i === step ? "text-[#E1C380]" : "text-slate-400"}`}>{i + 1}. {ts(s.title)}</span>
              <span className="block text-[11px] text-slate-500">{ts(s.subtitle)}</span>
              {(missing[i] ?? 0) > 0 && <span className="mt-0.5 block text-[11px] text-sky-300">EN · {t("missingEnglish", { n: missing[i] })}</span>}
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}
