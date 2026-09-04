export interface ICardLevelPreview {
  id: number;
  title: string;
  description: string;
  imageURL: string;
  videoURL?: string;
  canPlay: boolean;
}