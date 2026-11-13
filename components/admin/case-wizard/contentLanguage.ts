import { create } from "zustand";
import type { Locale } from "@/lib/i18n/locale";
import type { CaseDraft } from "@/models/ICaseDraft";

// Idioma del contenido que se está editando en el asistente (independiente del idioma del panel).
// Lo cambia el encabezado del editor y lo leen los campos de texto y la vista previa
interface ContentLanguageState {
  lang: Locale;
  setLang: (lang: Locale) => void;
}

export const useContentLanguageStore = create<ContentLanguageState>()((set) => ({
  lang: "es",
  setLang: (lang) => set({ lang }),
}));

export function useContentLanguage(): Locale {
  return useContentLanguageStore((s) => s.lang);
}

const has = (value: string | null | undefined): value is string => !!value?.trim();

// Texto en el idioma pedido; el inglés vacío cae al castellano (igual que en el juego)
export function pickText<T extends string | null>(es: T, en: string | null | undefined, lang: Locale): T | string {
  return lang === "en" && has(en) ? en : es;
}

// El borrador con los textos en el idioma pedido, para la vista previa
export function localizeDraft(draft: CaseDraft, lang: Locale): CaseDraft {
  if (lang === "es") return draft;
  return {
    ...draft,
    title: pickText(draft.title, draft.titleEn, lang),
    description: pickText(draft.description, draft.descriptionEn, lang),
    briefing: pickText(draft.briefing, draft.briefingEn, lang),
    clues: draft.clues.map((c) => ({ ...c, description: pickText(c.description, c.descriptionEn, lang) })),
    dialogs: draft.dialogs.map((d) => ({
      ...d,
      npcName: pickText(d.npcName, d.npcNameEn, lang),
      infoBackground: pickText(d.infoBackground, d.infoBackgroundEn, lang),
      messages: d.messages.map((m) => ({ ...m, text: pickText(m.text, m.textEn, lang) })),
      questions: d.questions.map((q) => ({
        ...q,
        text: pickText(q.text, q.textEn, lang),
        answer: pickText(q.answer, q.answerEn, lang),
        foundAnswer: pickText(q.foundAnswer, q.foundAnswerEn, lang),
        lostAnswer: pickText(q.lostAnswer, q.lostAnswerEn, lang),
      })),
    })),
  };
}

// Cuenta los textos con castellano cargado y sin su traducción
function countMissing(pairs: [string | null | undefined, string | null | undefined][]): number {
  return pairs.filter(([es, en]) => has(es) && !has(en)).length;
}

// Traducciones al inglés que faltan, por paso del asistente (0: caso, 4: pistas, 5: testigos)
export function missingEnglishByStep(draft: CaseDraft): Record<number, number> {
  const witnesses = draft.dialogs.flatMap((d) => {
    const isHideout = d.locationId === draft.criminalLocationId;
    return [
      [d.npcName, d.npcNameEn],
      [d.infoBackground, d.infoBackgroundEn],
      ...d.messages.map((m) => [m.text, m.textEn]),
      ...d.questions.flatMap((q, i) =>
        isHideout && i === 0
          ? [[q.text, q.textEn], [q.foundAnswer, q.foundAnswerEn], [q.lostAnswer, q.lostAnswerEn]]
          : [[q.text, q.textEn], [q.answer, q.answerEn]]
      ),
    ] as [string | null, string | null | undefined][];
  });

  return {
    0: countMissing([[draft.title, draft.titleEn], [draft.description, draft.descriptionEn], [draft.briefing, draft.briefingEn]]),
    4: countMissing(draft.clues.map((c) => [c.description, c.descriptionEn])),
    5: countMissing(witnesses),
  };
}
