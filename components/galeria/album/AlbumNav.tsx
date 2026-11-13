type Props = { page: number; pageCount: number; onPrev: () => void; onNext: () => void };

const ARROW =
  "flex items-center gap-2 rounded-full bg-[#ffd447] px-3 sm:px-4 py-2 text-[10px] text-[#0b2547] shadow-[0_4px_0_#b8901a] cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#b8901a] disabled:opacity-30 disabled:cursor-default disabled:hover:translate-y-0";

// Controles para hojear: flechas y "Página X de Y" (también responden a ← → y al deslizar el dedo)
export default function AlbumNav({ page, pageCount, onPrev, onNext }: Props) {
  return (
    <nav className="mt-4 flex items-center justify-between gap-2 text-[#FFF3C7]" aria-label="Hojear el álbum">
      <button type="button" onClick={onPrev} disabled={page === 1} aria-label="Página anterior" className={ARROW}>
        ◀<span className="hidden sm:inline">ANTERIOR</span>
      </button>
      <span className="text-center text-[10px] leading-relaxed" aria-live="polite">
        PÁGINA {page} DE {pageCount}
      </span>
      <button type="button" onClick={onNext} disabled={page === pageCount} aria-label="Página siguiente" className={ARROW}>
        <span className="hidden sm:inline">SIGUIENTE</span>▶
      </button>
    </nav>
  );
}
