// Propuestas de pantalla de sospechosos. La galería (/galerias) muestra un botón por cada una y cada una se ve en /galerias/<id>.
export type Galeria = {
  id: string;
  name: string;
  description: string;
  /** Color de fondo de la tarjeta en la galería */
  tone: string;
};

export const GALERIAS: Galeria[] = [
  {
    id: "album",
    name: "Álbum de figuritas",
    description: "Una página por release con las figuritas pegadas y su contador. La página nueva tiene pestaña “¡NUEVA!” y figuritas holográficas.",
    tone: "#1d4e89",
  },
  {
    id: "fichero",
    name: "Fichero de prontuarios",
    description: "Un mueble metálico con un cajón por release. El cajón nuevo tiene cinta de “INGRESO RECIENTE” y fichas con sello “NUEVO”.",
    tone: "#3b4654",
  },
  {
    id: "muro",
    name: "Muro de carteles",
    description: "Carteles de “persona de interés” en una pared. Los viejos están gastados; los nuevos, recién pegados bajo “RECIÉN LLEGADOS A LA CIUDAD”.",
    tone: "#5a2a1e",
  },
  {
    id: "rueda",
    name: "Rueda de reconocimiento",
    description: "Una fila contra la pared con las líneas de altura, una por release. La rueda nueva entra con reflector.",
    tone: "#2c3340",
  },
  {
    id: "diario",
    name: "Edición especial del diario",
    description: "Cada release es una tapa de El Vespertino. La más nueva arriba, con titular grande; las anteriores, en la hemeroteca.",
    tone: "#7a1212",
  },
];
