import styles from "./album.module.css";

type Props = { count: number; opening: boolean; onOpen: () => void };

// Sobrecito de figuritas: flota sobre la página nueva hasta que lo abren; al abrirlo se rompe la solapa
export default function StickerPacket({ count, opening, onOpen }: Props) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#0b2547]/35 backdrop-blur-[2px]">
      <button
        type="button"
        onClick={onOpen}
        disabled={opening}
        aria-label={`Abrir el sobre con ${count} figuritas nuevas`}
        className={`group relative w-40 sm:w-48 cursor-pointer disabled:cursor-default ${opening ? styles.packetOpening : styles.packetIdle}`}
      >
        {/* Solapa dentada que se arranca */}
        <span
          className={`block h-5 rounded-t-sm bg-[#c81e1e] [clip-path:polygon(0_100%,0_40%,6%_0,12%_40%,18%_0,24%_40%,30%_0,36%_40%,42%_0,48%_40%,54%_0,60%_40%,66%_0,72%_40%,78%_0,84%_40%,90%_0,96%_40%,100%_0,100%_100%)] ${
            opening ? styles.flapTear : ""
          }`}
          aria-hidden
        />
        {/* Cuerpo del sobre: franjas celeste y blanco con el sol */}
        <span className="relative flex flex-col items-center overflow-hidden rounded-b-md border-2 border-t-0 border-[#0b2547]/30 bg-[linear-gradient(180deg,#74b9e8_0_33%,#fdfdfb_33%_66%,#74b9e8_66%_100%)] px-3 pt-4 pb-5 shadow-[0_18px_30px_rgba(0,0,0,0.45)]">
          <span className="text-[10px] tracking-[0.2em] text-[#0b2547]">SOBRE</span>
          <span className="my-2 text-4xl [filter:drop-shadow(0_2px_0_rgba(0,0,0,0.2))]" aria-hidden>
            ☀️
          </span>
          <span className="rounded bg-[#c81e1e] px-2 py-1 text-[10px] text-white shadow">{count} FIGURITAS</span>
          <span className="mt-1.5 text-[10px] text-[#0b2547]">¡NUEVAS!</span>
          <span className="galeria-holo absolute inset-0" aria-hidden />
        </span>
        <span className="mt-4 block rounded-full bg-[#ffd447] px-3 py-2 text-[10px] text-[#0b2547] shadow-[0_6px_0_#b8901a] group-hover:-translate-y-0.5 group-active:translate-y-1 group-active:shadow-[0_2px_0_#b8901a] transition-transform">
          {opening ? "ABRIENDO…" : "¡ABRILO!"}
        </span>
      </button>
    </div>
  );
}
