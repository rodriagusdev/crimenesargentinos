import styles from "./album.module.css";

// Posiciones fijas de las estrellitas de la tapa (sin azar para no romper la hidratación)
const STARS = [
  { left: "6%", top: "18%", delay: "0s" },
  { left: "16%", top: "68%", delay: "0.9s" },
  { left: "30%", top: "12%", delay: "1.6s" },
  { left: "70%", top: "16%", delay: "0.4s" },
  { left: "84%", top: "64%", delay: "1.2s" },
  { left: "93%", top: "22%", delay: "2s" },
];

type Props = { pasted: number; total: number };

// Tapa del álbum: lomo cosido, título con relieve, estrellitas y el contador de figuritas pegadas
export default function AlbumCover({ pasted, total }: Props) {
  const complete = pasted === total;
  return (
    <header className="relative mb-6 overflow-hidden rounded-xl border-4 border-[#0b2547] bg-[linear-gradient(135deg,#1d4e89,#123a6b_55%,#0b2547)] py-6 pl-10 pr-4 sm:pl-14 text-center text-[#FFF3C7] shadow-[0_14px_30px_rgba(0,0,0,0.45)]">
      {/* Lomo con costura */}
      <div className="absolute inset-y-0 left-0 w-6 sm:w-9 bg-[linear-gradient(90deg,#071a33,#0e2f58)] shadow-[inset_-3px_0_6px_rgba(0,0,0,0.5)]" aria-hidden>
        <span className="absolute inset-y-2 right-1.5 border-r-2 border-dashed border-[#ffd447]/50" />
      </div>
      {/* Franja celeste y blanca de fondo */}
      <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 bg-[linear-gradient(180deg,rgba(116,185,232,0.18)_0_33%,rgba(255,255,255,0.12)_33%_66%,rgba(116,185,232,0.18)_66%)]" aria-hidden />
      {STARS.map((s) => (
        <span key={s.left} className={`${styles.twinkle} absolute text-[#ffd447] text-xs`} style={{ left: s.left, top: s.top, animationDelay: s.delay }} aria-hidden>
          ★
        </span>
      ))}

      <p className="relative text-[10px] tracking-[0.3em] text-[#ffd447]">CRÍMENES ARGENTINOS</p>
      <h1 className="relative mt-2 text-lg sm:text-2xl leading-relaxed [text-shadow:0_4px_0_#071a33,0_0_18px_rgba(255,212,71,0.35)]">
        ÁLBUM OFICIAL DE SOSPECHOSOS
      </h1>

      {/* Contador de la colección */}
      <div className="relative mx-auto mt-4 max-w-xs">
        <div className="flex justify-between text-[10px]">
          <span>PEGADAS</span>
          <span className="font-mono text-xs font-bold">
            {pasted}/{total}
          </span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full border-2 border-[#071a33] bg-[#071a33]">
          <div
            className={`${styles.progress} h-full rounded-full ${complete ? "bg-[#ffd447]" : "bg-[#74b9e8]"}`}
            style={{ width: `${(pasted / total) * 100}%` }}
          />
        </div>
        <p className={`mt-2 text-[10px] ${complete ? "text-[#ffd447]" : "text-[#FFF3C7]/70"}`}>
          {complete ? "★ ¡ÁLBUM COMPLETO! ★" : `TE FALTAN ${total - pasted}`}
        </p>
      </div>
    </header>
  );
}
