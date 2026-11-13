"use client";

import { useCallback, useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import { useT } from "@/hooks/useT";
import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import { clearCaseDraft, saveCaseDraft } from "@/lib/caseDraftStorage";
import { EMPTY_CASE_DRAFT, emptyDialog, type CaseDraft, type CaseDraftLoaded } from "@/models/ICaseDraft";
import { checkCaseDraft, submitCaseDraft, CaseDraftRejectedError } from "@/services/caseAuthoringService";
import { caseEditorMessages } from "./CaseEditor.messages";
import EditorHeader from "./EditorHeader";
import StepCase from "./StepCase";
import StepClues from "./StepClues";
import StepProvinces from "./StepProvinces";
import StepReview, { type CheckState } from "./StepReview";
import StepRoute from "./StepRoute";
import StepSuspects from "./StepSuspects";
import StepWitnesses from "./StepWitnesses";
import GamePreview from "./preview/GamePreview";
import { stepError, WIZARD_STEPS } from "./steps";
import { stepsMessages, type StepsMessageKey } from "./steps.messages";
import { caseLocations } from "./types";

type SubmitState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; id: number; initialTime: number }
  | { kind: "failed"; message: string; errors: string[] };

interface Props {
  catalog: CaseWizardCatalog;
  initialDraft: CaseDraft;
  initialStep: number;
  editNotice: Omit<CaseDraftLoaded, "draft"> | null; // solo al editar un caso existente
  onBack: () => void;
  onClose: (changed: boolean) => void;
}

function syncWitnesses(d: CaseDraft, catalog: CaseWizardCatalog): CaseDraft {
  const ids = caseLocations(d, catalog).map((l) => l.id);
  const keep = (id: string | null) => (id && ids.includes(id) ? id : null);
  return {
    ...d,
    startLocationId: keep(d.startLocationId),
    criminalLocationId: keep(d.criminalLocationId),
    dialogs: ids.map((id) => d.dialogs.find((x) => x.locationId === id) ?? emptyDialog(id)),
  };
}

