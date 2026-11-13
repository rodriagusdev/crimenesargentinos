import { defineMessages } from "@/lib/i18n/messages";

// Textos del tráiler: placas, subtítulos de las escenas, reproductor y póster
export const trailerScreenMessages = defineMessages({
  es: {
    cardClock: "BUENOS AIRES · 03:14 HS",
    captionHeist: "Un golpe sacude al país.",
    cardNobody: "NADIE VIO NADA…",
    cardAlmost: "…O CASI NADIE.",
    captionMap: "De Jujuy a Tierra del Fuego.",
    captionQuestions: "Cada pregunta cuesta tiempo.",
    cardWarrant: "TENÉS UNA SOLA ORDEN DE ARRESTO.",
    tagline: "AHORA EN TU NAVEGADOR",
    pause: "Pausar el tráiler",
    resume: "Seguir viendo el tráiler",
    progress: "Progreso del tráiler",
    skip: "SALTAR ▸▸",
    endTitle: "¿Te animás, agente?",
    playNow: "JUGAR AHORA",
    rules: "VER REGLAS",
    replay: "↺ VOLVER A VER",
    watch: "VER TRÁILER",
    posterNote: "{seconds} segundos · con sonido · espacio para pausar",
  },
  en: {
    cardClock: "BUENOS AIRES · 3:14 AM",
    captionHeist: "One heist rocks the nation.",
    cardNobody: "NOBODY SAW A THING…",
    cardAlmost: "…ALMOST NOBODY.",
    captionMap: "From Jujuy to Tierra del Fuego.",
    captionQuestions: "Every question costs you time.",
    cardWarrant: "YOU GET ONE ARREST WARRANT.",
    tagline: "NOW PLAYING IN YOUR BROWSER",
    pause: "Pause the trailer",
    resume: "Keep watching the trailer",
    progress: "Trailer progress",
    skip: "SKIP ▸▸",
    endTitle: "Think you've got what it takes, agent?",
    playNow: "PLAY NOW",
    rules: "SEE THE RULES",
    replay: "↺ WATCH AGAIN",
    watch: "WATCH TRAILER",
    posterNote: "{seconds} seconds · sound on · space to pause",
  },
});

export type TrailerMessageKey = keyof (typeof trailerScreenMessages)["es"];
