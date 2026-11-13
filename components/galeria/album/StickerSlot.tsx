// Casillero vacío del álbum: el número grande impreso esperando su figurita
export default function StickerSlot({ number }: { number: number }) {
  return (
    <div className="flex flex-col rounded-md border-2 border-dashed border-[#1d4e89]/40 bg-[#1d4e89]/5 p-1.5" aria-label={`Casillero ${number} vacío`}>
      <div className="relative aspect-[3/4] flex items-center justify-center rounded-sm bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(29,78,137,0.07)_6px,rgba(29,78,137,0.07)_12px)]">
        <span className="font-mono text-3xl sm:text-4xl font-black text-[#1d4e89]/35">{number}</span>
      </div>
      <span className="mt-1.5 min-h-8 flex items-center justify-center rounded-sm border border-dashed border-[#1d4e89]/30 text-[10px] text-[#1d4e89]/50">
        ???
      </span>
    </div>
  );
}
