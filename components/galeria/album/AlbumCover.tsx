import Image from "next/image";
import styles from "./album.module.css";

type Props = { pasted: number; total: number };

const CAUTION = "bg-[repeating-linear-gradient(45deg,#eab308,#eab308_12px,#090d16_12px,#090d16_24px)]";

// Cabecera del álbum con la estética del juego: panel oscuro con cinta de precaución, balizas de patrullero,
// logo, título dorado, sello de goma y el contador de figuritas como barra de cinta policial
export default function AlbumCover({ pasted, total }: Props) {
  const complete = pasted === total;

  return (
    <header className="relative mb-6 overflow-hidden rounded-2xl border-2 border-yellow-500/50 bg-[#0c1421] text-[#FFF3C7] shadow-[0_18px_40px_rgba(0,0,0,0.75),0_0_24px_rgba(234,179,8,0.15)]">
      {/* Balizas: resplandor rojo y azul en las esquinas de arriba */}
      <div className={`${styles.sirenRed} pointer-events-none absolute -top-16 -left-16 size-48 rounded-full bg-red-600 blur-3xl`} aria-hidden />
      <div className={`${styles.sirenBlue} pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-blue-600 blur-3xl`} aria-hidden />

      {/* Cinta de precaución arriba y abajo */}
      <div className={`h-2.5 ${CAUTION}`} aria-hidden />

      <div className="relative grid items-center gap-4 px-4 py-5 sm:grid-cols-[auto_1fr_auto] sm:gap-6 sm:px-8 sm:py-6">
        <Image
          src="/images/logofinal.png"
          alt="Crímenes Argentinos"
          width={600}
          height={400}
          priority
          className="mx-auto w-28 sm:w-36 h-auto drop-shadow-[0_6px_10px_rgba(0,0,0,0.7)]"
        />

        <div className="text-center sm:text-left">
          <p className="text-[10px] tracking-[0.3em] text-amber-400/90">COLECCIÓN OFICIAL DE LA CENTRAL</p>
          <h1 className="mt-2 text-lg sm:text-3xl leading-snug text-[#E1C380] [text-shadow:0_4px_0_#1E2A36,0_0_22px_rgba(225,195,128,0.35)]">
            ÁLBUM DE SOSPECHOSOS
          </h1>

          {/* Contador: la barra se llena con cinta policial; completa, se vuelve dorada */}
          <div className="mt-4 max-w-md mx-auto sm:mx-0">
            <div className="flex items-baseline justify-between text-[10px]">
              <span className="text-[#FFF3C7]/80">FIGURITAS PEGADAS</span>
              <span className="text-sm text-[#E1C380]">
                {pasted}
                <span className="text-[#FFF3C7]/50">/{total}</span>
              </span>
            </div>
            <div className="mt-1.5 h-4 overflow-hidden rounded-full border-2 border-[#1c2c3e] bg-[#070c16] shadow-inner">
              <div
                className={`${styles.progress} h-full rounded-full ${complete ? "bg-[#E1C380] shadow-[0_0_12px_rgba(225,195,128,0.7)]" : styles.tapeFill}`}
                style={{ width: `${(pasted / total) * 100}%` }}
              />
            </div>
            <p className={`mt-2 text-[10px] ${complete ? "text-[#E1C380]" : "text-amber-400"}`}>
              {complete ? "★ ¡ÁLBUM COMPLETO! ★" : `TE FALTAN ${total - pasted} · ¡ABRÍ EL SOBRE!`}
            </p>
          </div>
        </div>

        {/* Sello de goma */}
        <div
          className={`${styles.stampWobble} hidden sm:flex size-28 shrink-0 flex-col items-center justify-center rounded-full border-4 border-red-600/80 text-center text-red-500 [text-shadow:0_0_6px_rgba(220,38,38,0.4)]`}
          aria-hidden
        >
          <span className="text-[10px] leading-relaxed">EDICIÓN</span>
          <span className="text-xs">ESPECIAL</span>
          <span className="mt-1 text-[10px] tracking-widest">★★★</span>
        </div>
      </div>

      <div className={`h-2.5 ${CAUTION}`} aria-hidden />
    </header>
  );
}
