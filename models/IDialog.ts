// PODRIA ser TODO: Si ves que no necesitamos nada mas respecto a esta estrucutra para el sospechoso, integralo. Pero yo por ahora lo dejaria pasar

export interface IDialogMessage {
  speaker: "npc" | "player" | "narrator";
  text: string;
}

export interface IDialogQuestion {
  id: string;
  text: string;
  answer: string;
  requiredFlag?: string | string[];
  unlocksFlag?: string | string[];
  unlocksClue?: string;
}

export default interface IDialog {
  provinceId: number;
  locationId: number;
  npc: string;
  overlayBackgroundUrl: string;
  npcCompleteUrl: string;
  portraitUrl: string;
  infoBackground: string;
  intro: IDialogMessage[];
  questions: IDialogQuestion[];
}