export interface ICardLevelPreview {
  id: number; // nivel real del juego (1-5, 16-18…): se usa para jugar
  displayLevel: number; // número que ve el jugador: correlativo (1, 2, 3… sin saltos)
  title: string;
  description: string;
  imageURL: string;
  videoURL?: string;
  canPlay: boolean;
  completed?: boolean; // ganó alguna variante del nivel en la vuelta: se puede volver a jugar
  variantsTotal?: number; // variantes (casos) del nivel
  variantsWon?: number; // variantes que ganó alguna vez
}