import { IGameData } from "@/models/IGameData";

// TODO
// intialTime: tiempo de juego por nivel e InitialPI los puntos de investigacion
export const gameData: IGameData[] = [
  {
    levelId: 1,
    info: "El sospechoso es un hombre avistado por última vez en el Obelisco en la ciudad de Buenos Aires. Los testigos lo describen como un hombre gordo.",
    initialRoute: "/level/1/1/1",
    initialTime: 72,
    initialPI: 100,
    costs: {
      travelProvince: { time: 12, pi: 5 },
      travelLocation: { time: 3, pi: 3 },
      askQuestion: { time: 1, pi: 5 },
    },
    initialClues: [
      "Visto por última vez en el Obelisco (Buenos Aires)",
      "Contextura física: Hombre robusto / gordo",
    ],
    suspects: [
      {
        id: 1,
        name: "Carlos 'El Gordo' Benítez",
        description: ["Gordo", "Traje sastrero", "Come empanadas", "Estatura baja"],
      },
      {
        id: 2,
        name: "Esteban 'El Flaco' Morales",
        description: ["Alto", "Campera de cuero", "Fumador empedernido", "Pelo rubio"],
      },
      {
        id: 3,
        name: "Ramiro 'El Zorro' Gómez",
        description: ["Estatura media", "Gafas oscuras", "Tatuaje en el cuello", "Ropa deportiva"],
      },
    ],
    targetSuspect: {
      id: 1,
      name: "Carlos 'El Gordo' Benítez",
      description: ["Gordo", "Traje sastrero", "Come empanadas", "Estatura baja"],
    },
  },
  {
    levelId: 2,
    info: "Se reportó actividad sospechosa en la región del Noreste y Litoral. El fugitivo fue visto huyendo hacia el Parque Nacional El Impenetrable en Chaco.",
    initialRoute: "/level/2/4/1",
    initialTime: 60,
    initialPI: 90,
    costs: {
      travelProvince: { time: 5, pi: 20 },
      travelLocation: { time: 2, pi: 10 },
      askQuestion: { time: 1, pi: 5 },
    },
    initialClues: [
      "Último avistamiento en Chaco",
    ],
    suspects: [
      {
        id: 4,
        name: "Marcos 'El Camaleón' Rossi",
        description: ["Barba espesa", "Gorra verde", "Experto en supervivencia"],
      },
      {
        id: 5,
        name: "Lucía 'La Sombra' Pereyra",
        description: ["Pelo teñido", "Cicatriz en la mejilla", "Usa reloj de oro"],
      },
    ],
    targetSuspect: {
      id: 4,
      name: "Marcos 'El Camaleón' Rossi",
      description: ["Barba espesa", "Gorra verde", "Experto en supervivencia"],
    },
  },
  {
    levelId: 3,
    info: "Pistas recientes señalan movimientos clandestinos en el centro del país. Revisa las pistas para identificar al objetivo.",
    initialRoute: "/level/3/1/1",
    initialTime: 50,
    initialPI: 80,
    costs: {
      travelProvince: { time: 4, pi: 15 },
      travelLocation: { time: 2, pi: 10 },
      askQuestion: { time: 1, pi: 5 },
    },
    initialClues: [],
    suspects: [],
    targetSuspect: {
      id: 0,
      name: "Sospechoso desconocido",
      description: [],
    },
  },
  {
    levelId: 4,
    info: "El caso avanza a nivel nacional. La policía federal requiere tu asistencia inmediata.",
    initialRoute: "/level/4/1/1",
    initialTime: 48,
    initialPI: 75,
    costs: {
      travelProvince: { time: 4, pi: 15 },
      travelLocation: { time: 2, pi: 10 },
      askQuestion: { time: 1, pi: 5 },
    },
    initialClues: [],
    suspects: [],
    targetSuspect: {
      id: 0,
      name: "Sospechoso desconocido",
      description: [],
    },
  },
  {
    levelId: 5,
    info: "Operación final. El cabecilla de la organización criminal intenta cruzar las fronteras.",
    initialRoute: "/level/5/1/1",
    initialTime: 40,
    initialPI: 70,
    costs: {
      travelProvince: { time: 6, pi: 25 },
      travelLocation: { time: 2, pi: 10 },
      askQuestion: { time: 1, pi: 5 },
    },
    initialClues: [],
    suspects: [],
    targetSuspect: {
      id: 0,
      name: "Sospechoso desconocido",
      description: [],
    },
  },
];
