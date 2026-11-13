"use client";

import { useSyncExternalStore } from "react";
import NewspaperFace from "./NewspaperFace";
import type { SuspectRelease } from "@/lib/suspectReleases";
import styles from "./diario.module.css";

// Fecha del día en vivo, sin problemas de hidratación (en el servidor queda una raya)
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};
const readDate = () => new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

// Tapa de El Vespertino: cabezal con fecha, número y precio, titular, bajada y la grilla de caras.
// La edición nueva llega girando; si no, la tapa sale de la rotativa con la barra de tinta.
export default function FrontPage({ release, fresh }: { release: SuspectRelease; fresh: boolean }) {
  const date = useSyncExternalStore(subscribe, readDate, () => "—");
  const count = release.suspects.length;

  return (
    <div className={fresh ? styles.spinIn : undefined}>
      <article className={`relative bg-[#f2ead8] text-[#1b1813] p-4 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.7)] -rotate-[0.4deg] ${fresh ? "" : styles.pressReveal}`}>
        {!fresh && <span className={`absolute inset-x-0 h-3 -translate-y-full bg-[#1b1813] shadow-[0_0_14px_6px_rgba(27,24,19,0.5)] ${styles.inkBar}`} aria-hidden />}
        {/* Pliegue al medio y textura de papel */}
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.08)_48%,rgba(255,255,255,0.35)_52%,transparent)]" aria-hidden />
        <span className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(#000_1px,transparent_1.5px)] bg-[size:5px_5px]" aria-hidden />

        <header className="relative text-center border-b-4 border-double border-[#1b1813] pb-3">
          <div className="flex justify-between gap-2 font-serif text-[10px] sm:text-xs uppercase tracking-wider">
            <span>Edición especial</span>
            <span>{release.name}</span>
          </div>
          <h1 className="mt-2 font-serif font-black text-[2.6rem] leading-none sm:text-7xl tracking-tight [text-shadow:1px_1px_0_rgba(0,0,0,0.15)]">
            El Vespertino
          </h1>
          <div className="mt-2 flex flex-wrap justify-between gap-x-3 border-t border-[#1b1813] pt-1 font-serif text-[10px] sm:text-xs">
            <span className="capitalize">{date}</span>
            <span>Año I · N° {1000 + release.id}</span>
            <span>Precio: $ 0,50</span>
          </div>
        </header>

        <h2 className="relative mt-4 font-serif font-black text-2xl sm:text-5xl leading-none text-center uppercase">
          {fresh ? "¡Llegaron caras nuevas!" : "La galería completa"}
        </h2>
        <p className="relative mt-3 mb-5 font-serif italic text-sm sm:text-base text-center text-[#3d3124]">
          {fresh
            ? `La galería de la Central suma ${count} personas con el ${release.name}. Aquí, todas sus caras.`
            : `Las ${count} personas de la galería de la Central, una por una, en esta edición.`}
        </p>

        <div className="relative grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 border-t border-[#1b1813] pt-4">
          {release.suspects.map((s, i) => (
            <NewspaperFace key={s.name} suspect={s} index={i} />
          ))}
        </div>

        <p className="relative mt-5 border-t border-[#1b1813] pt-2 text-center font-serif text-[10px] sm:text-xs uppercase tracking-widest">
          Pronóstico: templado · Continúa en la página 2
        </p>
      </article>
    </div>
  );
}
