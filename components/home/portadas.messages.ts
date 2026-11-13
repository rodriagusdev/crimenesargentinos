import { defineMessages } from "@/lib/i18n/messages";

export const portadasMessages = defineMessages({
  es: {
    mesaName: "La mesa del detective",
    mesaDescription: "Un escritorio con objetos que son secciones: carpeta para jugar, mapa, manual, radio, diario y ranking.",
    trailerName: "Tráiler",
    trailerDescription: "Un tráiler de cine de 30 segundos con sonido: pista, persecución, interrogatorio y orden de arresto.",
    diarioName: "Diario de tapa",
    diarioDescription: "La home es la tapa de El Vespertino: último momento, cupón de inscripción y pasatiempos.",
    pizarraName: "Pizarra de casos abiertos",
    pizarraDescription: "Fichas de casos reales en un corcho con hilo rojo, datos de la Central y el podio secreto.",
    relampagoName: "Caso relámpago",
    relampagoDescription: "Demo jugable sin cuenta: una pista, tres provincias y 30 segundos para atrapar al prófugo.",
  },
  en: {
    mesaName: "The detective's desk",
    mesaDescription: "A desk where every object is a section: case folder to play, map, manual, radio, newspaper and leaderboard.",
    trailerName: "Trailer",
    trailerDescription: "A 30-second movie trailer with sound: clue, chase, interrogation and arrest warrant.",
    diarioName: "Front page",
    diarioDescription: "The home page is the front page of El Vespertino: breaking news, sign-up coupon and puzzles.",
    pizarraName: "Open cases board",
    pizarraDescription: "Real case cards on a corkboard with red string, Headquarters stats and the secret podium.",
    relampagoName: "Lightning case",
    relampagoDescription: "Playable demo, no account needed: one clue, three provinces and 30 seconds to catch the fugitive.",
  },
});

export type PortadaMessageKey = keyof (typeof portadasMessages)["es"];
