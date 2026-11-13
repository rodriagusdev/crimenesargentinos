"use client";

import { useEffect, useRef } from "react";
import SuspectPhoto from "../SuspectPhoto";
import { legajoWidth, type OpenLegajo } from "./legajo";
import styles from "./fichero.module.css";

type Props = { legajo: OpenLegajo; onClose: () => void; onClosed: () => void };

// Legajo agrandado en el centro: se despega de su ficha, vuela al medio y queda grande sobre el fondo oscurecido.
// Solo foto, nombre y número de legajo (sin datos de los casos). Se cierra con ✕, clic afuera o Escape.
export default function LegajoLightbox({ legajo, onClose, onClosed }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = legajo.phase === "closing";

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal aria-label={`Legajo de ${legajo.suspect.name}`}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar legajo"
        className={`absolute inset-0 bg-black/75 backdrop-blur-sm cursor-zoom-out ${closing ? styles.dimOut : styles.dimIn}`}
      />

      <article
        style={{ ...legajo.from, width: legajoWidth() }}
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) onClosed();
        }}
        className={`relative bg-[#f6f0de] text-[#2b2117] rounded-sm border border-[#cdbf9f] p-4 sm:p-5 shadow-[0_40px_80px_rgba(0,0,0,0.75)] ${
          closing ? styles.legajoOut : styles.legajoIn
        }`}
      >
        {/* Solapa y renglones como en la ficha */}
        <span className="absolute -top-3.5 left-6 h-4 w-24 rounded-t-sm bg-[#e9dfc4] border border-b-0 border-[#cdbf9f]" aria-hidden />
        <span
          className="absolute inset-0 pointer-events-none opacity-40 bg-[repeating-linear-gradient(180deg,transparent_0_21px,#d9cdb2_21px_22px)]"
          aria-hidden
        />

        <header className="relative flex items-center justify-between border-b-2 border-[#d9cdb2] pb-2 mb-3 font-mono font-bold text-[#7a6a50]">
          <span className="text-xs">ARCHIVO DE LA CENTRAL</span>
          <span className="text-sm text-[#2b2117]">LEGAJO N° {String(legajo.number).padStart(4, "0")}</span>
        </header>

        <div className="relative aspect-square overflow-hidden border-2 border-[#b9ab8c] bg-[#3a4250]">
          <SuspectPhoto suspect={legajo.suspect} index={legajo.number} className="contrast-105" />
          {/* Clip que sostiene la foto */}
          <span
            className="absolute -top-1 left-1/2 -translate-x-1/2 h-7 w-5 rounded-sm border-2 border-[#9aa1ab] bg-gradient-to-b from-[#e3e6ea] to-[#8f97a3] shadow"
            aria-hidden
          />
          {legajo.isNew && (
            <span className="absolute bottom-4 right-3 px-3 py-1 border-[3px] border-[#c81e1e] text-[#c81e1e] bg-[#f6f0de]/85 text-sm -rotate-12">
              NUEVO
            </span>
          )}
        </div>

        <h2 className="relative mt-3 font-mono text-lg sm:text-2xl font-black uppercase leading-tight text-center">{legajo.suspect.name}</h2>
        <p className="relative mt-1 text-center font-mono text-xs text-[#7a6a50]">{legajo.release.toUpperCase()}</p>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar legajo"
          className="absolute -top-4 -right-4 size-10 rounded-full border-2 border-[#f6f0de] bg-[#2b2117] text-[#f6f0de] text-sm shadow-lg cursor-pointer hover:bg-[#c81e1e]"
        >
          ✕
        </button>
      </article>
    </div>
  );
}
