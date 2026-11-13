"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import type { StoredCaseDraft } from "@/lib/caseDraftStorage";

interface Props {
  storedDraft: StoredCaseDraft | null;
  onNew: (resume: boolean) => void;
  onEdit: () => void;
}

const optionClass =
  "group flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-[#0a0f18] p-6 text-left transition hover:border-[#E1C380]/60 hover:bg-[#101a2a]";

// Primera pantalla del asistente: crear un caso nuevo o editar uno existente
export default function CaseWizardStart({ storedDraft, onNew, onEdit }: Props) {
  const draftTitle = storedDraft?.draft.title.trim();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-6 px-5 py-10">
      <div>
        <h2 className="text-2xl font-semibold text-slate-50">¿Qué querés hacer?</h2>
        <p className="mt-1 text-sm text-slate-400">El asistente te lleva paso a paso, con una vista previa del juego a medida que lo completás.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className={optionClass}>
          <span className="flex size-11 items-center justify-center rounded-xl bg-[#E1C380]/15 text-[#E1C380]"><AdminIcon name="plus" className="size-5" /></span>
          <span>
            <span className="block text-lg font-semibold text-slate-100">Crear caso nuevo</span>
            <span className="mt-1 block text-sm text-slate-400">Un caso original o una variante de uno existente (mismo nivel, otro recorrido y otro culpable).</span>
          </span>
          {storedDraft ? (
            <div className="mt-1 flex flex-wrap gap-2">
              <button type="button" onClick={() => onNew(true)} className="rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18] hover:bg-[#ecd29a]">
                Continuar borrador{draftTitle ? `: ${draftTitle}` : ""}
              </button>
              <button type="button" onClick={() => onNew(false)} className="rounded-md border border-white/10 px-3.5 py-2 text-sm text-slate-200 hover:bg-white/[0.04]">
                Empezar de cero
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => onNew(false)} className="mt-1 rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18] hover:bg-[#ecd29a]">
              Empezar
            </button>
          )}
        </div>

        <button type="button" onClick={onEdit} className={optionClass}>
          <span className="flex size-11 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300"><AdminIcon name="edit" className="size-5" /></span>
          <span>
            <span className="block text-lg font-semibold text-slate-100">Editar un caso existente</span>
            <span className="mt-1 block text-sm text-slate-400">Abre el caso con todos sus pasos completos para cambiar textos, testigos, pistas o el recorrido.</span>
          </span>
          <span className="mt-1 inline-flex items-center gap-1.5 text-sm text-sky-300 group-hover:underline">
            Elegir caso <AdminIcon name="arrowRight" className="size-3.5" />
          </span>
        </button>
      </div>
    </div>
  );
}
