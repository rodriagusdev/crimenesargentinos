"use client";

import InvestigationBoard from "@/components/Level/InvestigationBoard";
import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import type { CaseDraft } from "@/models/ICaseDraft";
import type { ISuspect } from "@/models/ISuspect";
import ScaledViewport from "./ScaledViewport";
import { previewImage } from "./previewImages";

// Tablero de investigación con los sospechosos y todas las pistas (en el juego se van sumando al desbloquearlas)
export default function BoardPreview({ draft, catalog }: { draft: CaseDraft; catalog: CaseWizardCatalog }) {
  const suspects: ISuspect[] = draft.suspects.flatMap((s) => {
    const suspect = catalog.suspects.find((c) => c.id === s.suspectId);
    return suspect ? [{ id: suspect.id, name: suspect.name, description: suspect.traits, image: previewImage(suspect.imageUrl) }] : [];
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
      <p className="text-xs text-slate-400">En el juego, las pistas de los testigos aparecen recién cuando se desbloquean.</p>
    </div>
  );
}
