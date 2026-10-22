export interface ISubLevel {
  code: "A" | "B" | "C";
  caseId: number;
  title: string;
  status: "completed" | "current" | "locked";
}

export interface ICardLevelPreview {
  id: number;
  title: string;
  description: string;
  imageURL: string;
  videoURL?: string;
  canPlay: boolean;
  completed?: boolean;
  subLevels: ISubLevel[];
}