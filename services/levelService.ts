import ILevelConfig from "@/models/ILevelLocations";
import { API_URL } from "../lib/api";
import ILevelDataProvinces from "@/models/ILevelDataProvinces";
import ILevelLocations from "@/models/ILevelLocations";
import IDialog from "@/models/IDialog";

/*export async function getLevel(levelId: number): Promise<ILevel> {
  const res = await fetch(`${API_URL}/level/${levelId}/dialog`);

  if (!res.ok) {
    throw new Error("Failed to fetch level data");
  }

  return res.json();
}*/

// JUST TEST NOT REAL CODE
// JUST TEST NOT REAL CODE
// JUST TEST NOT REAL CODE
// NEED API

// NIVELES CONFIGURADOS, cada {} es un nivel, con sus provincias y sus locaciones
const levelDataConfig: ILevelDataProvinces[] = [
  {
    id: 1,
    provinces: [
      { id: 1, name: "Buenos Aires", top: "44%", left: "58%", icon:"/images/locations/icono_buenosaires.webp" },
      { id: 2, name: "Cordoba", top: "32%", left: "48%", icon:"/images/locations/icono_cordoba.webp"},
      { id: 3, name: "Misiones", top: "8%", left: "65%", icon:"/images/locations/icono_misiones.webp"},
    ],
  },
  {
    id: 2,
    provinces: [
      { id: 1, name: "Jujuy", top: "44%", left: "58%" },
      { id: 2, name: "Cordoba", top: "32%", left: "48%" },
      { id: 3, name: "Misiones", top: "25%", left: "58%"},
    ],
  },
];

export async function getLevelProvinces(
  levelId: number,
): Promise<ILevelDataProvinces> {
  // SE NECESITA REGULARIZAR EL LEVELID PARA QUE SEA UN INDICE DEL ARRAY
  // (EMPIEZA EN 0, PERO LOS NIVELES EMPIEZAN DESDE EL 1)
  const regularize = levelId - 1;

  console.log(regularize);

  const data = levelDataConfig[regularize];

  if (!data) {
    throw new Error(`Data for level ${levelId} not found`);
  }

  return data;
}

// REPRESENTA LAS LOCACIONES QUE HAY EN CADA NIVEL, CON SUS IMAGENES Y NOMBRES
const levels: ILevelLocations[] = [
  {
    name: "Buenos Aires",
    id: 1,
    backgroundUrl: "/images/IMPLEMENT.jpg",
    locations: [
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 1,
        name: "Kiosco de Alberto",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 2,
        name: "Verdulería",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 3,
        name: "Estación de Ezeiza",
      },
    ],
  },
  {
    name: "Cordoba",
    id: 2,
    backgroundUrl: "/images/IMPLEMENT.jpg",
    locations: [
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 1,
        name: "Plaza San Martin",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 2,
        name: "Guemes Resto",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 3,
        name: "Manzana Jesuítica",
      },
    ],
  },
  {
    name: "Misiones",
    id: 3,
    backgroundUrl: "/images/IMPLEMENT.jpg",
    locations: [
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 1,
        name: "Jardin Botánico Alberto Roth",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 2,
        name: "Costanera de Misiones",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 3,
        name: "Playas el Brete y Costa Sur",
      },
    ],
  },
];

export async function getLevelLocations(
  levelId: number,
): Promise<ILevelLocations> {
  // SE NECESITA REGULARIZAR EL LEVELID PARA QUE SEA UN INDICE DEL ARRAY
  // (EMPIEZA EN 0, PERO LOS NIVELES EMPIEZAN DESDE EL 1)

  const regularize = levelId - 1;

  const data = levels[regularize];

  if (!data) {
    throw new Error(`Data for level ${levelId} not found`);
  }

  return data;
}

