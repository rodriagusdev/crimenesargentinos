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
  {
    id: "arribos",
    name: "Tablero de arribos",
    description: "La pantalla de llegadas del aeropuerto: cada sospechoso es un pasajero. El release nuevo entra girando las letras como “ATERRIZÓ HOY”.",
    tone: "#14171c",
  },
  {
    id: "estampillas",
    name: "Estampillas",
    description: "Cada release es una serie de estampillas en su hoja. La serie nueva, con colores vivos y matasellos de “primer día de emisión”.",
    tone: "#2b3a2f",
  },
  {
    id: "naipes",
    name: "Mazo criollo",
    description: "Cada release es un palo del mazo (espadas, copas, oros, bastos). El palo nuevo sale repartido; tocá una carta para darla vuelta.",
    tone: "#0f4a2c",
  },
  {
    id: "cartelera",
    name: "Cartelera de teatro",
    description: "Cada release es una temporada con su elenco y marquesina. La nueva es “¡ESTRENO!” con las luces prendidas; las viejas, apagadas.",
    tone: "#4a1414",
  },
  {
    id: "monitores",
    name: "Sala de monitores",
    description: "Una pared de televisores con cámaras. Los del release nuevo se encienden uno por uno como “CANAL NUEVO”.",
    tone: "#1a1c20",
  },
  {
    id: "guia",
    name: "Guía de personas",
    description: "Una guía telefónica retro, en orden alfabético. Cada release es una edición; las altas nuevas van resaltadas con marcador.",
    tone: "#1d3f8a",
  },
];
