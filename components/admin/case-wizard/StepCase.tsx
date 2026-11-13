"use client";

import { useT } from "@/hooks/useT";
import ContentTextField from "./ContentTextField";
import ImageUrlField from "./ImageUrlField";
import { stepCaseMessages } from "./StepCase.messages";
import WizardField, { adminInputClass } from "./WizardField";
import type { StepProps } from "./types";

// Paso 1: datos del caso. El nivel va primero porque define dónde se guardan las imágenes
export default function StepCase({ draft, update, catalog }: StepProps) {
  const t = useT(stepCaseMessages);
  const levels = [...new Set(catalog.cases.map((c) => c.groupLevel))].sort((a, b) => a - b);
  const casesInLevel = catalog.cases.filter((c) => c.groupLevel === draft.groupLevel);

  return (
    <div className="space-y-4">
      <WizardField label={t("title")} hint={t("titleHint")}>
        <ContentTextField
          es={draft.title}
          en={draft.titleEn}
          onEs={(title) => update((d) => ({ ...d, title }))}
          onEn={(titleEn) => update((d) => ({ ...d, titleEn }))}
        />
      </WizardField>

      <WizardField label={t("level")} hint={t("levelHint")}>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            min={1}
            value={draft.groupLevel}
            onChange={(e) => update((d) => ({ ...d, groupLevel: Math.max(1, Number(e.target.value) || 1) }))}
            className={`${adminInputClass} w-24`}
          />
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => update((d) => ({ ...d, groupLevel: level }))}
              className={`rounded-md border px-2.5 py-1 text-xs transition ${level === draft.groupLevel ? "border-[#E1C380] bg-[#E1C380]/15 text-[#E1C380]" : "border-white/10 text-slate-400 hover:bg-white/[0.04]"}`}
            >
              {level}
            </button>
          ))}
        </div>
      </WizardField>
      {casesInLevel.length > 0 && (
        <p className="-mt-2 text-xs text-slate-400">
          {t("casesInLevel", { n: casesInLevel.length, titles: casesInLevel.map((c) => c.title).join(" · ") })}
        </p>
      )}

      <WizardField label={t("description")} hint={t("descriptionHint")}>
        <ContentTextField
          multiline
          className="min-h-20"
          es={draft.description}
          en={draft.descriptionEn}
          onEs={(description) => update((d) => ({ ...d, description }))}
          onEn={(descriptionEn) => update((d) => ({ ...d, descriptionEn }))}
        />
      </WizardField>

      <WizardField label={t("briefing")} hint={t("briefingHint")}>
        <ContentTextField
          multiline
          className="min-h-24"
          es={draft.briefing}
          en={draft.briefingEn}
          onEs={(briefing) => update((d) => ({ ...d, briefing: briefing || null }))}
          onEn={(briefingEn) => update((d) => ({ ...d, briefingEn }))}
        />
      </WizardField>

      <ImageUrlField
        label={t("image")}
        value={draft.imageUrl}
        onChange={(url) => update((d) => ({ ...d, imageUrl: url }))}
        kind="preview"
        level={draft.groupLevel}
        caseTitle={draft.title}
        hint={t("imageHint")}
      />

      <WizardField label={t("video")}>
        <input value={draft.videoUrl ?? ""} onChange={(e) => update((d) => ({ ...d, videoUrl: e.target.value || null }))} className={adminInputClass} placeholder="https://..." />
      </WizardField>
    </div>
  );
}
