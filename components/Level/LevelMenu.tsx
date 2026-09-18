"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTypewriterSound } from "@/hooks/useTypewriterSound";
import IMenuAction from "@/models/IMenuAction";
import { MENU_ACTIONS } from "@/data/menuActions";
import IInfoPerLevel from "@/models/IInfoPerLevel";
import { getInfoPerLevel } from "@/services/levelService";

import GameButton from "../buttons/GameButton";

interface LevelMenuProps {
  levelId: number;
}

export default function LevelMenu({ levelId }: LevelMenuProps) {
  const router = useRouter();
  const playTypewriter = useTypewriterSound();
  const [activeModal, setActiveModal] = useState<IMenuAction | null>(null);
  const [info, setInfo] = useState<IInfoPerLevel | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const infoData = await getInfoPerLevel(levelId);
        setInfo(infoData);
      } catch (error) {
        console.error("Error fetching level data:", error);
      }
    };

    fetchData();
  }, [levelId]);

  return (
    <>
      <aside className="mt-4 mr-6 rounded-2xl z-100 absolute right-0 top-0 w-80 bg-[rgba(20,30,42,0.92)] backdrop-blur-[14px] border-l border-[rgba(255,243,199,0.12)] z-20 text-[#FFF3C7] overflow-hidden">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-[rgba(255,243,199,0.12)] hover:bg-[rgba(255,243,199,0.04)] transition-colors duration-200 cursor-pointer"
        >
          <div>
            <h1 className="text-md font-bold text-[#FFF3C7] text-left">Investigación</h1>
            <p className="text-xs text-[#E1C380]/80 font-mono tracking-wider mt-0.5">
              NIVEL #{levelId.toString().padStart(2, "00")}
            </p>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`size-4 text-[#E1C380]/60 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="px-6 pt-4 pb-6 flex flex-col gap-4">

            <h2 className="text-xs uppercase tracking-wider text-[#FFF3C7]/60 font-semibold">
              Expediente del Caso
            </h2>

            {/* Informe del caso */}
            <div className="rounded-xl border border-[#E1C380]/20 bg-[rgba(255,243,199,0.05)] p-4 shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3.5 text-[#E1C380] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs uppercase tracking-wider text-[#E1C380]/80 font-mono font-semibold">
                  Informe del caso
                </span>
              </div>
              {info ? (
                <p className="text-xs text-[#FFF3C7]/90 leading-relaxed font-mono">
                  {info.info}
                </p>
              ) : (
                <div className="space-y-1.5 animate-pulse">
                  <div className="h-2.5 bg-[rgba(255,243,199,0.15)] rounded w-full" />
                  <div className="h-2.5 bg-[rgba(255,243,199,0.15)] rounded w-4/5" />
                  <div className="h-2.5 bg-[rgba(255,243,199,0.15)] rounded w-3/5" />
                </div>
              )}
            </div>

            {/* Lista de acciones */}
            <div className="flex flex-row gap-3 justify-center">
              {MENU_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setActiveModal(action)}
                  onMouseEnter={playTypewriter}
                  className="w-16 p-1 rounded-xl bg-[rgba(255,243,199,0.07)] hover:bg-[rgba(255,243,199,0.12)] border border-[rgba(255,243,199,0.12)] hover:border-[#E1C380]/50 transition-all duration-200 flex items-center group shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[rgba(255,243,199,0.15)] bg-black/40 shrink-0">
                    <Image
                      src={action.icon}
                      alt={action.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>
      </aside>

      {/* Modal interactivo al pulsar una acción PLACEHOLDER*/}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[rgba(20,30,42,0.95)] border border-[rgba(255,243,199,0.15)] rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center text-[#FFF3C7]">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-[#E1C380]/40 mb-4 shadow-lg bg-black/50">
              <Image
                src={activeModal.icon}
                alt={activeModal.title}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-xl font-bold text-[#FFF3C7] mb-1">
              {activeModal.title}
            </h3>
            <p className="text-xs uppercase tracking-widest text-[#E1C380]/80 font-mono mb-3">
              CASO #{levelId.toString().padStart(2, "0")}
            </p>

            <p className="text-sm text-[#FFF3C7]/90 leading-relaxed mb-6 bg-[rgba(255,243,199,0.05)] p-4 rounded-xl border border-[rgba(255,243,199,0.1)]">
              {activeModal.detail}
            </p>

            <div className="w-full">
              <GameButton
                icon="✕"
                label="CERRAR EXPEDIENTE"
                variant="secondary"
                onClick={() => setActiveModal(null)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
