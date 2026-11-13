import { defineMessages } from "@/lib/i18n/messages";

export const levelCardMessages = defineMessages({
  es: {
    ctaReplay: "REJUGAR",
    ctaPlay: "JUGAR",
    ctaInvestigate: "INVESTIGAR",
    ctaLocked: "RESOLVE EL NIVEL ANTERIOR",
    reportArchived: "INFORME DEL CASO · ARCHIVADO",
    report: "INFORME DEL CASO",
    reportClassified: "INFORME CLASIFICADO",
    oneVariantLeft: "QUEDA 1 VARIANTE",
    variantsLeft: "QUEDAN {n} VARIANTES",
    ariaLabel: "Nivel {n}: {title}",
    caseClosed: "✓ CASO CERRADO",
    solved: "✓ RESUELTO",
    starting: "INICIANDO CASO...",
  },
  en: {
    ctaReplay: "REPLAY",
    ctaPlay: "PLAY",
    ctaInvestigate: "INVESTIGATE",
    ctaLocked: "SOLVE THE PREVIOUS LEVEL",
    reportArchived: "CASE REPORT · ARCHIVED",
    report: "CASE REPORT",
    reportClassified: "CLASSIFIED REPORT",
    oneVariantLeft: "1 VARIANT LEFT",
    variantsLeft: "{n} VARIANTS LEFT",
    ariaLabel: "Level {n}: {title}",
    caseClosed: "✓ CASE CLOSED",
    solved: "✓ SOLVED",
    starting: "STARTING CASE...",
  },
});

export type LevelCardMessageKey = keyof (typeof levelCardMessages)["es"];
