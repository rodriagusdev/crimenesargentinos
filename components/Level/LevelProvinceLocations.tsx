"use client";

import Image from "next/image";
import GameButton from "../buttons/GameButton";
import { getLevelLocations } from "@/services/levelService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ILevelLocations from "@/models/ILevelLocations";
import ILocation from "@/models/ILocation";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useGameSession } from "@/hooks/useGameSession";
import TravelConfirmModal from "./TravelConfirmModal";

interface LevelDataProps {
  levelId: number;
  provinceId: string;
}

export default function LevelProvinceLocations({ levelId, provinceId }: LevelDataProps) {
  const router = useRouter();
  // Si el jugador no está en esta provincia, se lo redirige a donde quedó
  const { ready, error: sessionError } = useGameSession(levelId, { provinceId });
  const travelLocation = useGameSessionStore((state) => state.travelLocation);
  const currentTime = useGameSessionStore((state) => state.currentTime);
  const currentPI = useGameSessionStore((state) => state.currentPI);

  const [data, SetData] = useState<ILevelLocations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(null);
  const [traveling, setTraveling] = useState(false);
  const [travelError, setTravelError] = useState<string | null>(null);

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

  if (loading || (!ready && !sessionError)) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#FFF3C7]">
        Cargando provincia...
      </div>
    );
  }

  if (error || sessionError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        {error ?? sessionError ?? "Nivel no encontrado"}
      </div>
    );
  }

  // El servidor cobra el traslado y mueve al jugador; recién después se navega
  const handleConfirmLocation = async () => {
    if (!selectedLocation || traveling) return;
    const targetId = selectedLocation.id;

    setTraveling(true);
    setTravelError(null);
    try {
      await travelLocation(targetId);
      setSelectedLocation(null);
      router.push(`/level/${levelId}/${provinceId}/${targetId}`);
    } catch (err) {
      setSelectedLocation(null);
      setTravelError(err instanceof Error ? err.message : "No se pudo ir a la locación");
    } finally {
      setTraveling(false);
    }
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
              onClick={() => {
                setTravelError(null);
                setSelectedLocation(location);
              }}
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

      {travelError && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-2xl bg-red-950/80 border border-red-400/40 text-red-200 text-sm">
          {travelError}
        </div>
      )}

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