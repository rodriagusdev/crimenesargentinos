import IMenuAction from "@/models/IMenuAction";

export const MENU_ACTIONS: IMenuAction[] = [
  {
    id: "clues",
    title: "Pistas",
    description: "Cuaderno de notas y evidencias",
    icon: "/images/icons/icon_clues.jpg",
    detail:
      "Revisa todas las pistas recopiladas a partir de las declaraciones de los testigos en cada ubicación.",
  },
  {
    id: "suspects",
    title: "Sospechosos",
    description: "Perfiles y antecedentes",
    icon: "/images/icons/icon_suspects.jpg",
    detail:
      "Consulta los expedientes y rasgos particulares de los posibles sospechosos involucrados en este caso.",
  },
  {
    id: "arrest",
    title: "Orden de Arresto",
    description: "Emisión de captura judicial",
    icon: "/images/icons/icon_arrestorder.jpg",
    detail:
      "Emite una orden de arresto cuando tengas suficiente evidencia para acusar formalmente al sospechoso.",
  },
];
