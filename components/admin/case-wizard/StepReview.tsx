"use client";

import { useT } from "@/hooks/useT";
import type { CaseDraft, CaseDraftCheck } from "@/models/ICaseDraft";
import { stepReviewMessages } from "./StepReview.messages";
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

// Cada costo usa su nombre de campo como clave del mensaje
const COSTS = [
  "initialPI",
  "travelProvinceTime",
  "travelProvincePi",
  "travelLocationTime",
  "travelLocationPi",
  "askQuestionTime",
  "askQuestionPi",
] as const satisfies readonly (keyof CaseDraft)[];

// Paso 7: costos y revisión. El backend valida todo y calcula el tiempo inicial antes de crear el caso
export default function StepReview({ draft, update, catalog, check, onCheck }: Props) {
  const t = useT(stepReviewMessages);
  const guilty = catalog.suspects.find((s) => s.id === draft.suspects.find((x) => x.isGuilty)?.suspectId);
  const questionCount = draft.dialogs.reduce((n, d) => n + d.questions.length, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {COSTS.map((field) => (
          <WizardField key={field} label={t(field)}>
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
        <p className="font-medium text-slate-100">{draft.title || t("untitled")} — {t("level", { n: draft.groupLevel })}</p>
        <ul className="mt-2 space-y-1 text-xs text-slate-400">
          <li>{t("provinces")} {draft.provinces.map((p) => catalog.provinces.find((c) => c.id === p.provinceId)?.name).join(" · ")}</li>
          <li>{t("start")} {catalog.locations.find((l) => l.id === draft.startLocationId)?.name ?? "—"} · {t("hideout")} {catalog.locations.find((l) => l.id === draft.criminalLocationId)?.name ?? "—"}</li>
          <li>{t("culprit")} {guilty?.name ?? "—"} · {t("suspects")} {draft.suspects.length}</li>
          <li>{t("clues")} {draft.clues.length} · {t("witnesses")} {draft.dialogs.length} · {t("questions")} {questionCount}</li>
        </ul>
      </div>

      <div className="rounded-lg border border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-100">{t("validation")}</p>
          <button type="button" onClick={onCheck} disabled={check.kind === "checking"} className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.04] disabled:opacity-60">
            {check.kind === "checking" ? t("checking") : t("recheck")}
          </button>
        </div>

        {check.kind === "error" && <p className="mt-3 text-sm text-red-300">{check.message}</p>}
        {check.kind === "checked" && (
          <>
            {check.result.initialTime != null && (
              <p className="mt-3 text-sm text-slate-200">
                {t("initialTime")} <b>{check.result.initialTime} h</b>
                <span className="text-slate-400">
                  {t("formula", { route: check.result.routeHours ?? "—", asked: Math.ceil((check.result.questionCount * 2) / 3), total: check.result.questionCount })}
                </span>
              </p>
            )}
            {check.result.errors.length > 0 ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-200">
                {check.result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-emerald-300">{t("allSet")}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
