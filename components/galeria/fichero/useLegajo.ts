"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flightFrom, type OpenLegajo } from "./legajo";
import { audioManager } from "@/lib/audioManager";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Cuánto hay que quedarse sobre una ficha para que se arranque (evita abrir al pasar de largo)
const HOVER_INTENT_MS = 220;

type Card = { suspect: GallerySuspect; number: number; release: string; isNew: boolean };

/**
 * Legajo en el centro de la pantalla. Con mouse es una vista previa: se abre al quedarse sobre la ficha y
 * vuelve al salir (mode "hover", no captura el puntero). En pantallas táctiles se abre con un toque y se
 * cierra tocando afuera, con ✕ o Escape (mode "tap").
 */
export function useLegajo() {
  const [legajo, setLegajo] = useState<(OpenLegajo & { mode: "hover" | "tap" }) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelIntent = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => cancelIntent, []);

  const open = (card: Card, rect: DOMRect, mode: "hover" | "tap") => {
    audioManager.play("opencasefile");
    setLegajo({ ...card, phase: "open", from: flightFrom(rect), mode });
  };

  const close = useCallback(() => {
    setLegajo((l) => (l && l.phase === "open" ? { ...l, phase: "closing" } : l));
  }, []);
  const clear = useCallback(() => setLegajo(null), []);

  return {
    legajo,
    close,
    clear,
    /** Mouse entra a una ficha: se arranca después de un instante */
    hoverStart: (card: Card, el: HTMLElement) => {
      cancelIntent();
      timer.current = setTimeout(() => open(card, el.getBoundingClientRect(), "hover"), HOVER_INTENT_MS);
    },
    /** Mouse sale de la ficha: si estaba abierta en modo vista previa, vuelve */
    hoverEnd: () => {
      cancelIntent();
      setLegajo((l) => (l && l.mode === "hover" && l.phase === "open" ? { ...l, phase: "closing" } : l));
    },
    /** Toque en pantallas táctiles */
    tap: (card: Card, el: HTMLElement) => open(card, el.getBoundingClientRect(), "tap"),
  };
}
