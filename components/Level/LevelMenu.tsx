"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTypewriterSound } from "@/hooks/useTypewriterSound";
import IMenuAction from "@/models/IMenuAction";
import { MENU_ACTIONS } from "@/data/menuActions";

interface LevelMenuProps {
  levelId: number;
}

export default function LevelMenu({ levelId }: LevelMenuProps) {
  const router = useRouter();
  const playTypewriter = useTypewriterSound();
  const [activeModal, setActiveModal] = useState<IMenuAction | null>(null);

  return (
    <>
      {/* Barra de menú lateral que ocupa todo el alto */}
      <aside className="absolute right-0 top-0 bottom-0 w-80 bg-[#0f172a]/80 backdrop-blur-sm border-l border-[#1e293b] p-6 flex flex-col z-20">
        {/* Cabecera del menú */}
        <div className="flex items-center justify-between mb-8 border-b border-[#334155] pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Investigación</h1>
            <p className="text-xs text-amber-300/80 font-mono tracking-wider mt-0.5">
              CASO #{levelId.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-4 font-semibold">
          Expediente del Caso
        </h2>

        {/* Lista de acciones con los íconos temáticos */}
        <div className="flex-grow flex flex-col gap-3 overflow-y-auto pr-1">
          {MENU_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => setActiveModal(action)}
              onMouseEnter={playTypewriter}
              className="w-full p-3 rounded-xl bg-[#1e293b]/70 hover:bg-[#1e293b] border border-[#334155] hover:border-amber-500/50 transition-all duration-200 flex items-center gap-3.5 group shadow-sm hover:shadow-md cursor-pointer text-left"
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#334155] bg-black/40 shrink-0">
                <Image
                  src={action.icon}
                  alt={action.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-slate-200 group-hover:text-amber-200 transition-colors">
                  {action.title}
                </span>
                <span className="block text-xs text-slate-400 truncate mt-0.5">
                  {action.description}
                </span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push("/")}
          onMouseEnter={playTypewriter}
          className="mt-auto w-full flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-lg bg-[#1e293b] text-slate-300 hover:bg-[#334155] hover:text-slate-100 transition-colors border border-[#334155]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4 opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al Menú Principal
        </button>
      </aside>

      {/* Modal interactivo al pulsar una acción PLACEHOLDER*/}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0f172a]/95 border border-[#334155] rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-amber-500/40 mb-4 shadow-lg bg-black/50">
              <Image
                src={activeModal.icon}
                alt={activeModal.title}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-xl font-bold text-slate-100 mb-1">
              {activeModal.title}
            </h3>
            <p className="text-xs uppercase tracking-widest text-amber-300/80 font-mono mb-3">
              CASO #{levelId.toString().padStart(2, "0")}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {activeModal.detail}
            </p>

            <button
              onClick={() => setActiveModal(null)}
              onMouseEnter={playTypewriter}
              className="w-full py-2.5 px-4 rounded-lg bg-[#1e293b] text-slate-200 hover:bg-[#334155] font-semibold text-sm transition-colors border border-[#334155]"
            >
              Cerrar Expediente
            </button>
          </div>
        </div>
      )}
    </>
  );
}
