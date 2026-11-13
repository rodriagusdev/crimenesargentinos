"use client";

import { useState } from "react";
import DialogBox from "@/components/dialog/DialogBox";
import LocationIntro from "@/components/Level/LocationIntro";
import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import type { CaseDraft } from "@/models/ICaseDraft";
import type IDialog from "@/models/IDialog";
import ScaledViewport from "./ScaledViewport";
import { previewImage } from "./previewImages";

type Screen = "intro" | "dialog";

// Las dos pantallas de una locación: la intro (paisaje + texto del lugar) y el interrogatorio
export default function WitnessPreview({ draft, catalog, locationId }: { draft: CaseDraft; catalog: CaseWizardCatalog; locationId: string | null }) {
  const [screen, setScreen] = useState<Screen>("intro");
  const location = catalog.locations.find((l) => l.id === locationId);
  const witness = draft.dialogs.find((d) => d.locationId === locationId);
  if (!location || !witness) return <p className="text-sm text-slate-400">Elegí una locación para ver su testigo.</p>;

  const scene = previewImage(witness.npcCompleteUrl);
  const dialog: IDialog = {
    caseId: 0,
    provinceId: location.provinceId,
    locationId: location.id,
    npc: witness.npcName || "Testigo",
    overlayBackgroundUrl: previewImage(witness.overlayBackgroundUrl ?? witness.npcCompleteUrl),
    npcCompleteUrl: scene,
    portraitUrl: previewImage(witness.portraitUrl),
    infoBackground: witness.infoBackground || "Texto del lugar.",
    intro: witness.messages.filter((m) => m.text.trim()),
    questions: witness.questions.map((q, i) => ({ id: `${i}`, text: q.text || "(pregunta sin texto)", answer: q.answer })),
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {(["intro", "dialog"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScreen(s)}
            className={`rounded-md px-3 py-1 text-xs transition ${screen === s ? "bg-[#E1C380]/15 text-[#E1C380]" : "text-slate-400 hover:bg-white/[0.04]"}`}
          >
            {s === "intro" ? "Intro de la locación" : "Interrogatorio"}
          </button>
        ))}
      </div>
      <ScaledViewport>
        {screen === "intro" ? (
          // key: LocationIntro guarda la imagen en su estado, se remonta si cambia
          <LocationIntro key={`${location.id}-${dialog.overlayBackgroundUrl}`} dialog={dialog} locationName={location.name} onAdvance={() => {}} />
        ) : (
          <DialogBox dialog={dialog} />
        )}
      </ScaledViewport>
    </div>
  );
}
