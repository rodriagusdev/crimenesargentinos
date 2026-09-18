export default interface IDialog {
  provinceId: number;
  locationId: number;
  npc: string;
  overlayBackgroundUrl: string;
  npcCompleteUrl: string;
  portraitUrl: string;
  infoBackground: string;
  introText: string;
  questions: string[];
  answers: string[];
}