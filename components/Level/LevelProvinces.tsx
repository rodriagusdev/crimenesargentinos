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

const TravelConfirmModal = dynamic(() => import("./TravelConfirmModal"), { ssr: false });
import { useShallow } from "zustand/react/shallow";

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
  const [selectedProvince, setSelectedProvince] = useState<IProvince | null>(null);
  const [travelingTo, setTravelingTo] = useState<IProvince | null>(null);
  const [travelFrom, setTravelFrom] = useState<IProvince | null>(null);
  const [traveling, setTraveling] = useState(false);
  const [travelError, setTravelError] = useState<string | null>(null);

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

  const currentProvince = data.provinces.find((p) => p.id === currentProvinceId);

  // El servidor cobra el viaje y mueve al jugador con animación de vuelo
  const handleConfirmTravel = async () => {
    if (!selectedProvince || traveling) return;
    const targetProvince = selectedProvince;
    const targetId = targetProvince.id;

    // Guardar origen antes de llamar al backend para que el cambio de currentProvinceId no sobreescriba el origen en la animación
    setTravelFrom(currentProvince ?? null);
    setTraveling(true);
    setTravelingTo(targetProvince);
    setTravelError(null);
    setSelectedProvince(null);

    try {
      // 1. Prefetch Next.js route in background
      router.prefetch(`/level/${levelId}/${targetId}`);

      // 2. Lanzar petición y PRECARGAR el paquete de la provincia de destino durante el vuelo de 1.6s
      const [result] = await Promise.all([
        travelProvince(targetId),
        preloadProvincePackage(targetId),
        new Promise((resolve) => setTimeout(resolve, 1600)),
      ]);

      router.push(`/level/${levelId}/${targetId}`);
    } catch (err) {
      setTravelingTo(null);
      setTravelFrom(null);
      setTravelError(err instanceof Error ? err.message : "No se pudo viajar a la provincia");
    } finally {
      setTraveling(false);
    }
  };

  return (
    <>
      {/* Animación de vuelo interprovincial */}
      {travelingTo && (
        <TravelAnimationOverlay
          fromProvince={travelFrom ?? currentProvince}
          toProvince={travelingTo}
        />
      )}


      <div className="absolute inset-0 z-10">
        {data.provinces.map((province) => {
          const isCurrent = province.id === currentProvinceId;
          return (
            <ProvinceButton
              key={province.id}
              label={province.name}
              top={province.top}
              left={province.left}
              icon={province.icon}
              isCurrent={isCurrent}
              onMouseEnter={() => preloadProvincePackage(province.id)}
              onClick={() => {
                if (traveling) return;
                setTravelError(null);
                // Volver a la provincia en la que ya está no cuesta nada: se entra directo, sin confirmar
                if (province.id === currentProvinceId) {
                  router.push(`/level/${levelId}/${province.id}`);
                  return;
                }
                setSelectedProvince(province);
              }}
            />
          );
        })}
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
          // Las horas dependen de la distancia a esa provincia; los PI son fijos
          cost={{ ...travelCost, time: (selectedProvince && travelHours?.[selectedProvince.id]) ?? travelCost.time }}
          currentResources={{ time: currentTime, pi: currentPI }}
          loading={traveling}
          onConfirm={handleConfirmTravel}
          onCancel={() => !traveling && setSelectedProvince(null)}
        />
      )}
    </>
  );
}
