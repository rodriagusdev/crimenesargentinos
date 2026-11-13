"use client";

import Link from "next/link";
import { PfaSeal } from "./ManualParts";

const BTN = "flex-1 sm:flex-none px-3 sm:px-3.5 py-2.5 sm:py-1.5 rounded border text-xs font-serif font-bold transition-all shadow-xs text-center cursor-pointer";

// Pie del folio: número de página, ANTERIOR / SIGUIENTE (en el último, a jugar) y el sello de la PFA
export default function ManualFooter({ page, total, onPrev, onNext }: { page: number; total: number; onPrev: () => void; onNext: () => void }) {
  const last = page === total - 1;
  return (
    <footer className="shrink-0 pt-2.5 sm:pt-3 border-t border-[#cbbca3] flex items-center justify-between gap-2 sm:gap-3">
      <div className="hidden sm:flex items-center gap-2.5">
        <div className="size-9 rounded border-2 border-[#8f744e] bg-[#ede0c7] flex items-center justify-center font-serif font-black text-sm text-[#382b1d] shadow-inner">
          {page + 1}
        </div>
        <div className="text-xs font-serif text-[#66523c]">
          Folio {page + 1} de {total}
        </div>
      </div>

      <div className="flex flex-1 sm:flex-none items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={page === 0}
          className={`${BTN} border-[#8f744e] bg-[#eee4cf] hover:bg-[#e0d2b7] text-[#342617] disabled:opacity-30 disabled:pointer-events-none`}
        >
          ← ANTERIOR
        </button>
        {last ? (
          <Link href="/login?registro" className={`${BTN} sm:px-5 border-[#7a1a1a] bg-[#9e1c1c] hover:bg-[#7a1414] text-[#f9f3e6]`}>
            JUGAR AHORA →
          </Link>
        ) : (
          <button type="button" onClick={onNext} className={`${BTN} sm:px-5 border-[#443323] bg-[#3a2d1f] hover:bg-[#291f14] text-[#f9f3e6]`}>
            SIGUIENTE →
          </button>
        )}
      </div>

      <PfaSeal />
    </footer>
  );
}
