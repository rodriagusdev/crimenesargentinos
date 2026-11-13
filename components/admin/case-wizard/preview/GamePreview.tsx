"use client";

import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import type { CaseDraft } from "@/models/ICaseDraft";
import BoardPreview from "./BoardPreview";
import CardPreview from "./CardPreview";
import MapPreview from "./MapPreview";
import WitnessPreview from "./WitnessPreview";

interface Props {
  step: number;
  draft: CaseDraft;
  catalog: CaseWizardCatalog;
  witnessLocationId: string | null;
}

// Vista previa del juego según el paso: tarjeta y briefing, mapa, tablero de investigación o la locación del testigo
export default function GamePreview({ step, draft, catalog, witnessLocationId }: Props) {
  const title = ["Tarjeta del nivel y briefing", "Mapa del caso", "Mapa del caso", "Tablero de investigación", "Tablero de investigación", "Locación", "Tarjeta del nivel y briefing"][step];

  return (
    <section className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Vista previa · {title}</p>
      {(step === 0 || step === 6) && <CardPreview draft={draft} />}
      {(step === 1 || step === 2) && <MapPreview draft={draft} catalog={catalog} />}
      {(step === 3 || step === 4) && <BoardPreview draft={draft} catalog={catalog} />}
      {step === 5 && <WitnessPreview draft={draft} catalog={catalog} locationId={witnessLocationId} />}
    </section>
  );
}
