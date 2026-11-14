"use client";

import Image from "next/image";
import Link from "next/link";
import type { CaseStory } from "@/lib/caseStories";
import styles from "./vhs.module.css";

type Props = { story: CaseStory; number: number; seconds: number; onPlay: () => void };

// Destacado de la videoteca: el caso elegido en grande, con su imagen, titular, frase gancho y datos,
// y los botones para ver el tráiler o tomar el caso. Cambia al elegir otro casete del estante.
export default function VideotecaHero({ story, number, seconds, onPlay }: Props) {
  const art = story.trailerArt?.place ?? story.image;

  return (
    <section
      key={story.id}
      aria-label={`Caso destacado: ${story.title}`}
      className={`relative lg:h-full overflow-hidden rounded-2xl border border-[rgba(255,243,199,0.14)] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.75)] ${styles.fadeUp}`}
    >
      {/* Imagen del caso con zoom lento */}
      <div className="relative sm:aspect-video lg:aspect-auto lg:h-full">
        {/* Imagen: en celular es un bloque 16:9 arriba de la ficha; desde sm ocupa todo el destacado */}
        <div className="relative aspect-video overflow-hidden sm:absolute sm:inset-0 sm:aspect-auto">
          <Image src={art} alt="" fill unoptimized priority className={`object-cover ${styles.kenBurns}`} />
        </div>
        {/* Degradés para leer el texto y líneas de VHS suaves */}
        <div className="pointer-events-none absolute inset-x-0 top-0 aspect-video bg-gradient-to-t from-black via-transparent to-transparent sm:inset-0 sm:aspect-auto sm:bg-gradient-to-r sm:from-black/95 sm:via-black/60" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.12)_0,rgba(0,0,0,0.12)_1px,transparent_1px,transparent_3px)]" aria-hidden />

        {/* Marca de la videoteca */}
        <span className="absolute top-4 left-4 sm:top-5 sm:left-6 flex items-center gap-2 rounded-md bg-black/60 px-2.5 py-1.5 text-[10px] text-[#7fd1ff] backdrop-blur-sm">
          <span className={`size-2 rounded-full bg-[#ff3b3b] ${styles.blink}`} aria-hidden />
          VIDEOTECA DE LA CENTRAL
        </span>

        {/* Ficha del caso */}
        <div className="relative flex flex-col gap-3 p-4 pt-1 sm:absolute sm:inset-y-0 sm:left-0 sm:w-[62%] sm:justify-center sm:p-8 lg:p-10">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#ffd447]">EXPEDIENTE {String(number).padStart(2, "0")}</p>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black uppercase leading-none text-white [text-shadow:0_4px_0_#000]">
            {story.title}
          </h2>
          <p className="font-mono text-sm sm:text-base lg:text-lg leading-snug text-white/90">{story.headline}</p>
          <p className="font-serif italic text-base sm:text-lg text-[#E1C380]">“{story.tagline}”</p>

          {/* Datos */}
          <ul className="flex flex-wrap gap-2 text-[10px] sm:text-xs text-white/85">
            <li className="rounded-md border border-white/25 bg-black/40 px-2 py-1">
              {story.place} · {story.province}
            </li>
            <li className="rounded-md border border-white/25 bg-black/40 px-2 py-1">NIVEL {story.level}</li>
            <li className="rounded-md border border-white/25 bg-black/40 px-2 py-1">TRÁILER · {seconds} s</li>
          </ul>

          <div className="mt-1 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onPlay}
              className="flex flex-1 sm:flex-none items-center justify-center gap-3 rounded-lg bg-[#c81e1e] px-5 py-3.5 text-xs sm:text-sm text-white shadow-[0_0_30px_rgba(200,30,30,0.45)] cursor-pointer transition-transform hover:scale-105 hover:bg-[#a51818] active:scale-95"
            >
              <span aria-hidden>▶</span> VER TRÁILER
            </button>
            <Link
              href="/login?registro"
              className="flex-1 sm:flex-none text-center rounded-lg border-2 border-[#E1C380] bg-black/40 px-5 py-3 text-xs sm:text-sm text-[#FFF3C7] transition-colors hover:bg-[#E1C380]/15"
            >
              TOMAR EL CASO
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