// Pasos del asistente con la vista previa del juego. Sirve para crear un caso o editar uno existente
export default function CaseEditor({ catalog, initialDraft, initialStep, editNotice, onBack, onClose }: Props) {
  const t = useT(caseEditorMessages);
  const ts = useT(stepsMessages);
  const isEdit = initialDraft.id != null;
  const [draft, setDraft] = useState<CaseDraft>(initialDraft);
  const [step, setStep] = useState(initialStep);
  const [stepMessage, setStepMessage] = useState<StepsMessageKey | null>(null);
  const [check, setCheck] = useState<CheckState>({ kind: "idle" });
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [witnessId, setWitnessId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const witnessLocationId = witnessId ?? draft.dialogs[0]?.locationId ?? null;

  // Cada cambio deja un testigo por locación de las provincias elegidas (se agregan y se quitan con las provincias)
  const update = useCallback((change: (d: CaseDraft) => CaseDraft) => setDraft((d) => syncWitnesses(change(d), catalog)), [catalog]);

  // Solo el caso nuevo se guarda como borrador en el navegador; la edición se guarda al confirmar
  useEffect(() => {
    if (!isEdit && submit.kind !== "saved") saveCaseDraft({ draft, step });
  }, [draft, step, submit.kind, isEdit]);

  const runCheck = useCallback(async () => {
    setCheck({ kind: "checking" });
    try {
      setCheck({ kind: "checked", result: await checkCaseDraft(draft) });
    } catch (err) {
      setCheck({ kind: "error", message: err instanceof Error ? err.message : t("checkFailed") });
    }
  }, [draft, t]);

  const isLast = step === WIZARD_STEPS.length - 1;

  const goTo = (target: number) => {
    // Para avanzar, los pasos anteriores tienen que estar completos
    for (let s = step; s < target; s++) {
      const message = stepError(s, draft, catalog);
      if (message) {
        setStep(s);
        setStepMessage(message);
        return;
      }
    }
    setStepMessage(null);
    setStep(target);
    if (target === WIZARD_STEPS.length - 1) void runCheck();
  };

  const save = async () => {
    setSubmit({ kind: "saving" });
    try {
      const saved = await submitCaseDraft(draft);
      if (!isEdit) clearCaseDraft();
      setSubmit({ kind: "saved", id: saved.id, initialTime: saved.initialTime });
    } catch (err) {
      const errors = err instanceof CaseDraftRejectedError ? err.errors : [];
      setSubmit({ kind: "failed", message: err instanceof Error ? err.message : t("saveFailed"), errors });
    }
  };

  const discard = () => {
    clearCaseDraft();
    setDraft(EMPTY_CASE_DRAFT);
    setStep(0);
    setCheck({ kind: "idle" });
    setSubmit({ kind: "idle" });
  };

  const stepProps = { draft, update, catalog };
  const canSave = check.kind === "checked" && check.result.isValid && submit.kind !== "saving";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EditorHeader
        draft={draft}
        step={step}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((v) => !v)}
        onGoTo={goTo}
        onClose={() => onClose(submit.kind === "saved")}
      />

      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto px-5 py-4">
          {editNotice && submit.kind !== "saved" && (editNotice.inProgressSessions > 0 || editNotice.hasConditionalQuestions) && (
            <div className="mb-4 space-y-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
              {editNotice.inProgressSessions > 0 && <p>{t("inProgress", { n: editNotice.inProgressSessions })}</p>}
              {editNotice.hasConditionalQuestions && <p>{t("conditional")}</p>}
            </div>
          )}

          {submit.kind === "saved" ? (
            <div className="py-10 text-center">
              <p className="text-lg font-semibold text-emerald-300">{t("saved", { id: submit.id, action: isEdit ? t("updated") : t("created") })}</p>
              <p className="mt-2 text-sm text-slate-400">{t("savedDetail", { hours: submit.initialTime, level: draft.groupLevel })}</p>
            </div>
          ) : (
            <>
              {step === 0 && <StepCase {...stepProps} />}
              {step === 1 && <StepProvinces {...stepProps} />}
              {step === 2 && <StepRoute {...stepProps} />}
              {step === 3 && <StepSuspects {...stepProps} />}
              {step === 4 && <StepClues {...stepProps} />}
              {step === 5 && <StepWitnesses {...stepProps} selectedId={witnessLocationId} onSelect={setWitnessId} />}
              {step === 6 && <StepReview {...stepProps} check={check} onCheck={runCheck} />}
            </>
          )}

          {stepMessage && <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{ts(stepMessage)}</p>}
          {submit.kind === "failed" && (
            <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {submit.message}
              {submit.errors.length > 0 && <ul className="mt-1 list-disc pl-5">{submit.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
            </div>
          )}
        </main>

        {/* Vista previa del juego: se actualiza a medida que se completa el paso */}
        {showPreview && submit.kind !== "saved" && (
          <aside className="hidden w-[46%] shrink-0 overflow-y-auto border-l border-white/10 bg-[#0a0f18] px-5 py-4 lg:block">
            <GamePreview step={step} draft={draft} catalog={catalog} witnessLocationId={witnessLocationId} />
          </aside>
        )}
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-white/10 px-5 py-4">
        {submit.kind === "saved" ? (
          <button className="ml-auto rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18]" onClick={() => onClose(true)}>{t("done")}</button>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <button className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-slate-400 hover:text-slate-100" onClick={onBack}>
                <AdminIcon name="arrowLeft" className="size-3.5" /> {t("home")}
              </button>
              {!isEdit && <button className="rounded-md px-3 py-2 text-sm text-slate-400 hover:text-red-300" onClick={discard}>{t("discard")}</button>}
            </div>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.04]" onClick={() => { setStepMessage(null); setStep(step - 1); }}>
                  {t("back")}
                </button>
              )}
              {isLast ? (
                <button className="rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18] hover:bg-[#ecd29a] disabled:opacity-50" onClick={save} disabled={!canSave}>
                  {submit.kind === "saving" ? t("saving") : isEdit ? t("saveChanges") : t("createCase")}
                </button>
              ) : (
                <button className="rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18] hover:bg-[#ecd29a]" onClick={() => goTo(step + 1)}>
                  {t("next")}
                </button>
              )}
            </div>
          </>
        )}
      </footer>
    </div>
  );
}
