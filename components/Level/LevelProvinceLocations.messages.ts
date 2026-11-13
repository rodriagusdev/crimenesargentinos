import { defineMessages } from "@/lib/i18n/messages";

export const levelProvinceLocationsMessages = defineMessages({
  es: {
    loadError: "Error al cargar el nivel",
    travelError: "No se pudo ir a la locación",
    loading: "Accediendo a la red policial provincial...",
    notFound: "Provincia no encontrada",
    originFallback: "Punto Operativo",
    backToMap: "VOLVER AL MAPA GENERAL",
    sector: "Sector Provincial",
    availablePoints: "Puntos de Inspección Disponibles",
    destinations: "{n} DESTINOS",
    confirmTitle: "¿Inspeccionar Locación?",
  },
  en: {
    loadError: "Error loading the level",
    travelError: "Couldn't get to the location",
    loading: "Accessing the provincial police network...",
    notFound: "Province not found",
    originFallback: "Field Base",
    backToMap: "BACK TO NATIONAL MAP",
    sector: "Provincial Sector",
    availablePoints: "Available Inspection Points",
    destinations: "{n} DESTINATIONS",
    confirmTitle: "Inspect Location?",
  },
});
