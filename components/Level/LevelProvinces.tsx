"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLevelProvinces } from "@/services/levelService";
import ILevelDataProvinces from "@/models/ILevelDataProvinces";
import { ProvinceButton } from "../buttons/ProvinceButton";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useGameSession } from "@/hooks/useGameSession";
import IProvince from "@/models/IProvince";
import TravelConfirmModal from "./TravelConfirmModal";

interface LevelDataProps {
  levelId: number;
}

export default function LevelProvinces({ levelId }: LevelDataProps) {
  const router = useRouter();
  useGameSession(levelId);
  const travelProvince = useGameSessionStore((state) => state.travelProvince);
  const currentTime = useGameSessionStore((state) => state.currentTime);
  const currentPI = useGameSessionStore((state) => state.currentPI);

  const [data, setData] = useState<ILevelDataProvinces | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<IProvince | null>(null);
  const [traveling, setTraveling] = useState(false);
  const [travelError, setTravelError] = useState<string | null>(null);

  const travelCost = useGameSessionStore((state) => state.costs?.travelProvince);

  useEffect(() => {
    let cancelled = false;

    async function loadLevel() {
      try {
        setLoading(true);
        setError(null);
        const result = await getLevelProvinces(levelId);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar el nivel",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLevel();
    return () => {
      cancelled = true;
    };
  }, [levelId]);

  if (loading) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center text-[#FFF3C7]">
        Cargando nivel {levelId}...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center text-red-400">
        {error ?? "Nivel no encontrado"}
      </div>
    );
  }

  // El servidor cobra el viaje y mueve al jugador; recién después se navega
  const handleConfirmTravel = async () => {
    if (!selectedProvince || traveling) return;
    const targetId = selectedProvince.id;

    setTraveling(true);
    setTravelError(null);
    try {
      await travelProvince(targetId);
      setSelectedProvince(null);
      router.push(`/level/${levelId}/${targetId}`);
    } catch (err) {
      setSelectedProvince(null);
      setTravelError(err instanceof Error ? err.message : "No se pudo viajar a la provincia");
    } finally {
      setTraveling(false);
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-10">
        {data.provinces.map((province) => (
          <ProvinceButton
            key={province.id}
            label={province.name}
            top={province.top}
            left={province.left}
            icon={province.icon}
            onClick={() => {
              setTravelError(null);
              setSelectedProvince(province);
            }}
          />
        ))}
      </div>

      {travelError && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-2xl bg-red-950/80 border border-red-400/40 text-red-200 text-sm">
          {travelError}
        </div>
      )}

      {/* Modal de confirmación de viaje entre provincias */}
      {travelCost && (
        <TravelConfirmModal
          isOpen={Boolean(selectedProvince)}
          title="¿Viajar a otra Provincia?"
          destinationName={selectedProvince?.name ?? ""}
          destinationIcon={selectedProvince?.icon}
          cost={travelCost}
          currentResources={{ time: currentTime, pi: currentPI }}
          onConfirm={handleConfirmTravel}
          onCancel={() => setSelectedProvince(null)}
        />
      )}
    </>
  );
}
