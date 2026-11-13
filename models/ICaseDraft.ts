// Caso completo que arma el asistente del panel (mismo formato que CaseDraft del backend)

export type DialogSpeaker = "npc" | "player" | "narrator";

export interface CaseDraftProvince {
  provinceId: string;
  top: string | null;
  left: string | null;
  icon: string | null;
}

export interface CaseDraftSuspect {
  suspectId: string;
  isGuilty: boolean;
}

// Traducciones al inglés: opcionales (los borradores viejos no las tienen). Vacías: el juego muestra el castellano

// key: identificador del panel para que las preguntas apunten a la pista antes de guardarla
export interface CaseDraftClue {
  key: string;
  description: string;
  descriptionEn?: string | null;
  isInitial: boolean;
}

export interface CaseDraftMessage {
  speaker: DialogSpeaker;
  text: string;
  textEn?: string | null;
}

// En el escondite, la primera pregunta usa foundAnswer / lostAnswer en lugar de answer.
// id / lostId: filas existentes al editar un caso (se conservan porque las partidas las referencian)
export interface CaseDraftQuestion {
  id: string | null;
  lostId: string | null;
  text: string;
  answer: string;
  clueKey: string | null;
  foundAnswer: string | null;
  lostAnswer: string | null;
  textEn?: string | null;
  answerEn?: string | null;
  foundAnswerEn?: string | null;
  lostAnswerEn?: string | null;
}

export interface CaseDraftDialog {
  locationId: string;
  npcName: string;
  portraitUrl: string | null;
  overlayBackgroundUrl: string | null;
  npcCompleteUrl: string | null;
  infoBackground: string | null;
  npcNameEn?: string | null;
  infoBackgroundEn?: string | null;
  messages: CaseDraftMessage[];
  questions: CaseDraftQuestion[];
}

export interface CaseDraft {
  id: number | null; // null: caso nuevo
  title: string;
  description: string;
  briefing: string | null;
  titleEn?: string | null;
  descriptionEn?: string | null;
  briefingEn?: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  groupLevel: number;
  initialPI: number;
  travelProvinceTime: number;
  travelProvincePi: number;
  travelLocationTime: number;
  travelLocationPi: number;
  askQuestionTime: number;
  askQuestionPi: number;
  startLocationId: string | null;
  criminalLocationId: string | null;
  provinces: CaseDraftProvince[];
  suspects: CaseDraftSuspect[];
  clues: CaseDraftClue[];
  dialogs: CaseDraftDialog[];
}

export interface CaseDraftCheck {
  errors: string[];
  routeHours: number | null;
  questionCount: number;
  initialTime: number | null;
  isValid: boolean;
}

// Costos iguales a los de los casos existentes
// Caso existente cargado para editar
export interface CaseDraftLoaded {
  draft: CaseDraft;
  hasConditionalQuestions: boolean;
  inProgressSessions: number;
}

export const EMPTY_CASE_DRAFT: CaseDraft = {
  id: null,
  title: "",
  description: "",
  briefing: null,
  imageUrl: null,
  videoUrl: null,
  groupLevel: 1,
  initialPI: 100,
  travelProvinceTime: 12,
  travelProvincePi: 5,
  travelLocationTime: 3,
  travelLocationPi: 3,
  askQuestionTime: 1,
  askQuestionPi: 5,
  startLocationId: null,
  criminalLocationId: null,
  provinces: [],
  suspects: [],
  clues: [],
  dialogs: [],
};

export function emptyQuestion(): CaseDraftQuestion {
  return { id: null, lostId: null, text: "", answer: "", clueKey: null, foundAnswer: null, lostAnswer: null };
}

export function emptyDialog(locationId: string): CaseDraftDialog {
  return {
    locationId,
    npcName: "",
    portraitUrl: null,
    overlayBackgroundUrl: null,
    npcCompleteUrl: null,
    infoBackground: null,
    messages: [{ speaker: "npc", text: "" }],
    questions: [emptyQuestion()],
  };
}
