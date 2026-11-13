"use client";

import InvestigationBoard from "@/components/Level/InvestigationBoard";
import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import { useT } from "@/hooks/useT";
import type { Locale } from "@/lib/i18n/locale";
import type { CaseDraft } from "@/models/ICaseDraft";
import type { ISuspect } from "@/models/ISuspect";
import { previewMessages } from "./GamePreview.messages";
import ScaledViewport from "./ScaledViewport";
import { previewImage } from "./previewImages";

// Tablero de investigación con los sospechosos y todas las pistas (en el juego se van sumando al desbloquearlas)
// lang: idioma del contenido (los rasgos de los sospechosos se muestran traducidos)
export default function BoardPreview({ draft, catalog, lang = "es" }: { draft: CaseDraft; catalog: CaseWizardCatalog; lang?: Locale }) {
  const t = useT(previewMessages);
  const suspects: ISuspect[] = draft.suspects.flatMap((s) => {
    const suspect = catalog.suspects.find((c) => c.id === s.suspectId);
    return suspect ? [{ id: suspect.id, name: suspect.name, description: lang === "en" ? suspect.traitsEn : suspect.traits, image: previewImage(suspect.imageUrl) }] : [];
  });
  const text = (initial: boolean) => draft.clues.filter((c) => c.isInitial === initial && c.description.trim()).map((c) => c.description);

  return (
    <div className="space-y-2">
      <ScaledViewport>
        <div className="flex h-screen w-screen items-center justify-center bg-[#080e18] p-10">
          <InvestigationBoard
            briefing={draft.briefing ?? undefined}
            suspects={suspects}
            initialClues={text(true)}
            discoveredClues={text(false)}
            canIssueWarrant={false}
            warrantSuspectId={null}
            onEmitArrest={() => {}}
          />
        </div>
      </ScaledViewport>
      <p className="text-xs text-slate-400">{t("boardNote")}</p>
    </div>
  );
}
