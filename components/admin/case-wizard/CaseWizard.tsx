"use client";

import { useCallback, useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import { useCaseWizardCatalog, type CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import { clearCaseDraft, loadCaseDraft, saveCaseDraft } from "@/lib/caseDraftStorage";
import { EMPTY_CASE_DRAFT, emptyDialog, type CaseDraft } from "@/models/ICaseDraft";
import { checkCaseDraft, createCaseFromDraft, CaseDraftRejectedError } from "@/services/caseAuthoringService";
import StepCase from "./StepCase";
import StepClues from "./StepClues";
import StepProvinces from "./StepProvinces";
import StepReview, { type CheckState } from "./StepReview";
import StepRoute from "./StepRoute";
import StepSuspects from "./StepSuspects";
import StepWitnesses from "./StepWitnesses";
import { stepError, WIZARD_STEPS } from "./steps";
import { caseLocations } from "./types";

type SubmitState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; id: number; initialTime: number }
  | { kind: "failed"; message: string; errors: string[] };

interface Props {
  onClose: (created: boolean) => void;
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

// Asistente para crear un caso completo, paso a paso. El borrador se guarda en este navegador hasta crearlo
export default function CaseWizard({ onClose }: Props) {
  const catalogState = useCaseWizardCatalog();
  const [stored] = useState(() => loadCaseDraft());
  const [draft, setDraft] = useState<CaseDraft>(stored?.draft ?? EMPTY_CASE_DRAFT);
  const [step, setStep] = useState(stored?.step ?? 0);
  const [stepMessage, setStepMessage] = useState<string | null>(null);
  const [check, setCheck] = useState<CheckState>({ kind: "idle" });
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });

  const catalog = catalogState.kind === "ready" ? catalogState.catalog : null;

  // Cada cambio deja un testigo por locación de las provincias elegidas (se agregan y se quitan con las provincias)
  const update = useCallback(
    (change: (d: CaseDraft) => CaseDraft) => setDraft((d) => (catalog ? syncWitnesses(change(d), catalog) : change(d))),
    [catalog],
  );

  useEffect(() => {
    if (submit.kind !== "saved") saveCaseDraft({ draft, step });
  }, [draft, step, submit.kind]);

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
    if (!catalog) return;
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

  const create = async () => {
    setSubmit({ kind: "saving" });
    try {
      const created = await createCaseFromDraft(draft);
      clearCaseDraft();
      setSubmit({ kind: "saved", id: created.id, initialTime: created.initialTime });
    } catch (err) {
      const errors = err instanceof CaseDraftRejectedError ? err.errors : [];
      setSubmit({ kind: "failed", message: err instanceof Error ? err.message : "No se pudo crear el caso.", errors });
    }
  };

  const discard = () => {
    clearCaseDraft();
    setDraft(EMPTY_CASE_DRAFT);
    setStep(0);
    setCheck({ kind: "idle" });
    setSubmit({ kind: "idle" });
  };

  const stepProps = catalog ? { draft, update, catalog } : null;
  const canCreate = check.kind === "checked" && check.result.isValid && submit.kind !== "saving";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-2 sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col rounded-2xl border border-white/10 bg-[#0d1421] shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Nuevo caso · paso {step + 1} de {WIZARD_STEPS.length}</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-50">{WIZARD_STEPS[step].title}</h3>
          </div>
          <button className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/[0.06] hover:text-slate-100" onClick={() => onClose(submit.kind === "saved")} aria-label="Cerrar">
            <AdminIcon name="close" />
          </button>
        </header>

        <ol className="flex gap-1 overflow-x-auto border-b border-white/10 px-5 py-3">
          {WIZARD_STEPS.map((s, i) => (
            <li key={s.title} className="min-w-28 flex-1">
              <button type="button" onClick={() => goTo(i)} disabled={i > step && !catalog} className="w-full text-left">
                <span className={`block h-1 rounded-full ${i <= step ? "bg-[#E1C380]" : "bg-white/10"}`} />
                <span className={`mt-1.5 block text-xs font-medium ${i === step ? "text-[#E1C380]" : "text-slate-400"}`}>{i + 1}. {s.title}</span>
                <span className="block text-[11px] text-slate-500">{s.subtitle}</span>
              </button>
            </li>
          ))}
        </ol>

        <main className="flex-1 overflow-y-auto px-5 py-4">
          {catalogState.kind === "loading" && <p className="text-sm text-slate-400">Cargando provincias, locaciones y sospechosos...</p>}
          {catalogState.kind === "error" && <p className="text-sm text-red-300">{catalogState.message}</p>}
          {submit.kind === "saved" ? (
            <div className="py-10 text-center">
              <p className="text-lg font-semibold text-emerald-300">Caso #{submit.id} creado</p>
              <p className="mt-2 text-sm text-slate-400">Tiempo inicial calculado: {submit.initialTime} h. Ya se puede sortear en el nivel {draft.groupLevel}.</p>
            </div>
          ) : stepProps && (
            <>
              {step === 0 && <StepCase {...stepProps} />}
              {step === 1 && <StepProvinces {...stepProps} />}
              {step === 2 && <StepRoute {...stepProps} />}
              {step === 3 && <StepSuspects {...stepProps} />}
              {step === 4 && <StepClues {...stepProps} />}
              {step === 5 && <StepWitnesses {...stepProps} />}
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

        <footer className="flex items-center justify-between gap-2 border-t border-white/10 px-5 py-4">
          {submit.kind === "saved" ? (
            <button className="ml-auto rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18]" onClick={() => onClose(true)}>Listo</button>
          ) : (
            <>
              <button className="rounded-md px-3 py-2 text-sm text-slate-400 hover:text-red-300" onClick={discard}>Descartar borrador</button>
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.04]" onClick={() => { setStepMessage(null); setStep(step - 1); }}>
                    Atrás
                  </button>
                )}
                {isLast ? (
                  <button className="rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18] hover:bg-[#ecd29a] disabled:opacity-50" onClick={create} disabled={!canCreate}>
                    {submit.kind === "saving" ? "Creando..." : "Crear caso"}
                  </button>
                ) : (
                  <button className="rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18] hover:bg-[#ecd29a] disabled:opacity-50" onClick={() => goTo(step + 1)} disabled={!catalog}>
                    Siguiente
                  </button>
                )}
              </div>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
