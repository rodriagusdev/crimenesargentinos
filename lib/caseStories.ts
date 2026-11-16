// Historias de los casos para la página pública. SOLO lo que el juego ya muestra al empezar: qué pasó y dónde
// arranca el caso. Nunca la ruta de provincias, el escondite, lo que dicen los testigos, las pistas ni los
// sospechosos (ni rasgos: tampoco "una ladrona", "el chofer", "un petiso"…). Los textos de las seeds del
// backend NO se copian: varios traen pistas (dirección de la fuga, rasgos del culpable).

import type { Locale } from "@/lib/i18n/locale";

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
  /** Versión en inglés de los textos (el título igual al que usa el juego). Lugar y provincia quedan en castellano */
  en: StoryText;
};

type StoryText = Pick<CaseStory, "title" | "headline" | "synopsis" | "tagline" | "wanted">;

/** Historias con los textos en el idioma pedido */
export function localizeStories(locale: Locale): CaseStory[] {
  return locale === "en" ? CASE_STORIES.map((s) => ({ ...s, ...s.en })) : CASE_STORIES;
}

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
    en: {
      title: "Robbing the Stars",
      headline: "The Cup stolen mid-celebration!",
      synopsis: "The city was still singing when someone used the chaos to walk off with the trophy. By dawn, at the foot of the Obelisco, only the empty display case was left.",
      tagline: "We won it all. And lost it in one night.",
      wanted: "The trophy",
    },
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
    en: {
      title: "The Mañaneros Vanish",
      headline: "They won the raffle… and never came back",
      synopsis: "A group of fans won a dream trip. They were last seen taking photos at the old prison at the end of the world. Since then, silence.",
      tagline: "The grand prize was disappearing.",
      wanted: "The winning fans",
    },
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
    en: {
      title: "The Patagonia Case",
      headline: "A death nobody can explain",
      synopsis: "What looked like a natural death started to smell wrong. In the snow on the mountain, the Central opened a file nobody wants to sign.",
      tagline: "In the snow, everything leaves a trace.",
      wanted: "The truth",
    },
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
    en: {
      title: "What Happened on Ruta Nacional 40?",
      headline: "Robertito is missing",
      synopsis: "Robertito went out one morning and never came back. All that was left of him was a blurry picture in front of a seven-colored hill. The country's longest road holds the rest.",
      tagline: "5,000 kilometers. One single question.",
      wanted: "Robertito",
    },
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
    en: {
      title: "The Provinces Killer",
      headline: "Diamond heist in the middle of carnival",
      synopsis: "Amid feathers, drums and sequins, the dancers' diamonds vanished in the middle of the parade. They demand them back before the next corso.",
      tagline: "Carnival covers everything. Even a robbery.",
      wanted: "The carnival diamonds",
    },
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
    en: {
      title: "The Great Alfajor Heist",
      headline: "The alfajor truck has disappeared",
      synopsis: "The whole season's production was riding in a single truck. Near the reserve, the truck stopped sending signals. If it doesn't turn up soon, there won't be a crumb left.",
      tagline: "Dulce de leche, chocolate… and a crime.",
      wanted: "The alfajor truck",
    },
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
    en: {
      title: "The '86 Jersey",
      headline: "They took the '86 jersey",
      synopsis: "The signed jersey from the '86 World Cup was touring the country. At an exhibition by the hot springs, someone took it off the wall and strolled out like nothing happened.",
      tagline: "Some goals you never forget. Some robberies neither.",
      wanted: "The signed '86 jersey",
    },
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
    en: {
      title: "The Golden Bandoneon",
      headline: "Silence at the milonga: the golden bandoneon is stolen",
      synopsis: "A legendary tango player set down his golden bandoneon for one second to say hello. When he came back, the case was empty and the milonga lost its beat.",
      tagline: "A tango without a bandoneon is barely a whisper.",
      wanted: "The golden bandoneon",
    },
    trailerArt: { place: "/images/historias/bandoneon-lugar.webp", wanted: "/images/historias/bandoneon-objeto.webp" },
  },
];
