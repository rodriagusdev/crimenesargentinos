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
  caseId: number;
  provinceId: string; // guid
  locationId: string; // guid
  npc: string;
  overlayBackgroundUrl: string;
  npcCompleteUrl: string;
  portraitUrl: string;
  infoBackground: string;
  intro: IDialogMessage[];
  questions: IDialogQuestion[];
}