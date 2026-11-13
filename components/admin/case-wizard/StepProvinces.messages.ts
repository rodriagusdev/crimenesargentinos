import { defineMessages } from "@/lib/i18n/messages";

export const stepProvincesMessages = defineMessages({
  es: {
    introA: "Elegí 2 o más provincias. El orden en que las elegís no importa: el recorrido lo definís en el paso siguiente. Si falta una provincia o una locación, creala antes en",
    provinces: "Provincias",
    or: "o",
    locations: "Locaciones",
    introB: "(con coordenadas) y volvé a abrir el asistente.",
    noLocations: "Sin locaciones",
    missingCoords: "Faltan coordenadas",
    iconsTitle: "Ícono de cada provincia en el mapa",
    pinAt: "pin en {top} / {left}",
  },
  en: {
    introA: "Pick 2 or more provinces. The order doesn't matter: you set the route in the next step. If a province or location is missing, create it first in",
    provinces: "Provinces",
    or: "or",
    locations: "Locations",
    introB: "(with coordinates) and reopen the wizard.",
    noLocations: "No locations",
    missingCoords: "Missing coordinates",
    iconsTitle: "Each province's icon on the map",
    pinAt: "pin at {top} / {left}",
  },
});
