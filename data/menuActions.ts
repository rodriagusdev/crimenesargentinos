import IMenuAction from "@/models/IMenuAction";
import { defineMessages, translate } from "@/lib/i18n/messages";

export const menuActionsMessages = defineMessages({
  es: {
    boardTitle: "Tablero del Caso",
    boardDescription: "Mural de investigación, pistas y sospechosos",
    boardDetail: "Mural interactivo con todas las evidencias recolectadas, los perfiles de sospechosos e hilos de deducción.",
  },
  en: {
    boardTitle: "Case Board",
    boardDescription: "Investigation wall, clues and suspects",
    boardDetail: "Interactive wall with all the evidence collected, suspect profiles and threads of deduction.",
  },
});

// Los textos se leen al usarlos (getters), así salen en el idioma vigente y no en el de la carga del módulo
export const MENU_ACTIONS: IMenuAction[] = [
  {
    id: "board",
    get title() {
      return translate(menuActionsMessages, "boardTitle");
    },
    get description() {
      return translate(menuActionsMessages, "boardDescription");
    },
    icon: "/images/icons/icon_clues.jpg",
    get detail() {
      return translate(menuActionsMessages, "boardDetail");
    },
  },
];
