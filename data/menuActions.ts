import IMenuAction from "@/models/IMenuAction";

export const MENU_ACTIONS: IMenuAction[] = [
  {
    id: "clues",
    title: "Pistas",
    description: "Cuaderno de notas y evidencias",
    icon: "/images/icons/icon_clues.jpg",
    detail:
      "Colección de pistas",
  },
  {
    id: "suspects",
    title: "Sospechosos",
    description: "Perfiles y antecedentes",
    icon: "/images/icons/icon_suspects.jpg",
    detail:
      "Consulta los expedientes y rasgos particulares de los posibles sospechosos involucrados en este caso.",
  },
];
