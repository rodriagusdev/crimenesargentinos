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

// key: identificador del panel para que las preguntas apunten a la pista antes de guardarla
export interface CaseDraftClue {
  key: string;
  description: string;
  isInitial: boolean;
}

export interface CaseDraftMessage {
  speaker: DialogSpeaker;
  text: string;
}

// En el escondite, la primera pregunta usa foundAnswer / lostAnswer en lugar de answer
export interface CaseDraftQuestion {
  text: string;
  answer: string;
  clueKey: string | null;
  foundAnswer: string | null;
  lostAnswer: string | null;
}

export interface CaseDraftDialog {
  locationId: string;
  npcName: string;
  portraitUrl: string | null;
  overlayBackgroundUrl: string | null;
  npcCompleteUrl: string | null;
  infoBackground: string | null;
  messages: CaseDraftMessage[];
  questions: CaseDraftQuestion[];
}

export interface CaseDraft {
  title: string;
  description: string;
  briefing: string | null;
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
export const EMPTY_CASE_DRAFT: CaseDraft = {
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
  return { text: "", answer: "", clueKey: null, foundAnswer: null, lostAnswer: null };
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
