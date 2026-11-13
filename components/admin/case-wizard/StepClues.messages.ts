import { defineMessages } from "@/lib/i18n/messages";

export const stepCluesMessages = defineMessages({
  es: {
    initialPlaceholder: "Visto por última vez en el Obelisco (Buenos Aires)",
    witnessPlaceholder: "Tiene bigote tupido.",
    removeClue: "Quitar pista",
    addClue: "Agregar pista",
    ruleTitle: "Una pista = un solo dato",
    ruleBody: "Cada pista dice un rasgo o un destino, nunca dos juntos («Tiene bigote tupido.», no «Tiene bigote tupido y gorra»). Entre todas tienen que alcanzar para descartar a los otros sospechosos.",
    culprit: "Culpable:",
    initialTitle: "Pistas iniciales",
    initialHint: "Dónde lo vieron por última vez y un primer rasgo.",
    witnessTitle: "Pistas que dan los testigos",
    witnessHint: "Rasgos del culpable y hacia dónde fue. En el paso siguiente elegís qué pregunta da cada una (exactamente una).",
  },
  en: {
    initialPlaceholder: "Last seen at the Obelisco (Buenos Aires)",
    witnessPlaceholder: "Has a bushy mustache.",
    removeClue: "Remove clue",
    addClue: "Add clue",
    ruleTitle: "One clue = one fact",
    ruleBody: "Each clue gives one trait or one destination, never two at once («Has a bushy mustache.», not «Has a bushy mustache and a cap»). Together they must be enough to rule out the other suspects.",
    culprit: "Culprit:",
    initialTitle: "Initial clues",
    initialHint: "Where the suspect was last seen and a first trait.",
    witnessTitle: "Clues given by witnesses",
    witnessHint: "The culprit's traits and where they went. In the next step you pick which question gives each one (exactly one).",
  },
});
