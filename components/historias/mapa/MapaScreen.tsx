"use client";

import { useEffect, useState } from "react";
import CaseSheet from "./CaseSheet";
import TacticalMap from "./TacticalMap";
import styles from "./mapa.module.css";
import { PROVINCE_PINS } from "./mapGeometry";
import GameBackdrop, { CautionBar, GAME_BG } from "@/components/galeria/GameBackdrop";
import { CASE_STORIES } from "@/lib/caseStories";
import { audioManager } from "@/lib/audioManager";

type Selection = { province: string; index: number } | null;

// Propuesta "Mapa del delito": el monitor de la sala con un chinche donde empieza cada caso (sin recorridos)
export default function MapaScreen() {
  const [selection, setSelection] = useState<Selection>(null);
  const pin = PROVINCE_PINS.find((p) => p.province === selection?.province) ?? null;

  const select = (province: string) => {
    audioManager.play("opencasefile");
    setSelection({ province, index: 0 });
  };
  const close = () => {
    audioManager.play("click");
    setSelection(null);
  };

  // Escape cierra la ficha
  useEffect(() => {
    if (!selection) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelection(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selection]);

  return (
    <div className={`relative ${GAME_BG} min-h-svh overflow-x-hidden px-3 sm:px-6 pt-16 pb-10 text-[#f5f5f0]`}>
      <GameBackdrop glow="56,189,248" />
      <CautionBar className="max-w-6xl" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-5 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-cyan-300">CENTRAL DE POLICÍA · SALA DE SITUACIÓN</p>
            <h1 className="mt-1 text-2xl sm:text-4xl text-white [text-shadow:0_0_18px_rgba(56,232,255,0.5)]">MAPA DEL DELITO</h1>
          </div>
          <p className="flex items-center gap-2 rounded border border-red-500/60 bg-red-950/60 px-3 py-2 text-[10px] sm:text-xs tracking-widest text-red-200 shadow-[0_0_14px_rgba(255,60,60,0.35)]">
            <span className={`${styles.blink} block size-2 rounded-full bg-red-500`} aria-hidden />
            {CASE_STORIES.length} CASOS ABIERTOS EN EL PAÍS
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div>
            <TacticalMap activeProvince={selection?.province ?? null} onSelect={select} />
            <p className="mt-3 text-center font-mono text-xs text-cyan-100/60">
              Cada chinche marca dónde empezó un caso. Lo que pasó después… lo averiguás jugando.
            </p>
          </div>

          <div className="lg:sticky lg:top-6">
            <CaseSheet
              pin={pin}
              index={selection?.index ?? 0}
              onPick={(index) => {
                audioManager.play("click");
                setSelection((s) => (s ? { ...s, index } : s));
              }}
              onClose={close}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
