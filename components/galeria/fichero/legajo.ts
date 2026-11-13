import type { CSSProperties } from "react";
import type { GallerySuspect } from "@/lib/suspectReleases";

/** Legajo abierto en el centro de la pantalla: entra volando desde su ficha y vuelve a ella al cerrarse */
export type OpenLegajo = {
  suspect: GallerySuspect;
  number: number;
  release: string;
  isNew: boolean;
  phase: "open" | "closing";
  /** Desde dónde sale (la ficha en el cajón), como variables CSS para la animación */
  from: CSSProperties;
};

/** Ancho del legajo agrandado (en px): lo más grande que entre a lo ancho y a lo alto (mide ~1,4 veces su ancho) */
export const legajoWidth = () => Math.min(window.innerWidth * 0.92, 600, (window.innerHeight * 0.88) / 1.4);

/** Variables CSS con el desplazamiento y la escala que llevan el legajo del centro a la posición de la ficha */
export function flightFrom(rect: DOMRect): CSSProperties {
  const width = legajoWidth();
  const dx = rect.left + rect.width / 2 - window.innerWidth / 2;
  const dy = rect.top + rect.height / 2 - window.innerHeight / 2;
  return { "--dx": `${dx}px`, "--dy": `${dy}px`, "--s": rect.width / width } as CSSProperties;
}
