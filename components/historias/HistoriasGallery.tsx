import Image from "next/image";
import HistoriaCard from "./HistoriaCard";
import { HISTORIAS } from "./historias";
import GameBackdrop, { CautionBar, GAME_BG } from "@/components/galeria/GameBackdrop";

// Galería de propuestas para la página pública de historias de los casos: un botón por cada una para compararlas
export default function HistoriasGallery() {
  return (
    <div className={`relative ${GAME_BG} min-h-svh px-4 sm:px-6 py-10 sm:py-14 text-[#FFF3C7]`}>
      <GameBackdrop />
      <CautionBar className="max-w-6xl" />
      <main className="relative max-w-6xl mx-auto flex flex-col gap-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <Image src="/images/logofinal.png" alt="Crímenes Argentinos" width={600} height={400} priority className="w-48 sm:w-56 h-auto" />
          <h1 className="text-base sm:text-xl leading-relaxed">Historias de los casos</h1>
          <p className="max-w-2xl font-mono text-base sm:text-lg text-[#FFF3C7]/70">
            Propuestas para una página pública que cuente de qué trata cada caso sin dar pistas: solo el hecho y dónde empieza.
          </p>
        </header>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {HISTORIAS.map((h, i) => (
            <HistoriaCard key={h.id} historia={h} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
