// Portadas disponibles para la home. La galería (/portadas) muestra un botón por cada una y cada una se ve en /portadas/<id>.
import type { PortadaMessageKey } from "./portadas.messages";

export type Portada = {
  id: string;
  /** Claves de portadasMessages con el nombre y la descripción */
  nameKey: PortadaMessageKey;
  descriptionKey: PortadaMessageKey;
  /** Color de fondo de la tarjeta en la galería */
  tone: string;
};

export const PORTADAS: Portada[] = [
  { id: "mesa", nameKey: "mesaName", descriptionKey: "mesaDescription", tone: "#4a2e18" },
  { id: "trailer", nameKey: "trailerName", descriptionKey: "trailerDescription", tone: "#0b1426" },
  { id: "diario", nameKey: "diarioName", descriptionKey: "diarioDescription", tone: "#7a1212" },
  { id: "pizarra", nameKey: "pizarraName", descriptionKey: "pizarraDescription", tone: "#6b4423" },
  { id: "relampago", nameKey: "relampagoName", descriptionKey: "relampagoDescription", tone: "#13203a" },
];

/** La portada que hoy se muestra en "/" */
export const CURRENT_PORTADA = "trailer";
