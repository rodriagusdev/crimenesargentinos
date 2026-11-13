import Image from "next/image";
import type { CaseStory } from "@/lib/caseStories";
import { posterExtra } from "./posterExtras";
import styles from "./sebusca.module.css";

type Props = { story: CaseStory; large?: boolean };

// Cara del cartel "SE BUSCA" del objeto (o de quien desapareció), nunca de quien lo hizo: el titular de afiche,
// la ilustración (arte del lugar en sepia con el emoji grande), dónde se lo vio por última vez, el hecho en letra
// chica y la recompensa. `large` es la versión del cartel abierto: más grande y con todo el texto.
export default function PosterFace({ story, large }: Props) {
  const { seen, reward } = posterExtra(story.id);
  return (
    <div className={`relative text-center text-[#3a1f0c] ${styles.paper} ${large ? "p-5 sm:p-8" : "p-2.5 sm:p-4"}`}>
      {/* Marco doble de imprenta */}
      <span className="pointer-events-none absolute inset-1.5 border-2 border-double border-[#3a1f0c]/60 sm:inset-2" aria-hidden />

      <p className={`${styles.serif} ${large ? "text-xs sm:text-sm" : "text-[8px] sm:text-[10px]"} tracking-[0.4em]`}>★ ★ ★</p>
      <p className={`${styles.slab} leading-none ${large ? "mt-2 text-5xl sm:text-7xl" : "mt-1 text-2xl sm:text-4xl"}`}>
        <span className={styles.tall}>SE BUSCA</span>
      </p>
      <p
        className={`${styles.slab} mt-2 border-y-2 border-[#3a1f0c] py-1 uppercase leading-tight text-[#8a1c12] ${
          large ? "text-xl sm:text-3xl" : "text-[11px] sm:text-base"
        }`}
      >
        {story.wanted}
      </p>

      {/* Ilustración */}
      <div className={`relative mx-auto aspect-[4/3] overflow-hidden border-[3px] border-[#3a1f0c] ${large ? "mt-4" : "mt-2"}`}>
        <Image
          src={story.image}
          alt=""
          fill
          sizes={large ? "(min-width: 640px) 520px, 90vw" : "(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"}
          className="object-cover sepia contrast-125 brightness-90"
        />
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(58,31,12,0.55))]" aria-hidden />
        <span
          className={`absolute inset-0 flex items-center justify-center drop-shadow-[0_6px_6px_rgba(0,0,0,0.6)] ${large ? "text-7xl sm:text-8xl" : "text-4xl sm:text-5xl"}`}
          aria-hidden
        >
          {story.emoji}
        </span>
      </div>

      <p className={`${styles.italic} ${large ? "mt-4 text-sm sm:text-base" : "mt-2 text-[9px] sm:text-xs"}`}>{seen}:</p>
      <p className={`${styles.slab} uppercase leading-tight ${large ? "text-base sm:text-xl" : "text-[10px] sm:text-sm"}`}>
        {story.place}, {story.province}
      </p>

      <p
        className={`${styles.serif} mx-auto leading-snug text-[#3a1f0c]/85 ${
          large ? "mt-3 max-w-md text-sm sm:text-base" : "mt-2 hidden text-[10px] sm:line-clamp-3"
        }`}
      >
        {story.synopsis}
      </p>

      <p className={`${styles.slab} text-[#8a1c12] ${large ? "mt-4 text-2xl sm:text-3xl" : "mt-2 text-xs sm:text-lg"}`}>RECOMPENSA</p>
      <p className={`${styles.italic} leading-snug ${large ? "mt-1 text-sm sm:text-base" : "text-[9px] sm:text-[11px]"}`}>{reward}</p>

      <p className={`${styles.serif} mt-2 tracking-widest text-[#3a1f0c]/70 ${large ? "text-[10px] sm:text-xs" : "text-[7px] sm:text-[9px]"}`}>
        CENTRAL DE INVESTIGACIONES · CASO N° {story.level}
      </p>
    </div>
  );
}
