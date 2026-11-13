"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import { useT } from "@/hooks/useT";
import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import type { CaseDraftLoaded } from "@/models/ICaseDraft";
import { loadCaseForEdit } from "@/services/caseAuthoringService";
import BoardPreview from "./preview/BoardPreview";
import CardPreview from "./preview/CardPreview";
import { caseWizardMessages } from "./CaseWizard.messages";
import MapPreview from "./preview/MapPreview";
import { adminInputClass } from "./WizardField";

type Selection =
  | { kind: "none" }
  | { kind: "loading"; caseId: number }
  | { kind: "ready"; caseId: number; loaded: CaseDraftLoaded }
  | { kind: "error"; caseId: number; message: string };

interface Props {
  catalog: CaseWizardCatalog;
  onEdit: (loaded: CaseDraftLoaded) => void;
  onBack: () => void;
}

// Casos existentes agrupados por nivel. Al elegir uno se ve su vista previa antes de abrirlo en el editor
export default function CasePicker({ catalog, onEdit, onBack }: Props) {
  const t = useT(caseWizardMessages);
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<Selection>({ kind: "none" });

  const term = search.trim().toLowerCase();
  const visible = catalog.cases.filter((c) => !term || c.title.toLowerCase().includes(term) || String(c.id) === term);
  const levels = [...new Set(visible.map((c) => c.groupLevel))].sort((a, b) => a - b);
  const selectedId = selection.kind === "none" ? null : selection.caseId;

  const select = async (caseId: number) => {
    setSelection({ kind: "loading", caseId });
    try {
      const loaded = await loadCaseForEdit(caseId);
      setSelection((s) => (s.kind === "loading" && s.caseId === caseId ? { kind: "ready", caseId, loaded } : s));
    } catch (err) {
      setSelection({ kind: "error", caseId, message: err instanceof Error ? err.message : t("loadFailed") });
    }
  };

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex w-full flex-col gap-5 overflow-y-auto px-5 py-6 lg:w-[42%] lg:shrink-0 lg:border-r lg:border-white/10">
        <div>
          <button type="button" onClick={onBack} className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100">
            <AdminIcon name="arrowLeft" className="size-3.5" /> {t("back")}
          </button>
          <h2 className="text-2xl font-semibold text-slate-50">{t("pickTitle")}</h2>
          <input value={search} onChange={(e) => setSearch(e.target.value)} className={`${adminInputClass} mt-3`} placeholder={t("searchPlaceholder")} />
        </div>

        {levels.length === 0 && <p className="text-sm text-slate-400">{t("noMatches")}</p>}

        {levels.map((level) => (
          <section key={level}>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">{t("level", { n: level })}</h3>
            <div className="grid gap-2">
              {visible
                .filter((c) => c.groupLevel === level)
                .sort((a, b) => a.id - b.id)
                .map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => select(c.id)}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition ${c.id === selectedId ? "border-[#E1C380] bg-[#E1C380]/10" : "border-white/10 bg-[#0a0f18] hover:border-[#E1C380]/50 hover:bg-[#101a2a]"}`}
                  >
                    <span>
                      <span className="block text-xs text-slate-500">{t("caseNumber", { id: c.id })}</span>
                      <span className="block text-sm font-medium text-slate-100">{c.title}</span>
                    </span>
                    <AdminIcon name="arrowRight" className="size-4 shrink-0 text-slate-500" />
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>

      {/* Vista previa del caso elegido: tarjeta, mapa y tablero, con el botón para abrirlo en el editor */}
      <aside className="hidden min-w-0 flex-1 overflow-y-auto bg-[#0a0f18] px-5 py-6 lg:block">
        {selection.kind === "none" && <p className="text-sm text-slate-400">{t("pickHint")}</p>}
        {selection.kind === "loading" && <p className="text-sm text-slate-400">{t("loadingCase", { id: selection.caseId })}</p>}
        {selection.kind === "error" && <p className="text-sm text-red-300">{selection.message}</p>}
        {selection.kind === "ready" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{t("caseAndLevel", { id: selection.caseId, level: selection.loaded.draft.groupLevel })}</p>
                <h3 className="text-lg font-semibold text-slate-50">{selection.loaded.draft.title}</h3>
              </div>
              <button type="button" onClick={() => onEdit(selection.loaded)} className="inline-flex items-center gap-2 rounded-md bg-[#E1C380] px-4 py-2 text-sm font-medium text-[#0a0f18] hover:bg-[#ecd29a]">
                <AdminIcon name="edit" /> {t("editThis")}
              </button>
            </div>
            <CardPreview draft={selection.loaded.draft} />
            <MapPreview draft={selection.loaded.draft} catalog={catalog} />
            <BoardPreview draft={selection.loaded.draft} catalog={catalog} />
          </div>
        )}
      </aside>

      {/* En pantallas chicas no hay vista previa al costado: se edita directo */}
      {selection.kind === "ready" && (
        <button type="button" onClick={() => onEdit(selection.loaded)} className="fixed bottom-5 right-5 rounded-md bg-[#E1C380] px-4 py-2 text-sm font-medium text-[#0a0f18] shadow-lg lg:hidden">
          {t("editCase", { id: selection.caseId })}
        </button>
      )}
    </div>
  );
}
