"use client";

import Image from "next/image";
import GameButton from "../buttons/GameButton";
import { getLevelLocations } from "@/services/levelService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ILevelLocations from "@/models/ILevelLocations";

interface LevelDataProps {
  levelId: number;
  provinceId: number;
}

export default function LevelProvinceLocations({ levelId, provinceId }: LevelDataProps) {
  const router = useRouter();

  const [data, SetData] = useState<ILevelLocations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;

    async function loadLevel() {
      try {
        setLoading(true);
        setError(null);
        const data = await getLevelLocations(provinceId);
        if (!cancelled) {
          SetData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar el nivel",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLevel();

    return () => {
      cancelled = true;
    };
  }, [provinceId]);

  useEffect(() => {
    console.log("Data for:", data);
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#FFF3C7]">
        Cargando nivel {provinceId}...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        {error ?? "Nivel no encontrado"}
      </div>
    );
  }

  return (
    <>
      {/* Fondo del mapa */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={data.backgroundUrl}
          alt={`Fondo nivel ${provinceId}`}
          fill
          className="object-cover"
          priority
        />
        {/* Superposición oscura para legibilidad */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Barra de menú lateral que ocupa todo el alto */}
      <aside className="absolute right-0 top-0 bottom-0 w-80 bg-[#0f172a]/80 backdrop-blur-sm border-l border-[#1e293b] p-6 flex flex-col z-20">

        {/* Título del menú/provincia */}
        <div className="flex items-center justify-between mb-8 border-b border-[#334155] pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100">
              {data.name}
            </h1>
            <p className="text-xs text-amber-300/80 font-mono tracking-wider mt-0.5">
              PROVINCIA #{provinceId.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-4 font-semibold">
          Lugares de Interés
        </h2>

        {/* Lista de botones de ubicaciones */}
        <div className="flex-grow flex flex-col gap-3 overflow-y-auto pr-1">
          {data.locations.map((location) => (
            <GameButton
              key={location.id}
              icon={""}
              label={location.name}
              onClick={() => router.push(`/level/${levelId}/${provinceId}/${location.id}`)}
            />
          ))}
        </div>

        <button
          onClick={() => router.push(`/level/${levelId}`)}
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
          Volver al mapa
        </button>
      </aside>
    </>
  );
}