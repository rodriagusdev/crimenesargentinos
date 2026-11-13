"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import { useT } from "@/hooks/useT";
import type { CaseDraftClue, CaseDraftQuestion } from "@/models/ICaseDraft";
import ContentTextField from "./ContentTextField";
import { pickText, useContentLanguage } from "./contentLanguage";
import { witnessMessages } from "./WitnessEditor.messages";
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
  const t = useT(witnessMessages);
  const lang = useContentLanguage();

  return (
    <div className="space-y-2 rounded-md border border-white/10 p-3">
      <div className="flex items-start gap-2">
        <span className="pt-2 text-xs font-semibold text-slate-400">{t("questionShort", { n: index + 1 })}</span>
        <ContentTextField
          es={question.text}
          en={question.textEn}
          onEs={(text) => onChange({ text })}
          onEn={(textEn) => onChange({ textEn })}
          placeholder={t("questionPlaceholder")}
        />
        {onRemove && (
          <button type="button" onClick={onRemove} className="rounded-md px-2 py-2 text-slate-400 hover:bg-white/[0.06] hover:text-red-300" aria-label={t("removeQuestion")}>
            <AdminIcon name="trash" />
          </button>
        )}
      </div>

      {foundLost ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <ContentTextField
            multiline
            className="min-h-16"
            es={question.foundAnswer}
            en={question.foundAnswerEn}
            onEs={(foundAnswer) => onChange({ foundAnswer })}
            onEn={(foundAnswerEn) => onChange({ foundAnswerEn })}
            placeholder={t("foundPlaceholder")}
          />
          <ContentTextField
            multiline
            className="min-h-16"
            es={question.lostAnswer}
            en={question.lostAnswerEn}
            onEs={(lostAnswer) => onChange({ lostAnswer })}
            onEn={(lostAnswerEn) => onChange({ lostAnswerEn })}
            placeholder={t("lostPlaceholder")}
          />
        </div>
      ) : (
        <>
          <ContentTextField
            multiline
            className="min-h-16"
            es={question.answer}
            en={question.answerEn}
            onEs={(answer) => onChange({ answer })}
            onEn={(answerEn) => onChange({ answerEn })}
            placeholder={t("answerPlaceholder")}
          />
          <select value={question.clueKey ?? ""} onChange={(e) => onChange({ clueKey: e.target.value || null })} className={adminInputClass}>
            <option value="">{t("noClue")}</option>
            {clues.map((clue) => (
              <option key={clue.key} value={clue.key} disabled={usedClueKeys.has(clue.key) && clue.key !== question.clueKey}>
                {pickText(clue.description, clue.descriptionEn, lang) || t("clueNoText")}
                {usedClueKeys.has(clue.key) && clue.key !== question.clueKey ? t("clueTaken") : ""}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}
