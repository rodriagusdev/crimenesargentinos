import { defineMessages } from "@/lib/i18n/messages";

export const stepCaseMessages = defineMessages({
  es: {
    title: "Título",
    titleHint: "Si es una variante, usá el título del original con un subtítulo: «El Bandoneón de Oro: Peña en el Litoral».",
    level: "Nivel",
    levelHint: "Las variantes de un caso comparten nivel: el nivel sortea entre todos sus casos. Un número nuevo crea un nivel nuevo.",
    casesInLevel: "Ya hay {n} caso(s) en este nivel: {titles}",
    description: "Descripción",
    descriptionHint: "Se ve en la tarjeta del nivel.",
    briefing: "Briefing",
    briefingHint: "Lo que lee el jugador al empezar: qué se robó y dónde lo vieron por última vez.",
    image: "Imagen de la tarjeta",
    imageHint: "Las variantes usan la misma imagen que el caso original.",
    video: "Video (URL, opcional)",
  },
  en: {
    title: "Title",
    titleHint: "For a variant, use the original's title with a subtitle: «El Bandoneón de Oro: Peña en el Litoral».",
    level: "Level",
    levelHint: "Variants of a case share a level: the level draws among all its cases. A new number creates a new level.",
    casesInLevel: "This level already has {n} case(s): {titles}",
    description: "Description",
    descriptionHint: "Shown on the level card.",
    briefing: "Briefing",
    briefingHint: "What the player reads at the start: what was stolen and where the suspect was last seen.",
    image: "Card image",
    imageHint: "Variants use the same image as the original case.",
    video: "Video (URL, optional)",
  },
});
