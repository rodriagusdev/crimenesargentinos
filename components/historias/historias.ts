// Propuestas de página pública con las historias de los casos. La galería (/historias) muestra un botón por cada una
// y cada una se ve en /historias/<id>.
export type Historia = {
  id: string;
  name: string;
  description: string;
  /** Color de fondo de la tarjeta en la galería */
  tone: string;
};

export const HISTORIAS: Historia[] = [
  {
    id: "trailer",
    name: "Tráiler de los casos",
    description: "Un tráiler de cine que presenta los casos uno por uno: el hecho, el lugar y la frase gancho, con sonido.",
    tone: "#0b1426",
  },
  {
    id: "manual",
    name: "Manual de expedientes",
    description: "En línea con “¿Cómo se juega?”: un cuadernillo con una pestaña por caso y el parte policial de cada uno.",
    tone: "#6b5638",
  },
  {
    id: "censurados",
    name: "Expedientes censurados",
    description: "Carpetas “CLASIFICADO”: se lee el parte del hecho y el resto del informe aparece tachado con barras negras.",
    tone: "#1b1813",
  },
  {
    id: "sebusca",
    name: "Se busca… el objeto",
    description: "Carteles de recompensa del objeto robado, no del ladrón: qué se busca y dónde se lo vio por última vez.",
    tone: "#7a4a1f",
  },
  {
    id: "vespertino",
    name: "Tapas de El Vespertino",
    description: "Cada caso es la tapa del diario del día del hecho. Todas juntas forman una hemeroteca para hojear.",
    tone: "#7a1212",
  },
  {
    id: "afiches",
    name: "Próximos estrenos",
    description: "Cada caso es el afiche de una película con su frase gancho; al tocarlo se abre la sinopsis.",
    tone: "#3a1a4a",
  },
  {
    id: "mapa",
    name: "Mapa del delito",
    description: "Un mapa de la Argentina con un chinche donde empieza cada caso; al tocarlo aparece la historia.",
    tone: "#13203a",
  },
  {
    id: "radioteatro",
    name: "Radioteatro policial",
    description: "Cada caso es un capítulo de “Radio Policial”: guion con locutor y efectos, que termina en “¿quién fue?”.",
    tone: "#4a3a12",
  },
];
