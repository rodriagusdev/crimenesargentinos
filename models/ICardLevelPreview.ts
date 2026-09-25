export interface ICardLevelPreview {
  id: number;
  title: string;
  description: string;
  imageURL: string;
  videoURL?: string;
  canPlay: boolean;
  completed?: boolean; // nivel ya ganado: no se vuelve a jugar
}