"use client";

import { useEffect } from "react";

/**
 * Esconde la barra de scroll vertical de la página mientras está montado (la página se sigue desplazando con la
 * rueda, el touchpad o el dedo). Se usa en los layouts de las galerías de bocetos.
 */
export default function HideScrollbar() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("hide-scrollbar");
    return () => html.classList.remove("hide-scrollbar");
  }, []);
  return null;
}
