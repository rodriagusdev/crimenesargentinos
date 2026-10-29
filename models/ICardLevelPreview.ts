export interface ICardLevelPreview {
  id: number;
  title: string;
  description: string;
  imageURL: string;
  videoURL?: string;
  canPlay: boolean;
  completed?: boolean; // ganó alguna variante del nivel en la vuelta: se puede volver a jugar
  variantsTotal?: number; // variantes (casos) del nivel
  variantsWon?: number; // variantes que ganó alguna vez
}