import ILevelLocations from "@/models/ILevelLocations";

// REPRESENTA LAS LOCACIONES QUE HAY EN CADA NIVEL, CON SUS IMAGENES Y NOMBRES
export const levels: ILevelLocations[] = [
  {
    name: "Buenos Aires",
    id: 1,
    backgroundUrl: "/images/provinces/province_buenosaires.jfif",
    locations: [
      {
        imageUrl: "/images/dialogbackground/level1/dialogo_buenosaires_kiosco.jpg",
        id: 1,
        name: "El Obelisco",
      },
      {
        imageUrl: "/images/dialogbackground/level1/dialogo_buenosaires_verduleria.jpg",
        id: 2,
        name: "Mercado Avellaneda",
      },
      {
        imageUrl: "/images/dialogbackground/level1/dialogo_buenosaires_ezeiza.jpg",
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
        imageUrl: "/images/dialogbackground/level1/dialogo_cordoba_plazasanmartin.jpg",
        id: 1,
        name: "Plaza San Martin",
      },
      {
        imageUrl: "/images/dialogbackground/level1/dialogo_cordoba_restoguemes.jpg",
        id: 2,
        name: "El Nuevo Güemes",
      },
      {
        imageUrl: "/images/dialogbackground/level1/dialogo_cordoba_manzanajesuitica.jpg",
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
        imageUrl: "/images/dialogbackground/level1/dialogo_misiones_jardinalbertoroth.jpg",
        id: 1,
        name: "Jardin Botánico Alberto Roth",
      },
      {
        imageUrl: "/images/dialogbackground/level1/dialogo_misiones_costanera.jpg",
        id: 2,
        name: "Costanera de Misiones",
      },
      {
        imageUrl: "/images/dialogbackground/level1/dialogo_misiones_playaselbrete.jpg",
        id: 3,
        name: "Playas el Brete y Costa Sur",
      },
    ],
  },
  {
    name: "Chaco",
    id: 4,
    backgroundUrl: "/images/maps/level2/Mapa_chaco1.webp",
    locations: [
      {
        imageUrl: "/images/locations/level2/icono_Parque_Nacional_El_Impenetrable1.webp",
        id: 1,
        name: "Parque Nacional el Impenetrable",
      },
      {
        imageUrl: "/images/locations/level2/icono_Campo_del_Cielo1.webp",
        id: 2,
        name: "Campo del Cielo",
      },
      {
        imageUrl: "/images/locations/level2/icono_Isla_del_Cerrito1.webp",
        id: 3,
        name: "Isla del Cerrito",
      },
    ],
  },
  {
    name: "Corrientes",
    id: 5,
    backgroundUrl: "/images/maps/level2/Mapa_corrientes1.webp",
    locations: [
      {
        imageUrl: "/images/locations/level2/icono_paseo_murales1.webp",
        id: 1,
        name: "Paseo de los Murales",
      },
      {
        imageUrl: "/images/locations/level2/icono_Teatro_Oficial_Juan_de_Vera1.webp",
        id: 2,
        name: "Teatro Oficial Juan de Vera",
      },
      {
        imageUrl: "/images/locations/level2/icono_Parque_Nacional_Mburucuyá1.webp",
        id: 3,
        name: "Parque Nacional Mburucuyá",
      },
    ],
  },
  {
    name: "Tierra del Fuego",
    id: 6,
    backgroundUrl: "/images/maps/level2/Mapa_tierra_del_fuego1.webp",
    locations: [
      {
        imageUrl: "/images/locations/level2/icono_presidio_ushuaia1.webp",
        id: 1,
        name: "Presidio de Usuhaia",
      },
      {
        imageUrl: "/images/locations/level2/icono_tren_fin_del_mundo1.webp",
        id: 2,
        name: "Tren del Fin del Mundo",
      },
      {
        imageUrl: "/images/locations/level2/icono_isla_martillo1.webp",
        id: 3,
        name: "Isla Martillos",
      },
    ],
  },
];
