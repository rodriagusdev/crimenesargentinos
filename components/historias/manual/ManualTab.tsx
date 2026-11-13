"use client";

// Pestaña de la cinta de secciones del manual (una por caso, más el índice)
export default function ManualTab({
  idx,
  number,
  label,
  active,
  onSelect,
}: {
  idx: number;
  number: string;
  label: string;
  active: boolean;
  onSelect: (idx: number) => void;
}) {
  return (
    <button
      type="button"
      data-idx={idx}
      onClick={() => onSelect(idx)}
      aria-current={active ? "page" : undefined}
      className={`shrink-0 whitespace-nowrap px-2.5 sm:px-3 py-1.5 sm:py-1 rounded text-[10px] sm:text-xs font-serif tracking-wider transition-all border cursor-pointer ${
        active
          ? "bg-[#382b1d] text-[#f8f2e4] border-[#382b1d] font-bold shadow-xs"
          : "bg-[#eee4cf] text-[#5a4835] border-[#cbbba2] hover:bg-[#dfd3bc]"
      }`}
    >
      <span className="font-mono text-[9px] mr-1.5 opacity-80">{number}</span>
      <span>{label}</span>
    </button>
  );
}
