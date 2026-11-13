"use client";

import ImageUrlField from "./ImageUrlField";
import WizardField, { adminInputClass } from "./WizardField";
import type { StepProps } from "./types";

// Paso 1: datos del caso. El nivel va primero porque define dónde se guardan las imágenes
export default function StepCase({ draft, update, catalog }: StepProps) {
  const levels = [...new Set(catalog.cases.map((c) => c.groupLevel))].sort((a, b) => a - b);
  const casesInLevel = catalog.cases.filter((c) => c.groupLevel === draft.groupLevel);

  return (
    <div className="space-y-4">
      <WizardField label="Título" hint="Si es una variante, usá el título del original con un subtítulo: «El Bandoneón de Oro: Peña en el Litoral».">
        <input value={draft.title} onChange={(e) => update((d) => ({ ...d, title: e.target.value }))} className={adminInputClass} />
      </WizardField>

      <WizardField label="Nivel" hint="Las variantes de un caso comparten nivel: el nivel sortea entre todos sus casos. Un número nuevo crea un nivel nuevo.">
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
          Ya hay {casesInLevel.length} caso(s) en este nivel: {casesInLevel.map((c) => c.title).join(" · ")}
        </p>
      )}

      <WizardField label="Descripción" hint="Se ve en la tarjeta del nivel.">
        <textarea value={draft.description} onChange={(e) => update((d) => ({ ...d, description: e.target.value }))} className={`${adminInputClass} min-h-20`} />
      </WizardField>

      <WizardField label="Briefing" hint="Lo que lee el jugador al empezar: qué se robó y dónde lo vieron por última vez.">
        <textarea value={draft.briefing ?? ""} onChange={(e) => update((d) => ({ ...d, briefing: e.target.value || null }))} className={`${adminInputClass} min-h-24`} />
      </WizardField>

      <ImageUrlField
        label="Imagen de la tarjeta"
        value={draft.imageUrl}
        onChange={(url) => update((d) => ({ ...d, imageUrl: url }))}
        kind="preview"
        level={draft.groupLevel}
        caseTitle={draft.title}
        hint="Las variantes usan la misma imagen que el caso original."
      />

      <WizardField label="Video (URL, opcional)">
        <input value={draft.videoUrl ?? ""} onChange={(e) => update((d) => ({ ...d, videoUrl: e.target.value || null }))} className={adminInputClass} placeholder="https://..." />
      </WizardField>
    </div>
  );
}
