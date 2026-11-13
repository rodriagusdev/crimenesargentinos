type Props = { label: string; active: boolean; isNew: boolean; onSelect: () => void };

// Pestaña de una página del álbum; la del release nuevo lleva el cartelito "¡NUEVA!" que late
export default function AlbumTab({ label, active, isNew, onSelect }: Props) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={`relative shrink-0 rounded-t-lg px-4 pt-2.5 pb-2 text-[10px] sm:text-xs cursor-pointer transition-transform ${
        active
          ? "bg-[#f3ead2] text-[#1d4e89] shadow-[0_-3px_6px_rgba(0,0,0,0.15)]"
          : "translate-y-1 bg-[#0b2547] text-[#FFF3C7]/80 hover:translate-y-0 hover:text-[#FFF3C7]"
      }`}
    >
      {label.toUpperCase()}
      {isNew && (
        <span className="absolute -top-2.5 -right-1.5 px-1.5 py-0.5 rounded bg-[#c81e1e] text-white text-[10px] rotate-6 shadow-[0_0_10px_rgba(255,212,71,0.8)]">
          ¡NUEVA!
        </span>
      )}
    </button>
  );
}
