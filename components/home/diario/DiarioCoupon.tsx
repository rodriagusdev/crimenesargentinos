"use client";

import Link from "next/link";
import SuspectSilhouette from "@/components/splash/SuspectSilhouette";

// Cupón de inscripción "recortable" (el llamado a jugar, a la vista sin bajar) + afiche de SE BUSCA
export default function DiarioCoupon() {
  return (
    <aside className="flex flex-col gap-6">
      <div className="relative p-5 border-[3px] border-dashed border-[#1b1813] bg-[#f6efdc]">
        <svg className="absolute -top-3.5 -left-1 size-6 bg-[#ece4cf]" viewBox="0 0 24 24" fill="none" stroke="#1b1813" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
        </svg>
        <p className="text-[9px] tracking-wider text-[#7a1212]">CUPÓN DE INSCRIPCIÓN</p>
        <p className="mt-2 text-sm leading-relaxed">SE BUSCAN DETECTIVES</p>
        <p className="mt-2 font-mono text-sm">Recorte y presente este cupón en la Central. Sin experiencia.</p>
        <div className="mt-3 flex flex-col gap-1.5 font-mono text-sm">
          <span>Nombre del agente: ______________</span>
          <span>Provincia: ______________________</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/login?registro" className="px-4 py-3.5 bg-[#7a1212] hover:bg-[#5c0d0d] text-[#f6efdc] text-[9px]">
            REGISTRARME
          </Link>
          <Link href="/login" className="px-4 py-3.5 border-2 border-[#1b1813] hover:bg-[#1b1813]/10 text-[9px]">
            YA SOY AGENTE
          </Link>
        </div>
      </div>

      <div className="mx-auto w-48 p-3 bg-[#e6dcc0] text-center rotate-2 shadow-[0_6px_14px_rgba(0,0,0,0.35)]">
        <p className="text-xs tracking-widest">SE BUSCA</p>
        <div className="relative mt-2 aspect-square">
          <SuspectSilhouette variant="fedora" />
        </div>
        <p className="mt-2 text-[8px] leading-relaxed">RECOMPENSA: TU ASCENSO</p>
      </div>
    </aside>
  );
}
