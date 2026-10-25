export type MuseumItemStatus = "recovered" | "investigating";

export interface IMuseumItem {
  id: string;
  title: string;
  subtitle: string;
  level: number;
  caseName: string;
  province: string;
  category: "Deportivo" | "Histórico" | "Paleontológico" | "Joyería" | "Astronómico" | "Literario";
  estimatedValue: string;
  recoveredDate: string;
  status: MuseumItemStatus;
  icon: string;
  image?: string;
  description: string;
  policeReport: string;
}
