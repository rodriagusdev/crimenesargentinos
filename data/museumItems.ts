import { IMuseumItem } from "@/models/IMuseumItem";

export const MOCK_MUSEUM_ITEMS: IMuseumItem[] = [
  {
    id: "copa-1986",
    title: "Copa del Mundo de 1986",
    subtitle: "Trofeo original de oro macizo de 18 quilates",
    level: 1,
    caseName: "Robo a las Estrellas",
    province: "Buenos Aires",
    category: "Deportivo",
    estimatedValue: "$ 50.000.000 Australes",
    recoveredDate: "28 de Junio, 1986",
    status: "recovered",
    icon: "🏆",
    description:
      "La mítica copa dorada alzada por la Selección Nacional en el Estadio Azteca. Desapareció misteriosamente de la vitrina central de la AFA en pleno centro porteño durante los festejos.",
    policeReport:
      "Interceptada por la brigada de investigaciones especiales en un doble fondo de equipaje diplomático minutos antes de ser trasladada en un hidroavión por el Río Paraná.",
  },
  {
    id: "meteorito-chaco",
    title: "Meteorito 'El Chaco'",
    subtitle: "Masa férrea sideral de 37 toneladas",
    level: 2,
    caseName: "Desaparecen los Mañaneros",
    province: "Chaco",
    category: "Astronómico",
    estimatedValue: "$ 120.000.000 Australes",
    recoveredDate: "14 de Septiembre, 1990",
    status: "recovered",
    icon: "☄️",
    description:
      "Una de las piezas de meteorito más densas y pesadas de la Tierra, caída hace más de 4.000 años en la región ancestral de Campo del Cielo. Codiciada por coleccionistas clandestinos internacionales.",
    policeReport:
      "Una banda criminal intentó sacarlo en un tren de carga nocturno camuflado bajo toneladas de carbón vegetal. Fue rescatado intacto en un operativo conjunto con la policía ferroviaria.",
  },
  {
    id: "femur-argentinosaurus",
    title: "Fémur Fósil de Argentinosaurus",
    subtitle: "Resto del titanosaurio más grande del planeta",
    level: 3,
    caseName: "Caso Patagonia",
    province: "Neuquén / Río Negro",
    category: "Paleontológico",
    estimatedValue: "$ 85.000.000 Australes",
    recoveredDate: "03 de Noviembre, 1993",
    status: "recovered",
    icon: "🦴",
    description:
      "Pieza fósil de 2.5 metros de longitud perteneciente al colosal dinosaurio herbívoro que habitó la Patagonia hace 95 millones de años.",
    policeReport:
      "Sustraído de un yacimiento paleontológico en la estepa andina. Los contrabandistas pretendían cruzarlo a través de un paso cordillerano clandestino antes de ser cercados por la patrulla de frontera.",
  },
  {
    id: "poncho-guemes",
    title: "Poncho de Vicuña del Gral. Güemes",
    subtitle: "Prenda de combate de la Guerra Gaucha",
    level: 4,
    caseName: "Ruta Nacional 40",
    province: "Salta",
    category: "Histórico",
    estimatedValue: "$ 40.000.000 Australes",
    recoveredDate: "17 de Junio, 1995",
    status: "recovered",
    icon: "🧣",
    description:
      "Tejido tradicional teñido en carmín y negro utilizado por el prócer Martín Miguel de Güemes durante la defensa gaucha de la frontera norte argentina.",
    policeReport:
      "Robado del Museo Histórico del Norte durante un corte de suministro eléctrico. Hallado embalado dentro de un camión de encomiendas detenido en un puesto de control en Cafayate.",
  },
  {
    id: "diamante-parana",
    title: "Diamante 'Estrella del Paraná'",
    subtitle: "Gema fluvial de corte rosa de 45 quilates",
    level: 5,
    caseName: "El Asesino de las Provincias",
    province: "Santa Fe",
    category: "Joyería",
    estimatedValue: "$ 200.000.000 Australes",
    recoveredDate: "21 de Febrero, 1997",
    status: "recovered",
    icon: "💎",
    description:
      "Una de las joyas más valiosas y enigmáticas del litoral argentino, preservada históricamente en las bóvedas de la ribera santafesina.",
    policeReport:
      "El delincuente intentó evadir el cerco policial aprovechando el bullicio de los carnavales fluviales. Fue aprehendido in fraganti con la joya oculta en un estuche de terciopelo.",
  },
  {
    id: "reloj-retiro",
    title: "Reloj de Bolsillo de la Estación Retiro",
    subtitle: "Cronómetro ferroviario de oro de 1915",
    level: 2,
    caseName: "Desaparecen los Mañaneros",
    province: "Buenos Aires",
    category: "Histórico",
    estimatedValue: "$ 18.000.000 Australes",
    recoveredDate: "10 de Agosto, 1989",
    status: "recovered",
    icon: "⏱️",
    description:
      "Reloj suizo de precisión con el monograma del Ferrocarril Central Argentino en relieve de oro y cristal de roca biselado.",
    policeReport:
      "Extraído de la oficina del jefe de estación durante la confusión de un simulacro de emergencia. Recuperado en poder del boletero de Retiro.",
  },
  {
    id: "corona-carnaval",
    title: "Corona Imperial de la Reina del Carnaval",
    subtitle: "Orfebrería en plata repujada y rubíes del litoral",
    level: 5,
    caseName: "El Asesino de las Provincias",
    province: "Corrientes",
    category: "Joyería",
    estimatedValue: "$ 35.000.000 Australes",
    recoveredDate: "Investigación en curso",
    status: "investigating",
    icon: "👑",
    description:
      "Corona artesanal tradicional confeccionada por orfebres correntinos con filigranas de plata 925 y rubíes engarzados a mano.",
    policeReport:
      "La causa sigue abierta. Se sospecha de una ramificación de la banda que opera en las islas del Delta y el río Uruguay.",
  },
  {
    id: "manuscrito-borges",
    title: "Manuscrito Marginal de Jorge Luis Borges",
    subtitle: "Anotaciones manuscritas con tinta verde de 1945",
    level: 3,
    caseName: "Caso Patagonia",
    province: "Río Negro",
    category: "Literario",
    estimatedValue: "Patrimonio Invaluable",
    recoveredDate: "24 de Agosto, 1994",
    status: "recovered",
    icon: "📜",
    description:
      "Manuscrito inédito de tres páginas que contiene variantes manuscritas del cuento 'El Aleph', extraviado de los fondos de la Biblioteca Nacional.",
    policeReport:
      "Recuperado intacto en la caja de seguridad de una cabaña alpina en San Carlos de Bariloche antes de su remate en una subasta privada clandestina.",
  },
];
