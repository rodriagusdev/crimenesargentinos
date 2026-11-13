"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import type { CatalogSuspect } from "@/hooks/useCaseWizardCatalog";
import { useT } from "@/hooks/useT";
import type { CaseDraftClue } from "@/models/ICaseDraft";
import ContentTextField from "./ContentTextField";
import { useContentLanguage } from "./contentLanguage";
import { stepCluesMessages } from "./StepClues.messages";
import type { StepProps } from "./types";

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

// Paso 5: pistas. Las iniciales se tienen desde el principio; las otras las desbloquea una pregunta de un testigo
export default function StepClues({ draft, update, catalog }: StepProps) {
  const t = useT(stepCluesMessages);
  const lang = useContentLanguage();
  const guilty = catalog.suspects.find((s) => s.id === draft.suspects.find((x) => x.isGuilty)?.suspectId);
  const others = catalog.suspects.filter((s) => draft.suspects.some((x) => x.suspectId === s.id && !x.isGuilty));
  // Con el contenido en inglés se muestran los rasgos traducidos, para escribir las pistas con las mismas palabras
  const traits = (s: CatalogSuspect) => (lang === "en" ? s.traitsEn : s.traits).join(" · ");

  const setClue = (key: string, change: Partial<CaseDraftClue>) =>
    update((d) => ({ ...d, clues: d.clues.map((c) => (c.key === key ? { ...c, ...change } : c)) }));

  const remove = (key: string) =>
    update((d) => ({
      ...d,
      clues: d.clues.filter((c) => c.key !== key),
      // las preguntas que la daban quedan sin pista
      dialogs: d.dialogs.map((dl) => ({ ...dl, questions: dl.questions.map((q) => (q.clueKey === key ? { ...q, clueKey: null } : q)) })),
    }));

  const add = (isInitial: boolean) =>
    update((d) => ({ ...d, clues: [...d.clues, { key: newKey(), description: "", descriptionEn: null, isInitial }] }));

  const list = (isInitial: boolean) => (
    <div className="space-y-2">
      {draft.clues.filter((c) => c.isInitial === isInitial).map((clue) => (
        <div key={clue.key} className="flex items-start gap-2">
          <ContentTextField
            es={clue.description}
            en={clue.descriptionEn}
            onEs={(description) => setClue(clue.key, { description })}
            onEn={(descriptionEn) => setClue(clue.key, { descriptionEn })}
            placeholder={isInitial ? t("initialPlaceholder") : t("witnessPlaceholder")}
          />
          <button type="button" onClick={() => remove(clue.key)} className="rounded-md px-2 py-2 text-slate-400 hover:bg-white/[0.06] hover:text-red-300" aria-label={t("removeClue")}>
            <AdminIcon name="trash" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => add(isInitial)} className="inline-flex items-center gap-1.5 text-xs text-[#E1C380] hover:underline">
        <AdminIcon name="plus" className="size-3.5" /> {t("addClue")}
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-300">
        <p className="font-medium text-slate-100">{t("ruleTitle")}</p>
        <p className="mt-1">{t("ruleBody")}</p>
        {guilty && <p className="mt-2">{t("culprit")} <b>{guilty.name}</b> — {traits(guilty)}</p>}
        {others.map((s) => (
          <p key={s.id} className="text-slate-400">{s.name} — {traits(s)}</p>
        ))}
      </div>

      <section>
        <h4 className="mb-2 text-sm font-medium text-slate-200">{t("initialTitle")}</h4>
        <p className="mb-2 text-xs text-slate-500">{t("initialHint")}</p>
        {list(true)}
      </section>

      <section>
        <h4 className="mb-2 text-sm font-medium text-slate-200">{t("witnessTitle")}</h4>
        <p className="mb-2 text-xs text-slate-500">{t("witnessHint")}</p>
        {list(false)}
      </section>
    </div>
  );
}
