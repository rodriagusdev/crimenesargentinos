import Image from "next/image";
import type { ReactNode } from "react";
import type { TimelineScene } from "@/hooks/useTrailerTimeline";
import type { CaseStory } from "@/lib/caseStories";
import styles from "./vhs.module.css";

// Tráiler de UN caso (unos 35 s), armado solo con los datos públicos del caso:
// expediente → el lugar → el hecho → lo que se busca → la frase gancho → el título
export type CaseScene = TimelineScene & { render: (story: CaseStory, number: number) => ReactNode };

// Fondo de escena: el arte propio del tráiler (lugar u objeto) o, si no hay, el arte del nivel
type Art = "place" | "wanted";
const artOf = (story: CaseStory, art: Art) => story.trailerArt?.[art] ?? story.image;

const Scene = ({ story, art = "place", children, dim = 0.55 }: { story: CaseStory; art?: Art; children: ReactNode; dim?: number }) => (
  <div className="absolute inset-0">
    {/* Se sirve tal cual (1920 de ancho), sin la optimización que la achica y le saca calidad */}
    <Image src={artOf(story, art)} alt="" fill unoptimized className={`object-cover ${styles.kenBurns}`} />
    <div className="absolute inset-0 bg-black" style={{ opacity: dim }} />
    {children}
  </div>
);

/** Primeras oraciones de la sinopsis, para escribirlas sobre la escena */
const sentences = (text: string) => text.split(/(?<=[.!?…])\s+/).filter(Boolean);

export const CASE_SCENES: CaseScene[] = [
  // Pantalla azul de VHS con el número de expediente
  {
    ms: 3800,
    sfx: "mechanickey",
    render: (_story, number) => (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#1838c8] text-white">
        <span className="text-[10px] tracking-[0.3em]">ARCHIVO DE LA CENTRAL</span>
        <span className={`text-lg sm:text-4xl ${styles.slam}`}>EXPEDIENTE {String(number).padStart(2, "0")}</span>
      </div>
    ),
  },
  // El lugar donde empieza
  {
    ms: 5200,
    sfx: "radio",
    render: (story) => (
      <Scene story={story} dim={0.25}>
        <div className={`absolute left-4 bottom-8 sm:left-8 sm:bottom-16 max-w-[85%] ${styles.fadeUp}`}>
          <p className="font-mono text-xs sm:text-sm text-[#ffd447]">LUGAR DEL HECHO</p>
          <p className="mt-1 font-mono text-base sm:text-4xl font-black text-white [text-shadow:0_3px_0_#000]">{story.place}</p>
          <p className="font-mono text-xs sm:text-lg text-white/85 [text-shadow:0_2px_0_#000]">{story.province}</p>
        </div>
      </Scene>
    ),
  },
  // El hecho, como titular
  {
    ms: 5000,
    sfx: "stamp",
    render: (story) => (
      <div className="absolute inset-0 flex items-center justify-center bg-black px-6">
        <h3 className={`max-w-3xl text-center font-serif text-xl sm:text-5xl font-black uppercase leading-tight text-white ${styles.slam}`}>
          {story.headline}
        </h3>
      </div>
    ),
  },
  // Lo que pasó, escrito sobre la escena
  {
    ms: 6200,
    sfx: "typewriter",
    render: (story) => (
      <Scene story={story} dim={0.7}>
        <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-5 sm:gap-3 sm:px-16">
          {sentences(story.synopsis).map((line, i) => (
            <p
              key={line}
              className={`font-mono text-[11px] sm:text-xl leading-snug sm:leading-relaxed text-white [text-shadow:0_2px_0_#000] ${styles.fadeUp}`}
              style={{ animationDelay: `${i * 1100}ms` }}
            >
              {line}
            </p>
          ))}
        </div>
      </Scene>
    ),
  },
  // Lo que se busca, con sello
  {
    ms: 4600,
    sfx: "warning",
    render: (story) => (
      <Scene story={story} art="wanted" dim={story.trailerArt?.wanted ? 0.35 : 0.6}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span className={`border-4 border-[#e33] px-3 py-1.5 sm:px-4 sm:py-2 text-[#ff5a5a] text-xs sm:text-2xl bg-black/50 ${styles.stamp}`}>
            SE BUSCA: {story.wanted.toUpperCase()}
          </span>
        </div>
      </Scene>
    ),
  },
  // La frase gancho
  {
    ms: 4800,
    sfx: "swoosh",
    render: (story) => (
      <div className="absolute inset-0 flex items-center justify-center bg-black px-8">
        <p className={`max-w-2xl text-center font-serif italic text-lg sm:text-4xl text-[#E1C380] ${styles.fadeUp}`}>“{story.tagline}”</p>
      </div>
    ),
  },
  // Título del caso
  {
    ms: 5200,
    sfx: "opencasefile",
    render: (story) => (
      <Scene story={story} dim={0.65}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          {/* Logo del juego + "PRESENTA" */}
          <Image
            src="/images/logofinal.png"
            alt="Crímenes Argentinos"
            width={600}
            height={400}
            className={`h-auto w-[min(24%,220px)] sm:w-[min(38%,220px)] drop-shadow-[0_6px_10px_rgba(0,0,0,0.8)] ${styles.fadeUp}`}
          />
          <span className="text-[10px] sm:text-xs tracking-[0.4em] text-[#ffd447] [text-shadow:0_2px_0_#000]">PRESENTA</span>
          <h3 className={`font-serif text-xl sm:text-6xl font-black uppercase leading-none text-white [text-shadow:0_4px_0_#000] ${styles.slam}`}>
            {story.title}
          </h3>
          <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-white/80">NIVEL {story.level}</span>
        </div>
      </Scene>
    ),
  },
];
