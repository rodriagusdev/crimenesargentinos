"use client";

import { useEffect, useRef } from "react";
import SuspectPhoto from "../SuspectPhoto";
import { legajoWidth, type OpenLegajo } from "./legajo";
import styles from "./fichero.module.css";

type Props = { legajo: OpenLegajo; interactive: boolean; onClose: () => void; onClosed: () => void };

// Legajo agrandado en el centro: se dobla desde la cinta, se arranca de un tirón y vuela al medio, sobre el fondo
// oscurecido. Solo foto, nombre y número de legajo. Como vista previa (mouse) no captura el puntero; en pantallas
// táctiles (`interactive`) se cierra tocando afuera, con ✕ o con Escape.
export default function LegajoLightbox({ legajo, interactive, onClose, onClosed }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = legajo.phase === "closing";

  useEffect(() => {
    if (!interactive) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interactive, onClose]);

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center p-4 ${interactive ? "" : "pointer-events-none"}`}
      role="dialog"
      aria-modal={interactive}
      aria-label={`Legajo de ${legajo.suspect.name}`}
    >
      <div
        onClick={interactive ? onClose : undefined}
        className={`absolute inset-0 bg-black/75 backdrop-blur-sm ${closing ? styles.dimOut : styles.dimIn}`}
        aria-hidden
      />

      {/* Vuelo: de la ficha al centro */}
      <div
        style={{ ...legajo.from, width: legajoWidth() }}
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) onClosed();
        }}
        className={`relative ${closing ? styles.legajoFlyOut : styles.legajoFly}`}
      >
        {/* Arranque: bisagra en la cinta */}
        <article
          className={`relative bg-[#f6f0de] text-[#2b2117] rounded-sm border border-[#cdbf9f] p-4 pt-6 sm:p-6 sm:pt-8 shadow-[0_40px_80px_rgba(0,0,0,0.75)] ${
            closing ? "" : styles.legajoTear
          }`}
        >
          <span
            className="absolute inset-0 pointer-events-none opacity-40 bg-[repeating-linear-gradient(180deg,transparent_0_25px,#d9cdb2_25px_26px)]"
            aria-hidden
          />

          <header className="relative flex items-center justify-between border-b-2 border-[#d9cdb2] pb-2 mb-4 font-mono font-bold text-[#7a6a50]">
            <span className="text-xs sm:text-sm">ARCHIVO DE LA CENTRAL</span>
            <span className="text-sm sm:text-lg text-[#2b2117]">LEGAJO N° {String(legajo.number).padStart(4, "0")}</span>
          </header>

          <div className="relative aspect-square overflow-hidden border-2 border-[#b9ab8c] bg-[#3a4250]">
            <SuspectPhoto suspect={legajo.suspect} index={legajo.number} className="contrast-105" />
            {legajo.isNew && (
              <span className="absolute bottom-5 right-4 px-3 py-1 border-[3px] border-[#c81e1e] text-[#c81e1e] bg-[#f6f0de]/85 text-base -rotate-12">
                NUEVO
              </span>
            )}
          </div>

          <h2 className="relative mt-4 font-mono text-xl sm:text-3xl font-black uppercase leading-tight text-center">{legajo.suspect.name}</h2>
          <p className="relative mt-1 text-center font-mono text-xs sm:text-sm text-[#7a6a50]">{legajo.release.toUpperCase()}</p>

          {/* La otra mitad de la cinta, rota, que se vino con el legajo */}
          <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rotate-2 h-7 w-28 ${styles.tape} ${styles.tapeTorn}`} aria-hidden />

          {interactive && (
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Cerrar legajo"
              className="absolute -top-4 -right-4 size-10 rounded-full border-2 border-[#f6f0de] bg-[#2b2117] text-[#f6f0de] text-sm shadow-lg cursor-pointer hover:bg-[#c81e1e]"
            >
              ✕
            </button>
          )}
        </article>
      </div>
    </div>
  );
}
