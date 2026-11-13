import type { CaseStory } from "@/lib/caseStories";
import type { SfxType } from "@/lib/audioManager";

export type ScriptLine =
  | { kind: "locutor" | "narrador"; text: string }
  | { kind: "efecto"; text: string; sfx: SfxType };

/** Frecuencia del dial de cada capítulo (solo decorativa) */
export const chapterFrequency = (level: number) => 540 + (level - 1) * 140;

// Separa la sinopsis en oraciones para que el narrador las lea de a una
const sentences = (text: string) => text.match(/[^.!?…]+[.!?…]+/g)?.map((s) => s.trim()) ?? [text];

// Guion del capítulo armado SOLO con lo que muestra la historia pública del caso (sin pistas ni sospechosos)
export function buildScript(story: CaseStory): ScriptLine[] {
  return [
    { kind: "efecto", text: "CORTINA MUSICAL DE RADIO POLICIAL", sfx: "radio" },
    { kind: "locutor", text: `Radio Policial presenta… Capítulo ${story.level}: «${story.title}».` },
    { kind: "efecto", text: "SIRENA", sfx: "warning" },
    { kind: "narrador", text: story.headline },
    ...sentences(story.synopsis).map((text): ScriptLine => ({ kind: "narrador", text })),
    { kind: "efecto", text: "MÁQUINA DE ESCRIBIR", sfx: "typewriter" },
    { kind: "locutor", text: `Todo empieza en ${story.place}, ${story.province}.` },
    { kind: "narrador", text: story.tagline },
    { kind: "efecto", text: "GOLPE DE SELLO", sfx: "stamp" },
    { kind: "locutor", text: "¿Quién fue? Descúbralo… jugando." },
  ];
}
