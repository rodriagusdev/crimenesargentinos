import Image from "next/image";
import { CREDITS, toneFor } from "./afiches";
import { audioManager } from "@/lib/audioManager";
import type { CaseStory } from "@/lib/caseStories";
import styles from "./afiches.module.css";

type Props = { story: CaseStory; order: number; onOpen: () => void };

// Afiche de cine de un caso, en su exhibidor dorado: arte de la escena, frase gancho, título grande y créditos
export default function MoviePoster({ story, order, onOpen }: Props) {
  const tone = toneFor(story.level);

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => audioManager.play("opencasefile", { volume: 0.5 })}
      aria-label={`${story.title}: ver la contratapa`}
      style={{ animationDelay: `${order * 90}ms` }}
      className={`group relative block w-full rounded-sm border-[6px] border-[#b8892e] bg-[#0b0507] p-1 text-left cursor-pointer shadow-[0_18px_40px_rgba(0,0,0,0.75),inset_0_0_0_2px_#5a3d10] transition-transform duration-300 hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd678] ${styles.poster} ${styles.posterIn}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-black">
        <Image
          src={story.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
          className="object-cover saturate-[1.15] transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.75)_0%,transparent_28%,transparent_45%,rgba(0,0,0,0.92)_72%,#000_100%)]" aria-hidden />
        <span className="absolute inset-0 mix-blend-soft-light opacity-60" style={{ background: `radial-gradient(circle at 50% 35%, rgba(${tone.glow},0.6), transparent 70%)` }} aria-hidden />

        <p className="absolute inset-x-2 top-2 text-center font-serif text-[7px] sm:text-[9px] tracking-[0.25em] text-white/80">CRÍMENES ARGENTINOS PRESENTA</p>
        <p className="absolute inset-x-3 top-6 sm:top-8 text-center font-serif italic text-[10px] sm:text-sm leading-tight text-white/90 [text-shadow:0_2px_6px_#000]">
          &ldquo;{story.tagline}&rdquo;
        </p>

        <div className="absolute inset-x-2 bottom-2 flex flex-col items-center gap-1.5 text-center">
          <h3
            className="font-serif font-black uppercase leading-[0.9] tracking-tight text-lg sm:text-2xl text-balance [text-shadow:0_3px_10px_rgba(0,0,0,0.9)]"
            style={{ color: tone.accent }}
          >
            {story.title}
          </h3>
          <p className="font-serif text-[7px] sm:text-[9px] tracking-[0.2em] text-white/85">UN CASO DE NIVEL {story.level}</p>
          <p className="hidden sm:block font-serif text-[6px] leading-tight tracking-wide text-white/45 [transform:scaleY(1.4)]">{CREDITS}</p>
          <div className="flex items-center gap-1.5">
            <span className="border border-white/70 px-1 py-px font-serif text-[6px] sm:text-[7px] font-bold tracking-wider text-white/85">
              APTA PARA DETECTIVES
            </span>
            <span className="font-serif text-[7px] sm:text-[8px] font-bold tracking-widest" style={{ color: tone.accent }}>
              PRÓXIMAMENTE
            </span>
          </div>
        </div>

        {/* Vidrio del exhibidor */}
        <span className={`pointer-events-none absolute inset-0 ${styles.shine}`} aria-hidden />
      </div>
    </button>
  );
}
