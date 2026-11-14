"use client";

import LevelCard from "@/components/panel-levels/LevelCard";
import { useT } from "@/hooks/useT";
import type { CaseDraft } from "@/models/ICaseDraft";
import { previewMessages } from "./GamePreview.messages";
import { previewImage } from "./previewImages";

// Tarjeta del nivel en la pantalla principal y el briefing que lee el jugador al empezar
export default function CardPreview({ draft }: { draft: CaseDraft }) {
  const t = useT(previewMessages);
  return (
    <div className="flex flex-col gap-5 sm:flex-row">
      <div inert className="pointer-events-none w-full max-w-[280px] shrink-0">
        <LevelCard
          preview={{
            id: draft.groupLevel,
            displayLevel: draft.groupLevel,
            title: (draft.title || t("titlePlaceholder")).toUpperCase(),
            description: draft.description || t("descriptionPlaceholder"),
            imageURL: previewImage(draft.imageUrl, "/images/levelcardspreview/level_1_preview.jpg"),
            canPlay: true,
          }}
        />
      </div>

      <div className="flex-1 rounded-lg border border-amber-900/40 bg-[#f3ead7] p-5 font-mono text-sm leading-relaxed text-zinc-800 shadow-inner">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-red-800">{t("fileBriefing")}</p>
        <p className="whitespace-pre-line">{draft.briefing || t("briefingPlaceholder")}</p>
      </div>
    </div>
  );
}
