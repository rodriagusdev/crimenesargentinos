export default interface IDialog {
  provinceId: number;
  locationId: number;
  npc: string;
  overlayBackgroundUrl?: string;
  portraitUrl: string;
  introText: string;
  questions: string[];
  answers: string[];
}