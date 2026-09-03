import ILevelLocations from "@/models/ILevelLocations";

// REPRESENTA LAS LOCACIONES QUE HAY EN CADA NIVEL, CON SUS IMAGENES Y NOMBRES
export const levels: ILevelLocations[] = [
  {
    name: "Buenos Aires",
    id: 1,
    backgroundUrl: "/images/provinces/province_buenosaires.jfif",
    locations: [
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 1,
        name: "El Obelisco",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 2,
        name: "Mercado Avellaneda",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 3,
        name: "Aeropuerto Ezeiza",
      },
    ],
  },
  {
    name: "Cordoba",
    id: 2,
    backgroundUrl: "/images/provinces/province_cordoba.jfif",
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
    backgroundUrl: "/images/provinces/province_misiones.jfif",
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
  {
    name: "Chaco",
    id: 4,
    backgroundUrl: "/images/provinces/province_misiones.jfif",
    locations: [
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 1,
        name: "Parque Nacional el Impenetrable",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 2,
        name: "Campo del Cielo",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 3,
        name: "Isla del Cerrito",
      },
    ],
  },
  {
    name: "Corrientes",
    id: 5,
    backgroundUrl: "/images/provinces/province_misiones.jfif",
    locations: [
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 1,
        name: "Paseo de los Murales",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 2,
        name: "Teatro Oficial Juan de Vera",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 3,
        name: "Parque Nacional Mburucuyá",
      },
    ],
  },
  {
    name: "Tierra del Fuego",
    id: 6,
    backgroundUrl: "/images/provinces/province_misiones.jfif",
    locations: [
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 1,
        name: "Presidio de Usuhaia",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 2,
        name: "Tren del Fin del Mundo",
      },
      {
        imageUrl: "/images/IMPLEMENT.jpg",
        id: 3,
        name: "Isla Martillos",
      },
    ],
  },
];
