"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLevelProvinces } from "@/services/levelService";
import ILevelDataProvinces from "@/models/ILevelDataProvinces";
import { ProvinceButton } from "../buttons/ProvinceButton";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { gameData } from "@/data/gameData";
import IProvince from "@/models/IProvince";
import TravelConfirmModal from "./TravelConfirmModal";

interface LevelDataProps {
  levelId: number;
}

export default function LevelProvinces({ levelId }: LevelDataProps) {
  const router = useRouter();
  const consumeTravelProvince = useGameSessionStore(
    (state) => state.consumeTravelProvince
  );
  const currentTime = useGameSessionStore((state) => state.currentTime);
  const currentPI = useGameSessionStore((state) => state.currentPI);

  const [data, setData] = useState<ILevelDataProvinces | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<IProvince | null>(null);

  const travelCost = gameData.find((g) => g.levelId === levelId)?.costs.travelProvince ?? { time: 12, pi: 5 };

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

  const handleConfirmTravel = () => {
    if (!selectedProvince) return;
    consumeTravelProvince(levelId);
    const targetId = selectedProvince.id;
    setSelectedProvince(null);
    router.push(`/level/${levelId}/${targetId}`);
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
            onClick={() => setSelectedProvince(province)}
          />
        ))}
      </div>

      {/* Modal de confirmación de viaje entre provincias */}
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
    </>
  );
}
