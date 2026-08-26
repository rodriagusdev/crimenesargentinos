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

const levelDataConfig: ILevelDataProvinces[] = [
  {
    id: 1,
    backgroundUrl: "/images/mapa.jpg",
    provinces: [
      { id: 1, name: "Buenos Aires" },
      { id: 2, name: "Cordoba" },
      { id: 3, name: "Misiones" },
    ],
  },
  {
    id: 2,
    backgroundUrl: "/images/mapa.jpg",
    provinces: [
      { id: 41, name: "Sevilla" },
      { id: 29, name: "Málaga" },
      { id: 11, name: "Cádiz" },
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

  await new Promise((resolve) => setTimeout(resolve, 300));

  const data = levelDataConfig[regularize];

  if (!data) {
    throw new Error(`Data for level ${levelId} not found`);
  }

  return data;
}

const levels: ILevelLocations[] = [
  {
    name: "Buenos Aires",
    id: 1,
    backgroundUrl: "/images/IMPLEMENT.jpg",
    locations: [
      {
        imageUrl: "/images/level1_kiosco.jpg",
        id: 1,
        name: "Kiosco de Alberto",
      },
      {
        imageUrl: "/images/level1_kiosco.jpg",
        id: 2,
        name: "Plaza",
      },
      {
        imageUrl: "/images/level1_kiosco.jpg",
        id: 3,
        name: "Estación",
      },
    ],
  },
  {
    name: "Buenos Aires2",
    id: 1,
    backgroundUrl: "/images/IMPLEMENT.jpg",
    locations: [
      {
        imageUrl: "/images/level1_kiosco.jpg",
        id: 1,
        name: "Kiosco de Alberto",
      },
      {
        imageUrl: "/images/level1_kiosco.jpg",
        id: 2,
        name: "Plaza",
      },
      {
        imageUrl: "/images/level1_kiosco.jpg",
        id: 3,
        name: "Estación",
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

  // SIMULO PETICION
  await new Promise((resolve) => setTimeout(resolve, 300));

  const data = levels[regularize];

  if (!data) {
    throw new Error(`Data for level ${levelId} not found`);
  }

  return data;
}

const dialogs: IDialog[] = [
  {
    provinceId: 1,
    locationId: 1,
    npc: "Alberto",
    overlayBackgroundUrl: "/images/level1_kiosco.jpg",
    portraitUrl: "/portraits/alberto.png",
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
    portraitUrl: "/portraits/marta.png",
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
    portraitUrl: "/portraits/carlos.png",
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
];

export async function getDialogs(): Promise<IDialog[]> {
  // SE NECESITA REGULARIZAR EL LEVELID PARA QUE SEA UN INDICE DEL ARRAY
  // (EMPIEZA EN 0, PERO LOS NIVELES EMPIEZAN DESDE EL 1)

  // SIMULO PETICION
  await new Promise((resolve) => setTimeout(resolve, 300));

  const data = dialogs;

  if (!data) {
    throw new Error(`Dialogs not found`);
  }

  return data;
}
