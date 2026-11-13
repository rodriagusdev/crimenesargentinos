"use client";

import CaseCard from "./CaseCard";
import styles from "./mapa.module.css";
import type { ProvincePin } from "./mapGeometry";

type Props = {
  pin: ProvincePin | null;
  index: number;
  onPick: (index: number) => void;
  onClose: () => void;
};

// En escritorio, panel al costado del mapa; en celular, hoja que sube desde abajo con el fondo oscurecido
export default function CaseSheet({ pin, index, onPick, onClose }: Props) {
  if (!pin) {
    return (
      <div className="hidden lg:flex min-h-80 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-cyan-400/30 bg-[#0b1220]/70 p-6 text-center">
        <span className="text-4xl" aria-hidden>
          📌
        </span>
        <p className="text-sm text-cyan-100">Tocá un chinche del mapa</p>
        <p className="font-mono text-xs text-cyan-100/60">para abrir el expediente de lo que pasó ahí.</p>
      </div>
    );
  }

  const story = pin.cases[Math.min(index, pin.cases.length - 1)];

  return (
    <>
      <button type="button" aria-label="Cerrar ficha" onClick={onClose} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />
      <div
        role="dialog"
        aria-label={story.title}
        className={`${styles.sheetIn} fixed inset-x-0 bottom-0 z-40 max-h-[85svh] overflow-y-auto overflow-x-hidden rounded-t-2xl bg-[#070c16] p-3 lg:static lg:z-auto lg:max-h-none lg:overflow-visible lg:rounded-none lg:bg-transparent lg:p-0`}
      >
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-cyan-200/40 lg:hidden" aria-hidden />
        <CaseCard key={story.id} story={story} siblings={pin.cases} onPick={onPick} onClose={onClose} />
      </div>
    </>
  );
}
