"use client";

import Image from "next/image";
import GameButton from "../buttons/GameButton";
import { getLevelLocations } from "@/services/levelService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ILevelLocations from "@/models/ILevelLocations";
import ILocation from "@/models/ILocation";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import TravelConfirmModal from "./TravelConfirmModal";

interface LevelDataProps {
  levelId: number;
  provinceId: string;
}

export default function LevelProvinceLocations({ levelId, provinceId }: LevelDataProps) {
  const router = useRouter();
  const consumeTravelLocation = useGameSessionStore(
    (state) => state.consumeTravelLocation
  );
  const currentTime = useGameSessionStore((state) => state.currentTime);
  const currentPI = useGameSessionStore((state) => state.currentPI);

  const [data, SetData] = useState<ILevelLocations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(null);

  const locationCost = useGameSessionStore((state) => state.costs?.travelLocation);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#FFF3C7]">
        Cargando provincia...
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

  const handleConfirmLocation = () => {
    if (!selectedLocation) return;
    consumeTravelLocation();
    const targetId = selectedLocation.id;
    setSelectedLocation(null);
    router.push(`/level/${levelId}/${provinceId}/${targetId}`);
  };

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

      {/* Barra de menú lateral con glassmorfismo */}
      <aside className="mt-4 mr-6 rounded-2xl absolute right-0 top-0 bottom-4 w-80 backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 flex flex-col z-20 text-[#FFF3C7] overflow-hidden">

        {/* Título del menú/provincia */}
        <div className="flex items-center justify-between mb-6 border-b border-[rgba(255,243,199,0.12)] pb-4">
          <div>
            <h1 className="text-xl font-bold text-[#FFF3C7]">
              {data.name}
            </h1>
            <p className="text-xs text-[#E1C380]/80 font-mono tracking-wider mt-0.5">
              PROVINCIA #{provinceId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <h2 className="text-xs uppercase tracking-wider text-[#FFF3C7]/60 mb-4 font-semibold">
          Lugares de Interés
        </h2>

        {/* Lista de botones de ubicaciones */}
        <div className="flex-grow flex flex-col gap-3 overflow-y-auto pt-4">
          {data.locations.map((location) => (
            <GameButton
              key={location.id}
              icon={""}
              label={location.name}
              onClick={() => setSelectedLocation(location)}
            />
          ))}
        </div>

        <div className="mt-auto w-full">
          <GameButton
            icon="🗺️"
            label="VOLVER AL MAPA DE ARGENTINA"
            variant="secondary"
            onClick={() => router.push(`/level/${levelId}`)}
          />
        </div>
      </aside>

      {/* Modal de confirmación para investigar una locación */}
      {locationCost && (
        <TravelConfirmModal
          isOpen={Boolean(selectedLocation)}
          title="¿Inspeccionar Locación?"
          destinationName={selectedLocation?.name ?? ""}
          cost={locationCost}
          currentResources={{ time: currentTime, pi: currentPI }}
          onConfirm={handleConfirmLocation}
          onCancel={() => setSelectedLocation(null)}
        />
      )}
    </>
  );
}