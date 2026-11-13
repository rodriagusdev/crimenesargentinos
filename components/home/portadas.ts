// Portadas disponibles para la home. La galería (/portadas) muestra un botón por cada una y cada una se ve en /portadas/<id>.
export type Portada = {
  id: string;
  name: string;
  description: string;
  /** Color de fondo de la tarjeta en la galería */
  tone: string;
};

export const PORTADAS: Portada[] = [
  {
    id: "mesa",
    name: "La mesa del detective",
    description: "Un escritorio con objetos que son secciones: carpeta para jugar, mapa, manual, radio, diario y ranking.",
    tone: "#4a2e18",
  },
  {
    id: "trailer",
    name: "Tráiler",
    description: "Un tráiler de cine de 30 segundos con sonido: pista, persecución, interrogatorio y orden de arresto.",
    tone: "#0b1426",
  },
  {
    id: "diario",
    name: "Diario de tapa",
    description: "La home es la tapa de El Vespertino: último momento, cupón de inscripción y pasatiempos.",
    tone: "#7a1212",
  },
  {
    id: "pizarra",
    name: "Pizarra de casos abiertos",
    description: "Fichas de casos reales en un corcho con hilo rojo, datos de la Central y el podio secreto.",
    tone: "#6b4423",
  },
  {
    id: "relampago",
    name: "Caso relámpago",
    description: "Demo jugable sin cuenta: una pista, tres provincias y 30 segundos para atrapar al prófugo.",
    tone: "#13203a",
  },
];

/** La portada que hoy se muestra en "/" */
export const CURRENT_PORTADA = "mesa";
