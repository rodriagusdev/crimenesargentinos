"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import { emptyQuestion, type CaseDraft, type CaseDraftDialog, type DialogSpeaker } from "@/models/ICaseDraft";
import ImageUrlField from "./ImageUrlField";
import QuestionEditor from "./QuestionEditor";
import WizardField, { adminInputClass } from "./WizardField";

interface Props {
  draft: CaseDraft;
  dialog: CaseDraftDialog;
  locationName: string;
  onChange: (change: (dialog: CaseDraftDialog) => CaseDraftDialog) => void;
}

const SPEAKERS: { value: DialogSpeaker; label: string }[] = [
  { value: "npc", label: "Testigo" },
  { value: "player", label: "Jugador" },
  { value: "narrator", label: "Narrador" },
];

// Testigo de una locación: imágenes, texto del lugar, intro y preguntas
export default function WitnessEditor({ draft, dialog, locationName, onChange }: Props) {
  const isHideout = dialog.locationId === draft.criminalLocationId;
  const clues = draft.clues.filter((c) => !c.isInitial);
  const usedClueKeys = new Set(draft.dialogs.flatMap((d) => d.questions.map((q) => q.clueKey)).filter((k): k is string => !!k));
  const imageProps = { level: draft.groupLevel, caseTitle: draft.title };

  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold text-slate-100">
        {locationName} {isHideout && <span className="ml-2 rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-200">Escondite</span>}
      </h4>

      <WizardField label="Testigo" hint="Nombre y rol, ej. «Doña Elsa, guía del parque».">
        <input value={dialog.npcName} onChange={(e) => onChange((d) => ({ ...d, npcName: e.target.value }))} className={adminInputClass} />
      </WizardField>

      <div className="grid gap-3 sm:grid-cols-2">
        <ImageUrlField label="Retrato (cara)" kind="portrait" value={dialog.portraitUrl} onChange={(url) => onChange((d) => ({ ...d, portraitUrl: url }))} {...imageProps} />
        <ImageUrlField label="Intro (paisaje sin el testigo)" kind="dialog" value={dialog.overlayBackgroundUrl} onChange={(url) => onChange((d) => ({ ...d, overlayBackgroundUrl: url }))} {...imageProps} />
        <ImageUrlField label="Escena del interrogatorio (con el testigo)" kind="dialog" value={dialog.npcCompleteUrl} onChange={(url) => onChange((d) => ({ ...d, npcCompleteUrl: url }))} hint="También es la miniatura de la locación en este caso." {...imageProps} />
      </div>

      <WizardField label="Texto del lugar" hint="Dato real del lugar que se lee en la intro.">
        <textarea value={dialog.infoBackground ?? ""} onChange={(e) => onChange((d) => ({ ...d, infoBackground: e.target.value || null }))} className={`${adminInputClass} min-h-16`} />
      </WizardField>

      <section className="space-y-2">
        <p className="text-sm font-medium text-slate-200">Intro de la conversación</p>
        {dialog.messages.map((message, i) => (
          <div key={i} className="flex gap-2">
            <select
              value={message.speaker}
              onChange={(e) => onChange((d) => ({ ...d, messages: d.messages.map((m, j) => (j === i ? { ...m, speaker: e.target.value as DialogSpeaker } : m)) }))}
              className={`${adminInputClass} w-32`}
            >
              {SPEAKERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <input value={message.text} onChange={(e) => onChange((d) => ({ ...d, messages: d.messages.map((m, j) => (j === i ? { ...m, text: e.target.value } : m)) }))} className={adminInputClass} />
            <button type="button" onClick={() => onChange((d) => ({ ...d, messages: d.messages.filter((_, j) => j !== i) }))} className="rounded-md px-2 text-slate-400 hover:bg-white/[0.06] hover:text-red-300" aria-label="Quitar mensaje">
              <AdminIcon name="trash" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange((d) => ({ ...d, messages: [...d.messages, { speaker: "npc", text: "" }] }))} className="inline-flex items-center gap-1.5 text-xs text-[#E1C380] hover:underline">
          <AdminIcon name="plus" className="size-3.5" /> Agregar mensaje
        </button>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-slate-200">Preguntas</p>
        {isHideout && <p className="text-xs text-slate-400">La primera pregunta del escondite tiene dos respuestas: si llegás con la orden a tiempo lo encontrás, si no, se escapó.</p>}
        {dialog.questions.map((question, i) => (
          <QuestionEditor
            key={i}
            index={i}
            question={question}
            foundLost={isHideout && i === 0}
            clues={clues}
            usedClueKeys={usedClueKeys}
            onChange={(change) => onChange((d) => ({ ...d, questions: d.questions.map((q, j) => (j === i ? { ...q, ...change } : q)) }))}
            onRemove={dialog.questions.length > 1 ? () => onChange((d) => ({ ...d, questions: d.questions.filter((_, j) => j !== i) })) : undefined}
          />
        ))}
        <button type="button" onClick={() => onChange((d) => ({ ...d, questions: [...d.questions, emptyQuestion()] }))} className="inline-flex items-center gap-1.5 text-xs text-[#E1C380] hover:underline">
          <AdminIcon name="plus" className="size-3.5" /> Agregar pregunta
        </button>
      </section>
    </div>
  );
}
