import Image from "next/image";
import { CASE_STORIES } from "@/lib/caseStories";
import styles from "./vhs.module.css";

// Imágenes de los casos para las columnas (lugar y objeto, alternadas entre los dos lados)
const LEFT = CASE_STORIES.map((s) => s.trailerArt?.place ?? s.image);
const RIGHT = CASE_STORIES.map((s) => s.trailerArt?.wanted ?? s.trailerArt?.place ?? s.image).reverse();

function Column({ images, side }: { images: string[]; side: "left" | "right" }) {
  // La lista va dos veces para que el desplazamiento no tenga salto
  const loop = [...images, ...images];
  return (
    <div
      className={`fixed top-0 bottom-0 w-56 overflow-hidden opacity-55 [mask-image:linear-gradient(180deg,transparent,#000_18%,#000_82%,transparent)] ${
        side === "left" ? "left-[calc(50%-58rem)]" : "right-[calc(50%-58rem)]"
      }`}
    >
      <div className={`flex flex-col ${side === "left" ? styles.driftUp : styles.driftDown}`}>
        {loop.map((src, i) => (
          <div key={i} className="relative mb-4 aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.6)]">
            <Image src={src} alt="" fill sizes="224px" className="object-cover blur-[1px] saturate-90 brightness-110" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Costados de la videoteca (solo en pantallas anchas, donde sobra lugar; el contenido mide 85rem):
// dos columnas con las escenas de los casos que se desplazan lento, atenuadas y fundidas arriba y abajo
export default function VideotecaSideDecor() {
  return (
    <div className="pointer-events-none hidden min-[1760px]:block" aria-hidden>
      <Column images={LEFT} side="left" />
      <Column images={RIGHT} side="right" />
    </div>
  );
}
