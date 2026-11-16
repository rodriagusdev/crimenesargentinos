import { defineMessages } from "@/lib/i18n/messages";
import type { MessageVars } from "@/lib/i18n/messages";

export const videotecaMessages = defineMessages({
  es: {
    // Pantalla
    heading: "UN TRÁILER POR CASO",
    tapesCount: "{n} cintas · elegí una del estante",
    // Destacado
    featuredAria: "Caso destacado: {title}",
    brand: "VIDEOTECA DE LA CENTRAL",
    caseFile: "EXPEDIENTE {n}",
    level: "NIVEL {n}",
    trailerLength: "TRÁILER · {s} s",
    watchTrailer: "VER TRÁILER",
    takeCase: "TOMAR EL CASO",
    // Estante
    shelfAria: "Cintas de los casos",
    prevTapes: "Casetes anteriores",
    nextTapes: "Casetes siguientes",
    pagerAria: "Casetes",
    jumpTape: "Ver el casete {n}: {title}",
    pickTape: "Elegir el casete de {title}",
    tapeLabel: "EXP. {n}",
    chosen: "▶ ELEGIDA",
    // Escenas del tráiler
    archive: "ARCHIVO DE LA CENTRAL",
    crimeScene: "LUGAR DEL HECHO",
    wanted: "SE BUSCA: {what}",
    presents: "PRESENTA",
    // Televisor y reproductor
    noSignal: "SIN SEÑAL",
    pickFromShelf: "Elegí una cinta del estante",
    restOfFile: "El resto del expediente se abre al jugar.",
    takeThisCase: "TOMAR ESTE CASO",
    nextTapeButton: "SIGUIENTE CINTA ▶",
    pause: "Pausar",
    play: "Reproducir",
    skipToEnd: "Saltar al final",
    eject: "Sacar la cinta",
    osdPause: "❚❚ PAUSA",
    tapeOf: "EXPEDIENTE {n} · CINTA {i} / {total}",
    closeTrailer: "Cerrar el tráiler",
    close: "CERRAR",
    prevTape: "Cinta anterior",
    prevShort: "ANTERIOR",
    pauseShort: "PAUSA",
    nextTape: "Cinta siguiente",
    nextShort: "SIGUIENTE",
  },
  en: {
    heading: "ONE TRAILER PER CASE",
    tapesCount: "{n} tapes · pick one from the shelf",
    featuredAria: "Featured case: {title}",
    brand: "CENTRAL VIDEO LIBRARY",
    caseFile: "CASE FILE {n}",
    level: "LEVEL {n}",
    trailerLength: "TRAILER · {s} s",
    watchTrailer: "WATCH TRAILER",
    takeCase: "TAKE THE CASE",
    shelfAria: "Case tapes",
    prevTapes: "Previous tapes",
    nextTapes: "Next tapes",
    pagerAria: "Tapes",
    jumpTape: "Show tape {n}: {title}",
    pickTape: "Pick the tape for {title}",
    tapeLabel: "FILE {n}",
    chosen: "▶ PICKED",
    archive: "CENTRAL ARCHIVES",
    crimeScene: "CRIME SCENE",
    wanted: "WANTED: {what}",
    presents: "PRESENTS",
    noSignal: "NO SIGNAL",
    pickFromShelf: "Pick a tape from the shelf",
    restOfFile: "The rest of the file opens when you play.",
    takeThisCase: "TAKE THIS CASE",
    nextTapeButton: "NEXT TAPE ▶",
    pause: "Pause",
    play: "Play",
    skipToEnd: "Skip to the end",
    eject: "Eject the tape",
    osdPause: "❚❚ PAUSE",
    tapeOf: "CASE FILE {n} · TAPE {i} / {total}",
    closeTrailer: "Close the trailer",
    close: "CLOSE",
    prevTape: "Previous tape",
    prevShort: "PREVIOUS",
    pauseShort: "PAUSE",
    nextTape: "Next tape",
    nextShort: "NEXT",
  },
});

export type VideotecaKey = keyof (typeof videotecaMessages)["es"];
/** Traductor de la videoteca (lo que devuelve `useT(videotecaMessages)`) */
export type VideotecaT = (key: VideotecaKey, vars?: MessageVars) => string;

/** Número de expediente con dos cifras */
export const fileNumber = (n: number) => String(n).padStart(2, "0");
