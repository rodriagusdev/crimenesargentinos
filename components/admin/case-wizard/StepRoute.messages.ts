import { defineMessages } from "@/lib/i18n/messages";

export const stepRouteMessages = defineMessages({
  es: {
    choose: "Elegir...",
    intro: "El jugador arranca en la locación inicial, recorre todas las provincias siguiendo las pistas y termina en el escondite. El tiempo inicial del caso se calcula solo, con el recorrido más corto entre estos dos puntos.",
    start: "Locación inicial",
    startHint: "Donde vieron al sospechoso por última vez (va en una pista inicial).",
    hideout: "Escondite",
    hideoutHint: "Su testigo tiene la pregunta de encontrarlo / se escapó.",
    sameProvince: "La locación inicial y el escondite tienen que estar en provincias distintas.",
  },
  en: {
    choose: "Choose...",
    intro: "The player starts at the starting location, travels every province following the clues and ends at the hideout. The case's starting time is calculated automatically from the shortest route between these two points.",
    start: "Starting location",
    startHint: "Where the suspect was last seen (goes in an initial clue).",
    hideout: "Hideout",
    hideoutHint: "Its witness has the found-them / they-escaped question.",
    sameProvince: "The starting location and the hideout must be in different provinces.",
  },
});