// REPRESENTA LOS DIALOGOS DE LOS NIVELES, CON SUS PREGUNTAS Y RESPUESTAS
const dialogs: IDialog[] = [
  {
    provinceId: 1,
    locationId: 1,
    npc: "Alberto",
    overlayBackgroundUrl: "/images/level1_buenosaires_kiosco.jpg",
    portraitUrl: "/images/portrait_alberto.webp",
    introText: "¡Hola! Soy Alberto.",
    questions: [
      "¿Qué tenía puesto?",
      "¿Estaba comiendo algo?",
      "¿Iba solo o acompañado?",
    ],
    answers: [
      "Puaaa, un traje sastrero muy clásico, muy pituco andaba el gil.",
      "Sehh, ese gordo panza andaba con un fernet en una mano y una empanada en la otra, que hombre feliz se veía ese hdp.",
      "No, iba solo.",
    ],
  },
  {
    provinceId: 1,
    locationId: 2,
    npc: "Verdulero",
    portraitUrl: "/images/portrait_bol.webp",
    overlayBackgroundUrl: "/images/level1_buenosaires_verduleria.jpg",
    introText:
      "¡Hola, paisano! ¿Qué andá buscando por estos pagos? Si es por los muchachos que pasaron corriendo, usté dirá, que yo vi todito desde mi puesto.",
    questions: [
      "¿Pudo ver cómo era?",
      "¿Algo que lo destacaba?",
      "¿Sabe hacia dónde se fue?",
    ],
    answers: [
      "Pucha, joven... ahí sí que me falló la vista, la verdad que no sabría decirle bien cómo era.",
      "Sí, padrecito, una cosa que se notaba al toque es que era bien bajito, y andaba con un apuro... como si lo fuera persiguiendo el diablo.",
      "No sabría decirle con certeza, che... con tanta balumba de gente que pasa por aquí, se me perdió de vista al ratico.",
    ],
  },
  {
    provinceId: 1,
    locationId: 3,
    npc: "Policía Lucas",
    portraitUrl: "/images/portrait_lucas.webp",
    overlayBackgroundUrl: "/images/level1_buenosaires_ezeiza.jpg",
    introText: "Buen día, ¿en qué lo puedo ayudar, señor?",
    questions: [
      "¿Sabe qué vuelo tomó?",
      "¿Tenía algo encima?",
      "¿Llevaba equipaje?",
    ],
    answers: [
      "Desconozco, creo que se dirige al norte.",
      "Ni idea la verdad.",
      "No sabría decirle.",
    ],
  },
  {
    provinceId: 2,
    locationId: 1,
    npc: "Vendedor de medias Braian",
    portraitUrl: "/images/portrait_braian.webp",
    overlayBackgroundUrl: "/images/level1_cordoba_plazasanmartin.jpg",
    introText:
      "Que paso compa, se le cayó la facha me parece, me compraría unas medias?, 3 pares por 10 mil pesitos, un oferton.",
    questions: [
      "¿Sabe si pasó una persona enana con panza?",
      "¿Tenía algo encima?",
      "¿Llevaba equipaje?",
    ],
    answers: [
      "Si amigo, alto olor a fernet, de nada le sirvió ir tan elegante, la camisa toda manchada de grasa, alto asado se comió de seguro.",
      "En silla de ruedas debería ir, pero nah.",
      "Además de que casi se le revienta el lompa y se le salían los terribles rollos, también se le salian los fajos de dólares de los bolsillos a ese gato.",
    ],
  },
  {
    provinceId: 2,
    locationId: 2,
    npc: "Camarero Tiziano",
    portraitUrl: "/images/portrait_meserotiziano.webp",
    overlayBackgroundUrl: "/images/level1_cordoba_restoguemes.jpg",
    introText: "Buenos días señor, ¿tiene reserva?",
    questions: [
      "¿El sospechoso comió acá, pudo notar que llevaba algo con él?",
      "¿Algo que pudo destacar de él?",
      "¿Sabe que comió?",
    ],
    answers: [
      "Mmm no sabria decirle, su guardia de seguridad le andaba secando la nuca en todo tiempo.",
      "Si, ese canoso hdp no me dejo nada de propina, debi escupirle en la comida, encima casi se olvida su valija aca, vaya uno a saber que cosas tiene en eso.",
      "La pregunta sería ¿que no comió? Mamita, parece Kirby, todo de una se lo morfo, parece aspiradora sin tope. Mil pesos me dio de propina no más, esa bola avaro.",
    ],
  },
  {
    provinceId: 2,
    locationId: 3,
    npc: "Cura Antonio",
    portraitUrl: "/images/portrait_curaantonio.webp",
    overlayBackgroundUrl: "/images/level1_cordoba_manzanajesuitica.jpg",
    introText: "¿Hola hermano mio, viene a recibir las bendiciones matutinas?",
    questions: [
      "¿Usted vio a mi sospechoso?",
      "¿Me informaron que lleva una valija consigo, es correcto eso?",
      "¿Pudo entablar una conversación con el sospechoso?",
    ],
    answers: [
      "Ay siii, como para no notarlo, esos pequeños ojos marrones café, me encandilaron como el cántico de un ángel.",
      "Uffa, no pude notarlo, ese chiquito tan lindo, su belleza es como ver las montañas de las sierras por las mañanas, o poder presenciar la divinidad de un querubín en el.",
      "Si, hablamos del mundial y su adoración hacia la copa del mundo y cómo le encantaría llevarsela a su casa para tenerla en su cama y dormir con ella.",
    ],
  },
  {
    provinceId: 3,
    locationId: 1,
    npc: "Jardinero Carlitos",
    portraitUrl: "/images/portrait_jardinerocarlitos.webp",
    overlayBackgroundUrl: "/images/level1_misiones_jardinalbertoroth.jpg",
    introText:
      "¿Eh ura, venis a comprar algunas florcitas para su Kuñataĩ? Yo le puedo dar un buen precio, no se preocupe.",
    questions: [
      "¿Vio a alguien con una valija grande?",
      "¿Vio a alguien de traje clásico?",
      "¿Pudo notar a alguien gordo con olor a fernet?",
    ],
    answers: [
      "¿Que pregunta de mierda chango, la cantidad de turistas que hay por aca, te pensas que me voy a acordar?",
      "Cada croto me encuentro por aca gurisa.",
      "¿Estás hablando de mi suegra acaso? Si la quiere arrestar no me quejo, me haría un gran favor?",
    ],
  },
  {
    provinceId: 3,
    locationId: 2,
    npc: "Pescador Don Juan",
    portraitUrl: "/images/portrait_pescadordonjuan.webp",
    overlayBackgroundUrl: "/images/level1_misiones_costanera.jpg",
    introText: "¿No me distraiga ura, no ve que estoy pescando?",
    questions: [
      "¿Estoy buscando a un sospechoso, sabe hacia dónde pudo ir?",
      "Necesito saber si tiene alguna característica del sospechoso.",
      "¿Sabe si lo pudo ver tomando fernet o donde lo consiguió?",
    ],
    answers: [
      "Justo ahora me venis a joder, la marea esta en su mejor punto, puedo sentir como se acercan los pescados, no me venga a romper las pelotas.",
      "Ni idea chango, mis ojos solo están enfocados en capturar a un gran Surubi del Paraná, llego a tenerlo en mis manos y no sabes lo que voy a festejar jajaja.",
      "Nahhh, que fernet? Aca se toma terere chango, no me interesan las bebidas de los porteños.",
    ],
  },
  {
    provinceId: 3,
    locationId: 3,
    npc: "Salvavidas Fernando",
    portraitUrl: "/images/portrait_salvavidasfernando.webp",
    overlayBackgroundUrl: "/images/level1_misiones_playaselbrete.jpg",
    introText:
      "Ahora no, ¿no ve que tengo que vigilar a estas hermosas gurisas que me tienen chapita?",
    questions: [
      "¿Tienen a alguien en la parte vip con una valija?",
      "Mi sospechoso quizás alquilo una sombrilla acá, es un gordo algo enano, ¿vio alguien así?",
      "¿A mi sospechoso le encanta el fernet y come mucho, tiene a alguien así?",
    ],
    answers: [
      "Uhh mira como está esa gurisa... ehh, ¿dijiste algo chango?",
      "Mmm… Che, vi a un karai gordito, con zunga… ¡Ñandejára! Mis ojos ya están pidiendo una buena lavada con lavandina, mba’e.",
      "Ndaikuaái che, pero a un par de cuadras nomás hay un boliche bastante bueno. Hay unas minas re lindas por ahí. Si le interesa, mba’éichapa… le consigo un descuentito pa’ la entrada, ¿qué dice?",
    ],
  },
];

export async function getDialogs(): Promise<IDialog[]> {
  // SIMULO PETICION

  const data = dialogs;

  if (!data) {
    throw new Error(`Dialogs not found`);
  }

  return data;
}
