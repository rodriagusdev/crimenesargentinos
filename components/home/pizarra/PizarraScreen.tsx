"use client";

import Link from "next/link";
import HomeNav from "../HomeNav";
import CaseNoteCard, { CaseNote } from "./CaseNoteCard";

// Casos reales, elegidos porque su sinopsis no nombra ni describe al culpable (todos los sospechosos son culpables en algún caso)
const CASES: CaseNote[] = [
  { title: "ROBO A LAS ESTRELLAS", synopsis: "El trofeo mundial desapareció tras los festejos. Buscá pistas en el Obelisco.", tilt: -2 },
  { title: "EL GRAN ROBO DEL ALFAJOR", synopsis: "Desapareció el camión con la producción de alfajores de toda la temporada.", tilt: 2 },
  { title: "LA CAMISETA DEL 86", synopsis: "La camiseta firmada del Mundial 86 desapareció de una muestra itinerante.", tilt: -1 },
  { title: "EL BANDONEÓN DE ORO", synopsis: "Le robaron el bandoneón de oro a un tanguero histórico en plena milonga.", tilt: 1.5 },
  { title: "DESAPARECEN LOS MAÑANEROS", synopsis: "Hinchas estafados con entradas truchas para la selección. La pista va al norte.", tilt: -2.5 },
];
const TOTAL_CASES = 24;
const PROVINCES = 23;

// Portada "Pizarra de casos abiertos": fichas de casos en un corcho con hilo rojo
export default function PizarraScreen() {
  return (
    <div className="min-h-screen bg-[#070c16] text-[#FFF3C7] overflow-x-hidden">
      <HomeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-7">
        <div>
          <h1 className="text-lg sm:text-xl leading-relaxed">Casos abiertos</h1>
          <p className="mt-2 font-mono text-lg text-[#FFF3C7]/70">La banda sigue suelta. Elegí un expediente y empezá a investigar.</p>
        </div>

        <div className="flex flex-wrap gap-7 items-start">
          <section
            aria-label="Pizarra de casos"
            className="relative flex-[999_1_640px] min-w-0 px-5 sm:px-7 py-10 rounded-lg border-[12px] border-[#4a2e18] bg-[#b98a55] bg-[radial-gradient(circle,rgba(0,0,0,0.12)_0_1px,transparent_1.5px)] bg-[length:7px_7px] shadow-[inset_0_0_40px_rgba(60,30,10,0.6),0_24px_50px_rgba(0,0,0,0.6)]"
          >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
              <path className="home-string" pathLength={1} d="M18 14 L50 46 L84 16 M50 46 L20 80 M50 46 L82 82" fill="none" stroke="#b91c1c" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="relative grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8">
              {CASES.map((note, i) => (
                <CaseNoteCard key={note.title} note={note} delayMs={i * 90} />
              ))}
              <Link
                href="/login"
                className="home-drop flex flex-col items-center justify-center gap-3 p-4 bg-[#1b2633] text-[#E1C380] border-2 border-dashed border-[#E1C380] rotate-1 text-center hover:bg-[#22303f]"
                style={{ animationDelay: `${CASES.length * 90}ms` }}
              >
                <span className="text-2xl">+ {TOTAL_CASES - CASES.length}</span>
                <span className="text-[9px] leading-loose">CASOS MÁS EN TODO EL PAÍS</span>
              </Link>
            </div>
          </section>

          <aside className="flex-[1_1_280px] flex flex-col gap-5">
            <div className="p-5 rounded-xl bg-[#0c1421] border border-[#E1C380]/30">
              <p className="text-[9px] text-[#E1C380]">EN LA CENTRAL</p>
              <p className="mt-4 text-2xl">{TOTAL_CASES}</p>
              <p className="mt-1 font-mono text-base text-[#FFF3C7]/70">casos para resolver</p>
              <p className="mt-4 text-2xl">{PROVINCES}</p>
              <p className="mt-1 font-mono text-base text-[#FFF3C7]/70">provincias para recorrer</p>
            </div>
            <div className="relative p-5 rounded-xl bg-[#0c1421] border border-[#E1C380]/30">
              <p className="text-[9px] text-[#E1C380]">PODIO DE AGENTES</p>
              <ol className="mt-4 pl-6 list-decimal font-mono text-base leading-loose" aria-label="Podio oculto hasta iniciar sesión">
                {[0, 1, 2].map((i) => (
                  <li key={i}>
                    <span className="inline-block h-3 w-32 align-middle rounded-sm bg-[#FFF3C7]/30 blur-[2px]" />
                  </li>
                ))}
              </ol>
              <span className="absolute right-5 top-1/2 rotate-[-12deg] px-2 py-1 border-[3px] border-double border-red-500 text-red-400 text-[9px]">
                TOP SECRETO
              </span>
              <Link href="/login" className="mt-3 inline-block text-[9px] text-[#E1C380] hover:underline">
                ENTRAR PARA VERLO →
              </Link>
            </div>
            <Link href="/reglas" className="p-4 rounded-xl border-2 border-[#FFF3C7]/40 hover:border-[#E1C380] text-center text-[9px]">
              ¿CÓMO SE JUEGA?
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
