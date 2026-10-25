"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { IMuseumItem } from "@/models/IMuseumItem";
import { MOCK_MUSEUM_ITEMS } from "@/data/museumItems";
import { useAudioStore } from "@/stores/useAudioStore";

interface MuseumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MuseumModal({ isOpen, onClose }: MuseumModalProps) {
  const playSfx = useAudioStore((state) => state.playSfx);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [inspectedItem, setInspectedItem] = useState<IMuseumItem | null>(null);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const categories = [
    { id: "all", label: "Todas las Salas" },
    { id: "Deportivo", label: "Deporte" },
    { id: "Histórico", label: "Historia" },
    { id: "Paleontológico", label: "Paleontología" },
    { id: "Joyería", label: "Joyería" },
    { id: "Astronómico", label: "Astronomía" },
    { id: "Literario", label: "Literatura" },
  ];

  const filteredItems = MOCK_MUSEUM_ITEMS.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const recoveredCount = MOCK_MUSEUM_ITEMS.filter((i) => i.status === "recovered").length;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="
          relative w-full max-w-[1240px] max-h-[94vh]
          flex flex-col rounded-2xl
          bg-[#0d141e] border-2 border-amber-500/40
          shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.15)]
          text-[#FFF3C7] overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* 1. HEADER: MUSEO FEDERAL DE LA JUSTICIA Y PATRIMONIO NACIONAL              */}
        {/* ========================================================================= */}
        <div className="w-full bg-gradient-to-r from-[#121c2b] via-[#1a273b] to-[#121c2b] border-b border-amber-500/30 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl shadow-inner">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                  Archivo Nacional de Evidencias
                </span>
                <span className="hidden sm:inline text-xs text-amber-400/60 font-mono">· División Delitos Federales</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-mono tracking-wide text-[#FFF3C7] mt-0.5">
                MUSEO DE BIENES RECUPERADOS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Contador de tesoros rescatados */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 font-mono text-xs">
              <span className="text-emerald-400 font-bold">✓ {recoveredCount} / {MOCK_MUSEUM_ITEMS.length}</span>
              <span className="text-emerald-200/80 text-[11px] hidden sm:inline">PIEZAS RESTITUIDAS</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="size-9 rounded-xl bg-[rgba(255,243,199,0.08)] hover:bg-red-950/70 border border-[rgba(255,243,199,0.2)] hover:border-red-400 text-[#FFF3C7]/80 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              title="Cerrar museo (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BARRA DE FILTROS POR SALAS TEMÁTICAS                                   */}
        {/* ========================================================================= */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#090f17] border-b border-[rgba(255,243,199,0.1)] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] uppercase tracking-wider font-mono text-[#FFF3C7]/50 font-bold shrink-0 mr-1">
            Salas:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                playSfx("typewriter");
                setSelectedCategory(cat.id);
              }}
              className={`
                px-3 py-1 rounded-lg font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer
                ${
                  selectedCategory === cat.id
                    ? "bg-amber-400 text-zinc-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                    : "bg-[#101b2a] text-[#FFF3C7]/70 hover:text-[#FFF3C7] hover:bg-[#162438] border border-[rgba(255,243,199,0.1)]"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 3. GALERÍA DE VITRINAS DE EXHIBICIÓN (GRID DE TESOROS)                    */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a1018] custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredItems.map((item) => {
              const isRecovered = item.status === "recovered";

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playSfx("click");
                    setInspectedItem(item);
                  }}
                  className={`
                    group relative flex flex-col justify-between rounded-2xl overflow-hidden
                    border-2 transition-all duration-200 cursor-pointer select-none
                    shadow-[0_12px_28px_rgba(0,0,0,0.7)]
                    ${
                      isRecovered
                        ? "bg-gradient-to-b from-[#132032] to-[#0c1522] border-amber-400/40 hover:border-amber-400 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(245,158,11,0.2)]"
                        : "bg-[#080d15]/80 border-slate-700/50 opacity-70 hover:opacity-90"
                    }
                  `}
                >
                  {/* Vitrina Glass Glare Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />

                  {/* Header de la Vitrina con Estado */}
                  <div className="p-3 border-b border-[rgba(255,243,199,0.08)] flex items-center justify-between bg-black/30">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-300/80">
                      Nivel {item.level} · {item.province}
                    </span>

                    {isRecovered ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                        RECUPERADO
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-red-950/70 border border-red-500/30 text-red-300">
                        EN BÚSQUEDA
                      </span>
                    )}
                  </div>

                  {/* Centro de la Vitrina: Pedestal y Spotlight */}
                  <div className="relative py-8 px-4 flex flex-col items-center justify-center bg-radial from-amber-500/[0.08] via-transparent to-transparent">
                    {/* Spotlight glow detrás del artefacto */}
                    <div className="absolute size-28 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

                    <div className="relative size-20 rounded-2xl bg-black/40 border-2 border-amber-400/30 flex items-center justify-center text-4xl shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300">
                      <span>{item.icon}</span>
                    </div>

                    {/* Placa metálica de pedestal */}
                    <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 mt-3 shadow-md" />
                  </div>

                  {/* Placa de bronce inferior con descripción y valor */}
                  <div className="p-3.5 bg-black/50 border-t border-[rgba(255,243,199,0.1)] flex flex-col gap-1 text-center">
                    <h4 className="font-mono font-bold text-xs sm:text-sm text-[#FFF3C7] group-hover:text-amber-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="font-mono text-[10px] text-[#FFF3C7]/60 line-clamp-1">
                      {item.subtitle}
                    </p>
                    <div className="pt-1 mt-1 border-t border-[rgba(255,243,199,0.08)] flex items-center justify-between text-[10px] font-mono">
                      <span className="text-amber-400 font-bold">{item.estimatedValue}</span>
                      <span className="text-amber-300/80 group-hover:translate-x-0.5 transition-transform">Ver ficha ➔</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. MODAL DETALLADO DE INSPECCIÓN DEL ARTEFACTO (FICHA PERICIAL)           */}
        {/* ========================================================================= */}
        {inspectedItem && (
          <div
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
            onClick={() => setInspectedItem(null)}
          >
            <div
              className="
                relative w-full max-w-xl p-6 sm:p-7 rounded-2xl
                bg-gradient-to-b from-[#141f2e] to-[#0c1421]
                border-2 border-amber-400/60 shadow-[0_25px_70px_rgba(0,0,0,0.9)]
                text-[#FFF3C7] flex flex-col gap-4 overflow-hidden
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sello de autenticidad judicial */}
              <div className="flex items-center justify-between border-b border-[rgba(255,243,199,0.15)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏛️</span>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                      Ficha Pericial de Custodia Nº {inspectedItem.id.toUpperCase()}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-mono text-[#FFF3C7]">
                      {inspectedItem.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectedItem(null)}
                  className="size-8 rounded-xl bg-black/40 hover:bg-red-950/70 border border-[rgba(255,243,199,0.2)] text-[#FFF3C7]/70 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Contenido de la Ficha */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                <div className="size-24 rounded-2xl bg-black/60 border-2 border-amber-400/40 flex items-center justify-center text-5xl shadow-[inset_0_4px_16px_rgba(0,0,0,0.8)] shrink-0">
                  <span>{inspectedItem.icon}</span>
                </div>

                <div className="flex flex-col gap-1.5 flex-1 text-center sm:text-left">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {inspectedItem.subtitle}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono py-1.5 border-y border-[rgba(255,243,199,0.1)] text-[#FFF3C7]/80">
                    <div>
                      <span className="text-slate-400 block text-[9px]">CASO POLICIAL:</span>
                      <span className="font-bold text-amber-200">{inspectedItem.caseName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">PROVINCIA:</span>
                      <span className="font-bold text-amber-200">{inspectedItem.province}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">VALUACIÓN FISCAL:</span>
                      <span className="font-bold text-emerald-300">{inspectedItem.estimatedValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">FECHA RECUPERACIÓN:</span>
                      <span className="font-bold text-amber-200">{inspectedItem.recoveredDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historia y Reseña de la Obra */}
              <div className="flex flex-col gap-1.5 bg-black/40 p-3.5 rounded-xl border border-[rgba(255,243,199,0.1)] text-xs font-mono">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  Historia del Bien Patrimonial:
                </span>
                <p className="text-[#FFF3C7]/90 leading-relaxed">
                  {inspectedItem.description}
                </p>
              </div>

              {/* Informe del Operativo Policial */}
              <div className="flex flex-col gap-1.5 bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/30 text-xs font-mono">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <span>🔍</span>
                  <span>Informe de Recuperación Federal:</span>
                </span>
                <p className="text-emerald-100/90 leading-relaxed">
                  {inspectedItem.policeReport}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                className="w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors cursor-pointer shadow-md"
              >
                CERRAR FICHA PERICIAL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
