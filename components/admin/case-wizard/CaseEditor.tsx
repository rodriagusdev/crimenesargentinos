"use client";

import { useCallback, useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import { clearCaseDraft, saveCaseDraft } from "@/lib/caseDraftStorage";
import { EMPTY_CASE_DRAFT, emptyDialog, type CaseDraft, type CaseDraftLoaded } from "@/models/ICaseDraft";
import { checkCaseDraft, submitCaseDraft, CaseDraftRejectedError } from "@/services/caseAuthoringService";
import StepCase from "./StepCase";
import StepClues from "./StepClues";
import StepProvinces from "./StepProvinces";
import StepReview, { type CheckState } from "./StepReview";
import StepRoute from "./StepRoute";
import StepSuspects from "./StepSuspects";
import StepWitnesses from "./StepWitnesses";
import GamePreview from "./preview/GamePreview";
import { stepError, WIZARD_STEPS } from "./steps";
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
  const isEdit = initialDraft.id != null;
  const [draft, setDraft] = useState<CaseDraft>(initialDraft);
  const [step, setStep] = useState(initialStep);
  const [stepMessage, setStepMessage] = useState<string | null>(null);
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
      setCheck({ kind: "error", message: err instanceof Error ? err.message : "No se pudo validar el caso." });
    }
  }, [draft]);

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
      setSubmit({ kind: "failed", message: err instanceof Error ? err.message : "No se pudo guardar el caso.", errors });
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
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
            {isEdit ? `Editando caso #${draft.id}` : "Nuevo caso"} · paso {step + 1} de {WIZARD_STEPS.length}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-50">{WIZARD_STEPS[step].title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowPreview((v) => !v)} className="hidden items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/[0.04] lg:inline-flex">
            <AdminIcon name="image" className="size-3.5" />
            {showPreview ? "Ocultar vista previa" : "Ver vista previa"}
          </button>
          <button className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/[0.06] hover:text-slate-100" onClick={() => onClose(submit.kind === "saved")} aria-label="Cerrar">
            <AdminIcon name="close" />
          </button>
        </div>
      </header>

      <ol className="flex gap-1 overflow-x-auto border-b border-white/10 px-5 py-3">
        {WIZARD_STEPS.map((s, i) => (
          <li key={s.title} className="min-w-28 flex-1">
            <button type="button" onClick={() => goTo(i)} className="w-full text-left">
              <span className={`block h-1 rounded-full ${i <= step ? "bg-[#E1C380]" : "bg-white/10"}`} />
              <span className={`mt-1.5 block text-xs font-medium ${i === step ? "text-[#E1C380]" : "text-slate-400"}`}>{i + 1}. {s.title}</span>
              <span className="block text-[11px] text-slate-500">{s.subtitle}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto px-5 py-4">
          {editNotice && submit.kind !== "saved" && (editNotice.inProgressSessions > 0 || editNotice.hasConditionalQuestions) && (
            <div className="mb-4 space-y-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
              {editNotice.inProgressSessions > 0 && <p>Hay {editNotice.inProgressSessions} partida(s) en curso de este caso: los cambios les llegan al guardar.</p>}
              {editNotice.hasConditionalQuestions && <p>Este caso tiene preguntas condicionales (flags): se conservan, pero se editan desde la tabla de Flags de preguntas.</p>}
            </div>
          )}

          {submit.kind === "saved" ? (
            <div className="py-10 text-center">
              <p className="text-lg font-semibold text-emerald-300">Caso #{submit.id} {isEdit ? "actualizado" : "creado"}</p>
              <p className="mt-2 text-sm text-slate-400">Tiempo inicial calculado: {submit.initialTime} h. Se sortea en el nivel {draft.groupLevel}.</p>
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

          {stepMessage && <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{stepMessage}</p>}
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
          <button className="ml-auto rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18]" onClick={() => onClose(true)}>Listo</button>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <button className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-slate-400 hover:text-slate-100" onClick={onBack}>
                <AdminIcon name="arrowLeft" className="size-3.5" /> Inicio
              </button>
              {!isEdit && <button className="rounded-md px-3 py-2 text-sm text-slate-400 hover:text-red-300" onClick={discard}>Descartar borrador</button>}
            </div>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.04]" onClick={() => { setStepMessage(null); setStep(step - 1); }}>
                  Atrás
                </button>
              )}
              {isLast ? (
                <button className="rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18] hover:bg-[#ecd29a] disabled:opacity-50" onClick={save} disabled={!canSave}>
                  {submit.kind === "saving" ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear caso"}
                </button>
              ) : (
                <button className="rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18] hover:bg-[#ecd29a]" onClick={() => goTo(step + 1)}>
                  Siguiente
                </button>
              )}
            </div>
          </>
        )}
      </footer>
    </div>
  );
}
