"use client";

import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import { useT } from "@/hooks/useT";
import type { CaseDraft } from "@/models/ICaseDraft";
import { localizeDraft, useContentLanguage } from "../contentLanguage";
import BoardPreview from "./BoardPreview";
import CardPreview from "./CardPreview";
import { previewMessages } from "./GamePreview.messages";
import MapPreview from "./MapPreview";
import WitnessPreview from "./WitnessPreview";

interface Props {
  step: number;
  draft: CaseDraft;
  catalog: CaseWizardCatalog;
  witnessLocationId: string | null;
}

const TITLES = ["cardAndBriefing", "caseMap", "caseMap", "board", "board", "location", "cardAndBriefing"] as const;

// Vista previa del juego según el paso: tarjeta y briefing, mapa, tablero de investigación o la locación del testigo.
// Muestra los textos en el idioma del contenido elegido (el inglés vacío cae al castellano, como en el juego)
export default function GamePreview({ step, draft: rawDraft, catalog, witnessLocationId }: Props) {
  const t = useT(previewMessages);
  const lang = useContentLanguage();
  const draft = localizeDraft(rawDraft, lang);

  return (
    <section className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {t("preview")} · {t(TITLES[step])}
        {lang === "en" && <span className="ml-2 rounded bg-sky-400/15 px-1.5 py-0.5 text-sky-200">{t("english")}</span>}
      </p>
      {(step === 0 || step === 6) && <CardPreview draft={draft} />}
      {(step === 1 || step === 2) && <MapPreview draft={draft} catalog={catalog} />}
      {(step === 3 || step === 4) && <BoardPreview draft={draft} catalog={catalog} lang={lang} />}
      {step === 5 && <WitnessPreview draft={draft} catalog={catalog} locationId={witnessLocationId} />}
    </section>
  );
}
