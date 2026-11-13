"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import { useT } from "@/hooks/useT";
import { emptyQuestion, type CaseDraft, type CaseDraftDialog, type CaseDraftMessage, type DialogSpeaker } from "@/models/ICaseDraft";
import ContentTextField from "./ContentTextField";
import ImageUrlField from "./ImageUrlField";
import QuestionEditor from "./QuestionEditor";
import { witnessMessages } from "./WitnessEditor.messages";
import WizardField, { adminInputClass } from "./WizardField";

interface Props {
  draft: CaseDraft;
  dialog: CaseDraftDialog;
  locationName: string;
  onChange: (change: (dialog: CaseDraftDialog) => CaseDraftDialog) => void;
}

const SPEAKERS = [
  { value: "npc", label: "speakerNpc" },
  { value: "player", label: "speakerPlayer" },
  { value: "narrator", label: "speakerNarrator" },
] as const satisfies readonly { value: DialogSpeaker; label: string }[];

// Testigo de una locación: imágenes, texto del lugar, intro y preguntas
export default function WitnessEditor({ draft, dialog, locationName, onChange }: Props) {
  const t = useT(witnessMessages);
  const isHideout = dialog.locationId === draft.criminalLocationId;
  const clues = draft.clues.filter((c) => !c.isInitial);
  const usedClueKeys = new Set(draft.dialogs.flatMap((d) => d.questions.map((q) => q.clueKey)).filter((k): k is string => !!k));
  const imageProps = { level: draft.groupLevel, caseTitle: draft.title };

  const setMessage = (i: number, change: Partial<CaseDraftMessage>) =>
    onChange((d) => ({ ...d, messages: d.messages.map((m, j) => (j === i ? { ...m, ...change } : m)) }));

  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold text-slate-100">
        {locationName} {isHideout && <span className="ml-2 rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-200">{t("hideout")}</span>}
      </h4>

      <WizardField label={t("witness")} hint={t("witnessHint")}>
        <ContentTextField
          es={dialog.npcName}
          en={dialog.npcNameEn}
          onEs={(npcName) => onChange((d) => ({ ...d, npcName }))}
          onEn={(npcNameEn) => onChange((d) => ({ ...d, npcNameEn }))}
        />
      </WizardField>

      <div className="grid gap-3 sm:grid-cols-2">
        <ImageUrlField label={t("portrait")} kind="portrait" value={dialog.portraitUrl} onChange={(url) => onChange((d) => ({ ...d, portraitUrl: url }))} {...imageProps} />
        <ImageUrlField label={t("introImage")} kind="dialog" value={dialog.overlayBackgroundUrl} onChange={(url) => onChange((d) => ({ ...d, overlayBackgroundUrl: url }))} {...imageProps} />
        <ImageUrlField label={t("sceneImage")} kind="dialog" value={dialog.npcCompleteUrl} onChange={(url) => onChange((d) => ({ ...d, npcCompleteUrl: url }))} hint={t("sceneHint")} {...imageProps} />
      </div>

      <WizardField label={t("placeText")} hint={t("placeTextHint")}>
        <ContentTextField
          multiline
          className="min-h-16"
          es={dialog.infoBackground}
          en={dialog.infoBackgroundEn}
          onEs={(text) => onChange((d) => ({ ...d, infoBackground: text || null }))}
          onEn={(infoBackgroundEn) => onChange((d) => ({ ...d, infoBackgroundEn }))}
        />
      </WizardField>

      <section className="space-y-2">
        <p className="text-sm font-medium text-slate-200">{t("introTitle")}</p>
        {dialog.messages.map((message, i) => (
          <div key={i} className="flex items-start gap-2">
            <select value={message.speaker} onChange={(e) => setMessage(i, { speaker: e.target.value as DialogSpeaker })} className={`${adminInputClass} w-32 shrink-0`}>
              {SPEAKERS.map((s) => <option key={s.value} value={s.value}>{t(s.label)}</option>)}
            </select>
            <ContentTextField es={message.text} en={message.textEn} onEs={(text) => setMessage(i, { text })} onEn={(textEn) => setMessage(i, { textEn })} />
            <button type="button" onClick={() => onChange((d) => ({ ...d, messages: d.messages.filter((_, j) => j !== i) }))} className="rounded-md px-2 py-2 text-slate-400 hover:bg-white/[0.06] hover:text-red-300" aria-label={t("removeMessage")}>
              <AdminIcon name="trash" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange((d) => ({ ...d, messages: [...d.messages, { speaker: "npc", text: "", textEn: null }] }))} className="inline-flex items-center gap-1.5 text-xs text-[#E1C380] hover:underline">
          <AdminIcon name="plus" className="size-3.5" /> {t("addMessage")}
        </button>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-slate-200">{t("questions")}</p>
        {isHideout && <p className="text-xs text-slate-400">{t("hideoutNote")}</p>}
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
          <AdminIcon name="plus" className="size-3.5" /> {t("addQuestion")}
        </button>
      </section>
    </div>
  );
}
