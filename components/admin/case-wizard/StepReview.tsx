"use client";

import type { CaseDraft } from "@/models/ICaseDraft";
import type { CaseDraftCheck } from "@/models/ICaseDraft";
import WizardField, { adminInputClass } from "./WizardField";
import type { StepProps } from "./types";

export type CheckState =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "checked"; result: CaseDraftCheck }
  | { kind: "error"; message: string };

interface Props extends StepProps {
  check: CheckState;
  onCheck: () => void;
}

const COSTS: { field: keyof CaseDraft; label: string }[] = [
  { field: "initialPI", label: "PI iniciales" },
  { field: "travelProvinceTime", label: "Viajar a provincia: horas (si faltan coordenadas)" },
  { field: "travelProvincePi", label: "Viajar a provincia: PI" },
  { field: "travelLocationTime", label: "Ir a locación: horas (si faltan coordenadas)" },
  { field: "travelLocationPi", label: "Ir a locación: PI" },
  { field: "askQuestionTime", label: "Preguntar: horas" },
  { field: "askQuestionPi", label: "Preguntar: PI" },
];

// Paso 7: costos y revisión. El backend valida todo y calcula el tiempo inicial antes de crear el caso
export default function StepReview({ draft, update, catalog, check, onCheck }: Props) {
  const guilty = catalog.suspects.find((s) => s.id === draft.suspects.find((x) => x.isGuilty)?.suspectId);
  const questionCount = draft.dialogs.reduce((n, d) => n + d.questions.length, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {COSTS.map(({ field, label }) => (
          <WizardField key={field} label={label}>
            <input
              type="number"
              min={0}
              value={Number(draft[field])}
              onChange={(e) => update((d) => ({ ...d, [field]: Math.max(0, Number(e.target.value) || 0) }))}
              className={adminInputClass}
            />
          </WizardField>
        ))}
      </div>

      <div className="rounded-lg border border-white/10 bg-[#0a0f18] p-4 text-sm text-slate-300">
        <p className="font-medium text-slate-100">{draft.title || "Sin título"} — nivel {draft.groupLevel}</p>
        <ul className="mt-2 space-y-1 text-xs text-slate-400">
          <li>Provincias: {draft.provinces.map((p) => catalog.provinces.find((c) => c.id === p.provinceId)?.name).join(" · ")}</li>
          <li>Inicio: {catalog.locations.find((l) => l.id === draft.startLocationId)?.name ?? "—"} · Escondite: {catalog.locations.find((l) => l.id === draft.criminalLocationId)?.name ?? "—"}</li>
          <li>Culpable: {guilty?.name ?? "—"} · Sospechosos: {draft.suspects.length}</li>
          <li>Pistas: {draft.clues.length} · Testigos: {draft.dialogs.length} · Preguntas: {questionCount}</li>
        </ul>
      </div>

      <div className="rounded-lg border border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-100">Validación y tiempo inicial</p>
          <button type="button" onClick={onCheck} disabled={check.kind === "checking"} className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.04] disabled:opacity-60">
            {check.kind === "checking" ? "Validando..." : "Volver a validar"}
          </button>
        </div>

        {check.kind === "error" && <p className="mt-3 text-sm text-red-300">{check.message}</p>}
        {check.kind === "checked" && (
          <>
            {check.result.initialTime != null && (
              <p className="mt-3 text-sm text-slate-200">
                Tiempo inicial: <b>{check.result.initialTime} h</b>
                <span className="text-slate-400"> = recorrido de {check.result.routeHours} h + {Math.ceil((check.result.questionCount * 2) / 3)} de {check.result.questionCount} preguntas</span>
              </p>
            )}
            {check.result.errors.length > 0 ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-200">
                {check.result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-emerald-300">Todo listo para crear el caso.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
