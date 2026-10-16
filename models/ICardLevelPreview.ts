export interface ICardLevelPreview {
  id: number;
  title: string;
  description: string;
  imageURL: string;
  videoURL?: string;
  canPlay: boolean;
  completed?: boolean; // nivel ya ganado: se puede rejugar (con un caso ya ganado)
}