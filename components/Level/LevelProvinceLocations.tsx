"use client";

import { getLevelLocations } from "@/services/levelService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ILevelLocations from "@/models/ILevelLocations";
import ILocation from "@/models/ILocation";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useGameSession } from "@/hooks/useGameSession";
import dynamic from "next/dynamic";
import { preloadLocationPackage } from "@/lib/assetPreloader";
import { useShallow } from "zustand/react/shallow";
import { audioManager } from "@/lib/audioManager";
import { LevelScreenTopBar } from "./LevelScreenTopBar";
import { LocationPolaroidCard } from "../buttons/LocationPolaroidCard";
import { ProvinceDossierHeader } from "./ProvinceDossierHeader";
import { ProvinceMapFrame } from "./ProvinceMapFrame";
import { useTravelFlow } from "@/hooks/useTravelFlow";

const TravelConfirmModal = dynamic(() => import("./TravelConfirmModal"), { ssr: false });
const TravelAnimationOverlay = dynamic(() => import("./TravelAnimationOverlay"), { ssr: false });
const SuspectProvinceWarning = dynamic(() => import("./SuspectProvinceWarning"), { ssr: false });

interface LevelDataProps {
  levelId: number;
  provinceId: string;
}

// Puntos de origen/destino de la animación del patrullero (ya no hay pines en el mapa)
const PATROL_WAYPOINTS = [
  { left: "34%", top: "42%" },
  { left: "60%", top: "34%" },
  { left: "45%", top: "68%" },
  { left: "66%", top: "58%" },
];

// Rotación orgánica de polaroid (idéntico a los sospechosos)
const POLAROID_ROTATIONS = ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1.5deg]", "rotate-[2deg]"];

