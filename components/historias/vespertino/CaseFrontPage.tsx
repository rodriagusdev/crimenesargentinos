import Link from "next/link";
import FillerBrief, { FakeText } from "./FillerBrief";
import HalftonePhoto from "./HalftonePhoto";
import { briefsFor, classifiedsFor, editionNumber, weekday } from "./vespertino";
import { audioManager } from "@/lib/audioManager";
import type { CaseStory } from "@/lib/caseStories";

// Tapa de El Vespertino del día del hecho: cabezal, titular, foto con trama, bajada y columnas de relleno.
// Solo usa lo que el juego muestra al empezar el caso.
export default function CaseFrontPage({ story }: { story: CaseStory }) {
  return (
    <article className="relative bg-[#f2ead8] text-[#1b1813] p-3.5 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
      {/* Pliegue al medio y grano del papel */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.08)_48%,rgba(255,255,255,0.35)_52%,transparent)]" aria-hidden />
      <span className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(#000_1px,transparent_1.5px)] bg-[size:5px_5px]" aria-hidden />

      <header className="relative text-center border-b-4 border-double border-[#1b1813] pb-2">
        <div className="flex justify-between gap-2 font-serif text-[9px] sm:text-xs uppercase tracking-wider">
          <span>Edición vespertina</span>
          <span>Caso N° {story.level}</span>
        </div>
        <h2 className="mt-1 font-serif font-black text-[2.4rem] leading-none sm:text-7xl tracking-tight [text-shadow:1px_1px_0_rgba(0,0,0,0.15)]">
          El Vespertino
        </h2>
        <p className="font-serif italic text-[10px] sm:text-xs text-[#3d3124]">&ldquo;Lo que pasó hoy, antes de que se enfríe&rdquo;</p>
        <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 border-t border-[#1b1813] pt-1 font-serif text-[9px] sm:text-xs">
          <span>
            {weekday(story.level)} · Año I · N° {editionNumber(story.level)}
          </span>
          <span>Precio: $ 0,50</span>
        </div>
      </header>

      <div className="relative mt-3 flex items-center justify-center gap-2">
        <span className="bg-[#7a1212] px-2 py-0.5 font-serif text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-[#f2ead8]">
          Último momento
        </span>
        <span className="text-lg" aria-hidden>
          {story.emoji}
        </span>
      </div>
      <h3 className="relative mt-2 font-serif font-black text-[1.7rem] sm:text-5xl leading-[0.95] text-center uppercase text-balance">
        {story.headline}
      </h3>
      <p className="relative mt-2 text-center font-serif italic text-xs sm:text-base text-[#3d3124]">{story.title}</p>

      <div className="relative mt-4 grid sm:grid-cols-[2fr_1fr] gap-4 sm:gap-6 border-t-2 border-[#1b1813] pt-4">
        <div className="flex flex-col gap-3">
          <figure>
            <HalftonePhoto
              src={story.image}
              alt={`El lugar del hecho: ${story.place}`}
              sizes="(min-width: 640px) 560px, 92vw"
              className="aspect-[16/10]"
            />
            <figcaption className="mt-1 font-serif text-[10px] sm:text-xs italic border-b border-[#1b1813]/40 pb-1">
              El lugar del hecho: {story.place}. (Foto: archivo de El Vespertino)
            </figcaption>
          </figure>
          <p className="font-serif text-sm sm:text-base leading-snug first-letter:float-left first-letter:mr-1.5 first-letter:font-black first-letter:text-5xl first-letter:leading-[0.8]">
            <strong className="uppercase">
              {story.place}, {story.province}.—
            </strong>{" "}
            {story.synopsis}
          </p>
          <p className="border-y border-[#1b1813] py-1.5 font-serif text-xs sm:text-sm">
            <span className="font-bold uppercase">Lo que falta:</span> {story.wanted}
          </p>
          <div className="hidden sm:grid grid-cols-2 gap-4">
            <FakeText lines={7} />
            <FakeText lines={7} />
          </div>
        </div>

        <aside className="grid grid-cols-2 sm:flex sm:flex-col gap-3 sm:border-l sm:border-[#1b1813] sm:pl-4">
          {briefsFor(story.level).map((b) => (
            <FillerBrief key={b.title} brief={b} />
          ))}
          <section className="col-span-2 border-2 border-[#1b1813] p-2">
            <p className="text-center font-serif font-black text-xs uppercase tracking-widest">Clasificados</p>
            <ul className="mt-1 font-serif text-[10px] leading-tight space-y-1">
              {classifiedsFor(story.level).map((c) => (
                <li key={c}>▪ {c}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <footer className="relative mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t-4 border-double border-[#1b1813] pt-2">
        <p className="font-serif font-bold italic text-sm sm:text-base">La investigación continúa… en el juego</p>
        <Link
          href="/login?registro"
          onClick={() => audioManager.play("typewriter")}
          className="bg-[#1b1813] px-3 py-2 text-[9px] text-[#f2ead8] hover:bg-[#7a1212] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a1212]"
        >
          SEGUIR LA PISTA →
        </Link>
      </footer>
    </article>
  );
}
