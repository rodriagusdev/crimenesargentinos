"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import type { CaseDraftClue } from "@/models/ICaseDraft";
import { adminInputClass } from "./WizardField";
import type { StepProps } from "./types";

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

// Paso 5: pistas. Las iniciales se tienen desde el principio; las otras las desbloquea una pregunta de un testigo
export default function StepClues({ draft, update, catalog }: StepProps) {
  const guilty = catalog.suspects.find((s) => s.id === draft.suspects.find((x) => x.isGuilty)?.suspectId);
  const others = catalog.suspects.filter((s) => draft.suspects.some((x) => x.suspectId === s.id && !x.isGuilty));

  const setClue = (key: string, change: Partial<CaseDraftClue>) =>
    update((d) => ({ ...d, clues: d.clues.map((c) => (c.key === key ? { ...c, ...change } : c)) }));

  const remove = (key: string) =>
    update((d) => ({
      ...d,
      clues: d.clues.filter((c) => c.key !== key),
      // las preguntas que la daban quedan sin pista
      dialogs: d.dialogs.map((dl) => ({ ...dl, questions: dl.questions.map((q) => (q.clueKey === key ? { ...q, clueKey: null } : q)) })),
    }));

  const add = (isInitial: boolean) =>
    update((d) => ({ ...d, clues: [...d.clues, { key: newKey(), description: "", isInitial }] }));

  const list = (isInitial: boolean) => (
    <div className="space-y-2">
      {draft.clues.filter((c) => c.isInitial === isInitial).map((clue) => (
        <div key={clue.key} className="flex gap-2">
          <input
            value={clue.description}
            onChange={(e) => setClue(clue.key, { description: e.target.value })}
            className={adminInputClass}
            placeholder={isInitial ? "Visto por última vez en el Obelisco (Buenos Aires)" : "Tiene bigote tupido."}
          />
          <button type="button" onClick={() => remove(clue.key)} className="rounded-md px-2 text-slate-400 hover:bg-white/[0.06] hover:text-red-300" aria-label="Quitar pista">
            <AdminIcon name="trash" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => add(isInitial)} className="inline-flex items-center gap-1.5 text-xs text-[#E1C380] hover:underline">
        <AdminIcon name="plus" className="size-3.5" /> Agregar pista
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-300">
        <p className="font-medium text-slate-100">Una pista = un solo dato</p>
        <p className="mt-1">Cada pista dice un rasgo o un destino, nunca dos juntos («Tiene bigote tupido.», no «Tiene bigote tupido y gorra»). Entre todas tienen que alcanzar para descartar a los otros sospechosos.</p>
        {guilty && <p className="mt-2">Culpable: <b>{guilty.name}</b> — {guilty.traits.join(" · ")}</p>}
        {others.map((s) => (
          <p key={s.id} className="text-slate-400">{s.name} — {s.traits.join(" · ")}</p>
        ))}
      </div>

      <section>
        <h4 className="mb-2 text-sm font-medium text-slate-200">Pistas iniciales</h4>
        <p className="mb-2 text-xs text-slate-500">Dónde lo vieron por última vez y un primer rasgo.</p>
        {list(true)}
      </section>

      <section>
        <h4 className="mb-2 text-sm font-medium text-slate-200">Pistas que dan los testigos</h4>
        <p className="mb-2 text-xs text-slate-500">Rasgos del culpable y hacia dónde fue. En el paso siguiente elegís qué pregunta da cada una (exactamente una).</p>
        {list(false)}
      </section>
    </div>
  );
}
