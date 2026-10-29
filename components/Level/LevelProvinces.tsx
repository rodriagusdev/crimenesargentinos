"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLevelProvinces } from "@/services/levelService";
import ILevelDataProvinces from "@/models/ILevelDataProvinces";
import { ProvinceButton } from "../buttons/ProvinceButton";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useGameSession } from "@/hooks/useGameSession";
import IProvince from "@/models/IProvince";
import dynamic from "next/dynamic";
import { preloadProvincePackage } from "@/lib/assetPreloader";
import { useShallow } from "zustand/react/shallow";
import { useTravelFlow } from "@/hooks/useTravelFlow";
import { getCalibratedProvinceCoordinates, monitorCoordToScreen } from "@/lib/mapCalibration";

const TravelConfirmModal = dynamic(() => import("./TravelConfirmModal"), { ssr: false });
const TravelAnimationOverlay = dynamic(() => import("./TravelAnimationOverlay"), { ssr: false });

interface LevelDataProps {
  levelId: number;
}

export default function LevelProvinces({ levelId }: LevelDataProps) {
  const router = useRouter();
  useGameSession(levelId);

  const { travelProvince, currentProvinceId, currentTime, currentPI, travelCost, travelHours } =
    useGameSessionStore(
      useShallow((state) => ({
        travelProvince: state.travelProvince,
        currentProvinceId: state.session?.currentProvinceId,
        currentTime: state.currentTime,
        currentPI: state.currentPI,
        travelCost: state.costs?.travelProvince,
        travelHours: state.session?.travelHours,
      }))
    );

  const [data, setData] = useState<ILevelDataProvinces | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const currentProvince = data?.provinces.find((p) => p.id === currentProvinceId);

  const travel = useTravelFlow<IProvince>({
    current: currentProvince,
    currentId: currentProvinceId,
    onTravel: (prov) => travelProvince(prov.id),
    onPreload: (prov) => preloadProvincePackage(prov.id),
    getRoute: (prov) => `/level/${levelId}/${prov.id}`,
    durationMs: 1600,
    errorMessageFallback: "No se pudo viajar a la provincia",
  });

  if (loading) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center text-[#FFF3C7]">
        Cargando ...
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

  return (
    <>
      {/* Animación de vuelo interprovincial */}
      {travel.travelingTo && (
        <TravelAnimationOverlay
          fromProvince={travel.travelFrom ?? currentProvince}
          toProvince={travel.travelingTo}
          fromCoord={monitorCoordToScreen(travel.travelFrom ?? currentProvince)}
          toCoord={monitorCoordToScreen(travel.travelingTo)}
        />
      )}


      <div className="absolute inset-0 z-10">
        {data.provinces.map((province) => {
          const isCurrent = province.id === currentProvinceId;
          const coords = getCalibratedProvinceCoordinates(province);
          return (
            <ProvinceButton
              key={province.id}
              label={province.name}
              top={coords.top}
              left={coords.left}
              icon={province.icon}
              isCurrent={isCurrent}
              onMouseEnter={() => preloadProvincePackage(province.id)}
              onClick={() => travel.select(province)}
            />
          );
        })}
      </div>

      {travel.error && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-2xl bg-red-950/80 border border-red-400/40 text-red-200 text-sm">
          {travel.error}
        </div>
      )}

      {/* Modal de confirmación de viaje entre provincias */}
      {travelCost && (
        <TravelConfirmModal
          isOpen={Boolean(travel.selected)}
          title="¿Viajar a otra Provincia?"
          destinationName={travel.selected?.name ?? ""}
          destinationIcon={travel.selected?.icon}
          // Las horas dependen de la distancia a esa provincia; los PI son fijos
          cost={{ ...travelCost, time: (travel.selected && travelHours?.[travel.selected.id]) ?? travelCost.time }}
          currentResources={{ time: currentTime, pi: currentPI }}
          loading={travel.isTraveling}
          onConfirm={travel.confirm}
          onCancel={() => !travel.isTraveling && travel.cancel()}
        />
      )}
    </>
  );
}
