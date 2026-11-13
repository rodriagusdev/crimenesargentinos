"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import { useT } from "@/hooks/useT";
import { useCaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import { clearCaseDraft, loadCaseDraft } from "@/lib/caseDraftStorage";
import { EMPTY_CASE_DRAFT, type CaseDraft, type CaseDraftLoaded } from "@/models/ICaseDraft";
import CaseEditor from "./CaseEditor";
import CasePicker from "./CasePicker";
import CaseWizardStart from "./CaseWizardStart";
import { caseWizardMessages } from "./CaseWizard.messages";

type Mode =
  | { kind: "start" }
  | { kind: "pick" }
  | { kind: "editor"; draft: CaseDraft; step: number; notice: Omit<CaseDraftLoaded, "draft"> | null };

interface Props {
  onClose: (changed: boolean) => void;
}

// Asistente de casos a pantalla completa: primero se elige crear uno nuevo o editar uno existente
export default function CaseWizard({ onClose }: Props) {
  const t = useT(caseWizardMessages);
  const catalogState = useCaseWizardCatalog();
  const [mode, setMode] = useState<Mode>({ kind: "start" });
  const [storedDraft, setStoredDraft] = useState(() => loadCaseDraft());

  const startNew = (resume: boolean) => {
    if (!resume) clearCaseDraft();
    setMode({ kind: "editor", draft: resume && storedDraft ? storedDraft.draft : EMPTY_CASE_DRAFT, step: resume ? storedDraft?.step ?? 0 : 0, notice: null });
  };

  // El selector ya cargó el caso para mostrar su vista previa: se abre el editor con eso
  const edit = ({ draft, ...notice }: CaseDraftLoaded) => setMode({ kind: "editor", draft, step: 0, notice });

  const backToStart = () => {
    setStoredDraft(loadCaseDraft());
    setMode({ kind: "start" });
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#0d1421]">
      {mode.kind !== "editor" && (
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{t("wizard")}</p>
          <button className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/[0.06] hover:text-slate-100" onClick={() => onClose(false)} aria-label={t("close")}>
            <AdminIcon name="close" />
          </button>
        </header>
      )}

      {catalogState.kind === "loading" && <p className="p-5 text-sm text-slate-400">{t("loadingCatalog")}</p>}
      {catalogState.kind === "error" && <p className="p-5 text-sm text-red-300">{catalogState.message}</p>}

      {catalogState.kind === "ready" && (
        <>
          {mode.kind === "start" && <CaseWizardStart storedDraft={storedDraft} onNew={startNew} onEdit={() => setMode({ kind: "pick" })} />}
          {mode.kind === "pick" && <CasePicker catalog={catalogState.catalog} onEdit={edit} onBack={() => setMode({ kind: "start" })} />}
          {mode.kind === "editor" && (
            <CaseEditor
              key={mode.draft.id ?? "new"}
              catalog={catalogState.catalog}
              initialDraft={mode.draft}
              initialStep={mode.step}
              editNotice={mode.notice}
              onBack={backToStart}
              onClose={onClose}
            />
          )}
        </>
      )}
    </div>
  );
}
