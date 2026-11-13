"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import type { CaseDraftClue, CaseDraftQuestion } from "@/models/ICaseDraft";
import { adminInputClass } from "./WizardField";

interface Props {
  index: number;
  question: CaseDraftQuestion;
  foundLost: boolean; // primera pregunta del escondite
  clues: CaseDraftClue[]; // pistas que no son iniciales
  usedClueKeys: Set<string>; // pistas que ya da otra pregunta del caso
  onChange: (change: Partial<CaseDraftQuestion>) => void;
  onRemove?: () => void;
}

// Una pregunta del testigo: texto, respuesta y la pista que desbloquea (o dos respuestas si es la del escondite)
export default function QuestionEditor({ index, question, foundLost, clues, usedClueKeys, onChange, onRemove }: Props) {
  return (
    <div className="space-y-2 rounded-md border border-white/10 p-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">P{index + 1}</span>
        <input value={question.text} onChange={(e) => onChange({ text: e.target.value })} className={adminInputClass} placeholder="¿Vio pasar a alguien raro?" />
        {onRemove && (
          <button type="button" onClick={onRemove} className="rounded-md px-2 text-slate-400 hover:bg-white/[0.06] hover:text-red-300" aria-label="Quitar pregunta">
            <AdminIcon name="trash" />
          </button>
        )}
      </div>

      {foundLost ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <textarea value={question.foundAnswer ?? ""} onChange={(e) => onChange({ foundAnswer: e.target.value })} className={`${adminInputClass} min-h-16`} placeholder="Si llegaste a tiempo: dónde está escondido" />
          <textarea value={question.lostAnswer ?? ""} onChange={(e) => onChange({ lostAnswer: e.target.value })} className={`${adminInputClass} min-h-16`} placeholder="Si llegaste tarde: se escapó" />
        </div>
      ) : (
        <>
          <textarea value={question.answer} onChange={(e) => onChange({ answer: e.target.value })} className={`${adminInputClass} min-h-16`} placeholder="Respuesta del testigo (si da una pista, que diga solo ese dato)" />
          <select value={question.clueKey ?? ""} onChange={(e) => onChange({ clueKey: e.target.value || null })} className={adminInputClass}>
            <option value="">No desbloquea pista</option>
            {clues.map((clue) => (
              <option key={clue.key} value={clue.key} disabled={usedClueKeys.has(clue.key) && clue.key !== question.clueKey}>
                {clue.description || "(pista sin texto)"}{usedClueKeys.has(clue.key) && clue.key !== question.clueKey ? " — ya la da otra pregunta" : ""}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}
