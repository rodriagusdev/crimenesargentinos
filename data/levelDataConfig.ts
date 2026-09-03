import ILevelDataProvinces from "@/models/ILevelDataProvinces";

// NIVELES CONFIGURADOS, cada {} es un nivel, con sus provincias y sus locaciones
export const levelDataConfig: ILevelDataProvinces[] = [
  {
    id: 1,
    provinces: [
      {
        id: 1,
        name: "Buenos Aires",
        top: "44%",
        left: "58%",
        icon: "/images/locations/icono_buenosaires.webp",
      },
      {
        id: 2,
        name: "Cordoba",
        top: "32%",
        left: "48%",
        icon: "/images/locations/icono_cordoba.webp",
      },
      {
        id: 3,
        name: "Misiones",
        top: "8%",
        left: "65%",
        icon: "/images/locations/icono_misiones.webp",
      },
    ],
  },
  {
    id: 2,
    provinces: [
      {
        id: 4,
        name: "Chaco",
        top: "10%",
        left: "53%",
        icon: "/images/locations/icono_buenosaires.webp",
      },
      {
        id: 5,
        name: "Corrientes",
        top: "28%",
        left: "58%",
        icon: "/images/locations/icono_buenosaires.webp",
      },
      {
        id: 6,
        name: "Tierra del Fuego",
        top: "90%",
        left: "46%",
        icon: "/images/locations/icono_buenosaires.webp",
      },
    ],
  },
];
