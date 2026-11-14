// Historias de los casos para la página pública. SOLO lo que el juego ya muestra al empezar: qué pasó y dónde
// arranca el caso. Nunca la ruta de provincias, el escondite, lo que dicen los testigos, las pistas ni los
// sospechosos (ni rasgos: tampoco "una ladrona", "el chofer", "un petiso"…). Los textos de las seeds del
// backend NO se copian: varios traen pistas (dirección de la fuga, rasgos del culpable).

export type CaseStory = {
  id: string;
  /** Nivel del juego */
  level: number;
  title: string;
  /** Titular corto, en tono de diario */
  headline: string;
  /** Dos o tres oraciones: el hecho, sin la investigación */
  synopsis: string;
  /** Frase gancho, en tono de afiche de cine */
  tagline: string;
  /** Qué se busca (objeto o persona desaparecida, nunca al culpable) */
  wanted: string;
  /** Donde empieza el caso (el juego lo muestra al arrancar) */
  place: string;
  province: string;
  /** Arte del nivel (escena, sin personajes) */
  image: string;
  emoji: string;
  /** Arte propio del tráiler (pixel art sin texto): el lugar del hecho y lo que se busca. Si falta, se usa `image` */
  trailerArt?: { place?: string; wanted?: string; /** Fondo de la placa final ("el resto del expediente se abre al jugar") */ finale?: string };
};

export const CASE_STORIES: CaseStory[] = [
  {
    id: "estrellas",
    level: 1,
    title: "Robo a las Estrellas",
    headline: "¡Se robaron la Copa en pleno festejo!",
    synopsis:
      "La ciudad todavía cantaba cuando alguien aprovechó el descontrol y se llevó el trofeo. Al amanecer, al pie del Obelisco, solo quedaba la vitrina vacía.",
    tagline: "Ganamos todo. Y lo perdimos en una noche.",
    wanted: "El trofeo",
    place: "El Obelisco",
    province: "Ciudad de Buenos Aires",
    image: "/images/levelcardspreview/level_1_preview.jpg",
    emoji: "🏆",
    trailerArt: { place: "/images/historias/estrellas-lugar.webp", wanted: "/images/historias/estrellas-objeto.webp", finale: "/images/historias/estrellas-final.webp" },
  },
  {
    id: "mananeros",
    level: 2,
    title: "Desaparecen los Mañaneros",
    headline: "Ganaron el sorteo… y nunca volvieron",
    synopsis:
      "Un grupo de hinchas ganó un viaje soñado. La última vez que se los vio estaban sacándose fotos en el viejo presidio del fin del mundo. Desde entonces, silencio.",
    tagline: "El premio mayor era desaparecer.",
    wanted: "Los hinchas ganadores",
    place: "Presidio de Ushuaia",
    province: "Tierra del Fuego",
    image: "/images/levelcardspreview/level_2_preview.jpg",
    emoji: "🎟️",
    trailerArt: { place: "/images/historias/mananeros-lugar.webp", wanted: "/images/historias/mananeros-objeto.webp" },
  },
  {
    id: "patagonia",
    level: 3,
    title: "Caso Patagonia",
    headline: "Una muerte que nadie puede explicar",
    synopsis:
      "Lo que parecía una muerte natural empezó a oler mal. Entre la nieve del cerro, la Central abrió un expediente que nadie quiere firmar.",
    tagline: "En la nieve, todo deja huella.",
    wanted: "La verdad",
    place: "Cerro Catedral",
    province: "Río Negro",
    image: "/images/levelcardspreview/level_3_preview.jpg",
    emoji: "❄️",
    trailerArt: { place: "/images/historias/patagonia-lugar.webp", wanted: "/images/historias/patagonia-objeto.webp" },
  },
  {
    id: "ruta40",
    level: 4,
    title: "¿Qué pasó en la Ruta Nacional 40?",
    headline: "Robertito no aparece",
    synopsis:
      "Robertito salió una mañana y no volvió. Lo último que quedó de él fue una imagen borrosa frente a un cerro de siete colores. La ruta más larga del país guarda el resto.",
    tagline: "5.000 kilómetros. Una sola pregunta.",
    wanted: "Robertito",
    place: "Cerro de los Siete Colores",
    province: "Jujuy",
    image: "/images/levelcardspreview/level_4_preview.jpg",
    emoji: "🛣️",
    trailerArt: { place: "/images/historias/ruta40-lugar.webp", wanted: "/images/historias/ruta40-objeto.webp" },
  },
  {
    id: "provincias",
    level: 5,
    title: "El Asesino de las Provincias",
    headline: "Robo de diamantes en pleno carnaval",
    synopsis:
      "Entre plumas, tambores y lentejuelas, los diamantes de las pasistas se esfumaron en medio del desfile. Ellas exigen recuperarlos antes del próximo corso.",
    tagline: "El carnaval tapa todo. Hasta un robo.",
    wanted: "Los diamantes del carnaval",
    place: "Corsódromo de Gualeguaychú",
    province: "Entre Ríos",
    image: "/images/levelcardspreview/level_5_preview.jpg",
    emoji: "💎",
    trailerArt: { place: "/images/historias/provincias-lugar.webp", wanted: "/images/historias/provincias-objeto.webp" },
  },
  {
    id: "alfajor",
    level: 6,
    title: "El Gran Robo del Alfajor",
    headline: "Desapareció el camión de alfajores",
    synopsis:
      "La producción de toda la temporada iba en un solo camión. Cerca de la reserva, el camión dejó de dar señales. Si no aparece pronto, no va a quedar ni la miga.",
    tagline: "Dulce de leche, chocolate… y un crimen.",
    wanted: "El camión de alfajores",
    place: "Reserva Parque Luro",
    province: "La Pampa",
    image: "/images/levelcardspreview/alfajor.webp",
    emoji: "🍫",
    trailerArt: { place: "/images/historias/alfajor-lugar.webp", wanted: "/images/historias/alfajor-objeto.webp" },
  },
  {
    id: "camiseta",
    level: 7,
    title: "La Camiseta del 86",
    headline: "Se llevaron la camiseta del 86",
    synopsis:
      "La camiseta firmada del Mundial 86 estaba de gira por el país. En una muestra junto a las termas, alguien la descolgó y salió caminando como si nada.",
    tagline: "Hay goles que no se olvidan. Y robos tampoco.",
    wanted: "La camiseta firmada del 86",
    place: "Termas de Río Hondo",
    province: "Santiago del Estero",
    image: "/images/levelcardspreview/camiseta86.webp",
    emoji: "👕",
    trailerArt: { place: "/images/historias/camiseta-lugar.webp", wanted: "/images/historias/camiseta-objeto.webp" },
  },
  {
    id: "bandoneon",
    level: 8,
    title: "El Bandoneón de Oro",
    headline: "Silencio en la milonga: robaron el bandoneón de oro",
    synopsis:
      "Un tanguero histórico apoyó su bandoneón de oro un segundo para saludar. Cuando volvió, la funda estaba vacía y la milonga se quedó sin compás.",
    tagline: "Un tango sin bandoneón es apenas un susurro.",
    wanted: "El bandoneón de oro",
    place: "El Obelisco",
    province: "Ciudad de Buenos Aires",
    image: "/images/levelcardspreview/bandoneon.webp",
    emoji: "🪗",
    trailerArt: { place: "/images/historias/bandoneon-lugar.webp", wanted: "/images/historias/bandoneon-objeto.webp" },
  },
];