export default function LevelProvinceLocations({ levelId, provinceId }: LevelDataProps) {
  const router = useRouter();
  // Si el jugador no está en esta provincia, se lo redirige a donde quedó
  const { ready, error: sessionError } = useGameSession(levelId, { provinceId });

  const { travelLocation, currentLocationId, currentTime, currentPI, locationCost, travelHours } =
    useGameSessionStore(
      useShallow((state) => ({
        travelLocation: state.travelLocation,
        currentLocationId: state.session?.currentLocationId,
        currentTime: state.currentTime,
        currentPI: state.currentPI,
        locationCost: state.costs?.travelLocation,
        travelHours: state.session?.travelHours,
      }))
    );

  const [data, setData] = useState<ILevelLocations | null>(null);
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
          setData(data);
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

  // Precargar anticipadamente los recursos de la locación actual en segundo plano
  useEffect(() => {
    if (currentLocationId) {
      preloadLocationPackage(levelId, provinceId, currentLocationId);
    }
  }, [levelId, provinceId, currentLocationId]);

  const currentLocation = data?.locations.find((l) => l.id === currentLocationId);

  const travel = useTravelFlow<ILocation>({
    current: currentLocation,
    currentId: currentLocationId,
    onTravel: (loc) => travelLocation(loc.id),
    onPreload: (loc) => preloadLocationPackage(levelId, provinceId, loc.id),
    getRoute: (loc) => `/level/${levelId}/${provinceId}/${loc.id}`,
    durationMs: 1400,
    errorMessageFallback: "No se pudo ir a la locación",
    onBeforeSelect: () => audioManager.play("click"),
  });

  if (loading || (!ready && !sessionError)) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#FFF3C7] font-mono tracking-wider bg-[#080e18]">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-3" />
        Accediendo a la red policial provincial...
      </div>
    );
  }

  if (error || sessionError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400 font-mono bg-[#080e18]">
        {error ?? sessionError ?? "Provincia no encontrada"}
      </div>
    );
  }

  const originLocation = travel.travelFrom ?? currentLocation;
  const fromIndex = data.locations.findIndex((l) => l.id === originLocation?.id);
  const toIndex = travel.travelingTo ? data.locations.findIndex((l) => l.id === travel.travelingTo?.id) : -1;
  const fromCoord = PATROL_WAYPOINTS[fromIndex >= 0 ? fromIndex % PATROL_WAYPOINTS.length : 0];
  const toCoord = PATROL_WAYPOINTS[toIndex >= 0 ? toIndex % PATROL_WAYPOINTS.length : 1];

  return (
    <div className="relative w-screen h-screen flex flex-col bg-[#080e18] select-none overflow-hidden">
      {/* Animación táctica de patrullero policial entre locaciones */}
      {travel.travelingTo && (
        <TravelAnimationOverlay
          mode="car"
          fromName={originLocation?.name ?? "Punto Operativo"}
          toName={travel.travelingTo.name}
          fromCoord={fromCoord}
          toCoord={toCoord}
        />
      )}

      {/* Alerta si el sospechoso podría estar en esta provincia */}
      <SuspectProvinceWarning levelId={levelId} provinceName={data.name} provinceId={provinceId} />

      <LevelScreenTopBar
        label="VOLVER AL MAPA GENERAL"
        badgeText="Sector Provincial"
        onBack={() => {
          if (travel.isTraveling) return;
          audioManager.play("click");
          router.push(`/level/${levelId}`);
        }}
        disabled={travel.isTraveling}
      />

      {/* ========================================================================= */}
      {/* ── ÁREA DE CONTENIDO (DISTRIBUCIÓN 2 PANELES COMPARTIDA CON LOCATIONID) ── */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col-reverse xl:flex-row-reverse min-h-0 px-4 md:px-6 pb-4 md:pb-6 gap-4 md:gap-6">
        {/* ======================================================================= */}
        {/* PANEL DERECHO: MENÚ DE EXPEDIENTE / LUGARES DE INTERÉS                   */}
        {/* ======================================================================= */}
        <div className="flex-1 flex items-center justify-center min-h-0 w-full xl:flex-1">
          <div
            className="
              relative z-10 w-full max-w-4xl xl:max-w-2xl h-full flex flex-col
              backdrop-blur-xs
              border border-[rgba(255,243,199,0.18)]
              shadow-[0_20px_50px_rgba(0,0,0,0.6)]
              rounded-2xl
              overflow-hidden
              text-[#FFF3C7]
              bg-[rgba(16,24,36,0.85)]
              p-4 md:p-6
            "
          >
            {/* Cabecera del expediente provincial */}
            <ProvinceDossierHeader
              provinceName={data.name}
              provinceId={provinceId}
              currentLocation={currentLocation}
            />

            {/* Encabezado de la lista de puntos */}
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#FFF3C7]/70 mb-3 font-mono font-semibold">
              <span>Puntos de Inspección Disponibles</span>
              <span className="text-[10px] text-[#E1C380]/70">
                {data.locations.length} DESTINOS
              </span>
            </div>

            {/* Cuadrícula de fotos Polaroid de locaciones (idéntico estilo a sospechosos) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.locations.map((loc, idx) => {
                  const isCurrent = loc.id === currentLocationId;
                  const hours = travelHours?.[loc.id] ?? locationCost?.time ?? 1;
                  const rotation = POLAROID_ROTATIONS[idx % POLAROID_ROTATIONS.length];

                  return (
                    <LocationPolaroidCard
                      key={loc.id}
                      location={loc}
                      isCurrent={isCurrent}
                      hours={hours}
                      rotation={rotation}
                      disabled={travel.isTraveling}
                      onMouseEnter={() => preloadLocationPackage(levelId, provinceId, loc.id)}
                      onClick={() => travel.select(loc)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* PANEL IZQUIERDO: CUADRO ENMARCADO DEL MAPA PROVINCIAL (IDÉNTICO A ESCENA)*/}
        {/* ======================================================================= */}
        <ProvinceMapFrame
          backgroundUrl={data.backgroundUrl}
          provinceName={data.name}
          provinceId={provinceId}
        />
      </div>

      {/* Notificación de error de viaje */}
      {travel.error && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-2xl bg-red-950/90 border border-red-400/50 text-red-200 text-sm shadow-2xl">
          {travel.error}
        </div>
      )}

      {/* Modal de confirmación para investigar una locación con foto del destino */}
      {locationCost && (
        <TravelConfirmModal
          isOpen={Boolean(travel.selected)}
          title="¿Inspeccionar Locación?"
          destinationName={travel.selected?.name ?? ""}
          destinationIcon={travel.selected?.imageUrl}
          cost={{
            ...locationCost,
            time: (travel.selected && travelHours?.[travel.selected.id]) ?? locationCost.time,
          }}
          currentResources={{ time: currentTime, pi: currentPI }}
          loading={travel.isTraveling}
          onConfirm={travel.confirm}
          onCancel={() => !travel.isTraveling && travel.cancel()}
        />
      )}
    </div>
  );
}