"use client";

import { getCaseLocations } from "@/services/levelService";
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
import { useHoverIntent } from "@/hooks/useHoverIntent";
import { useT } from "@/hooks/useT";
import { levelProvinceLocationsMessages } from "./LevelProvinceLocations.messages";

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
  const t = useT(levelProvinceLocationsMessages);
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
        const data = await getCaseLocations(levelId, provinceId);
        if (!cancelled) {
          setData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : t("loadError"),
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
  }, [levelId, provinceId, t]);

  // Precargar anticipadamente el diálogo de la locación actual (las imágenes las precarga la sesión)
  useEffect(() => {
    if (currentLocationId) {
      preloadLocationPackage(levelId, provinceId, currentLocationId, { images: false });
    }
  }, [levelId, provinceId, currentLocationId]);

  // Hover sostenido sobre una polaroid: se adelanta solo el diálogo (las imágenes las precarga travelLocation)
  const hoverPreload = useHoverIntent((locationId: string) =>
    preloadLocationPackage(levelId, provinceId, locationId, { images: false })
  );

  const currentLocation = data?.locations.find((l) => l.id === currentLocationId);

  const travel = useTravelFlow<ILocation>({
    current: currentLocation,
    currentId: currentLocationId,
    onTravel: (loc) => travelLocation(loc.id),
    getRoute: (loc) => `/level/${levelId}/${provinceId}/${loc.id}`,
    durationMs: 1400,
    errorMessageFallback: t("travelError"),
    onBeforeSelect: () => audioManager.play("click"),
  });

  if (loading || (!ready && !sessionError)) {
    return (
      <div className="flex items-center justify-center min-h-dvh px-4 text-center text-xs sm:text-base text-[#FFF3C7] font-mono tracking-wider bg-[#080e18]">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-3" />
        {t("loading")}
      </div>
    );
  }

  if (error || sessionError || !data) {
    return (
      <div className="flex items-center justify-center min-h-dvh px-4 text-center text-xs sm:text-base text-red-400 font-mono bg-[#080e18]">
        {error ?? sessionError ?? t("notFound")}
      </div>
    );
  }

  const originLocation = travel.travelFrom ?? currentLocation;
  const fromIndex = data.locations.findIndex((l) => l.id === originLocation?.id);
  const toIndex = travel.travelingTo ? data.locations.findIndex((l) => l.id === travel.travelingTo?.id) : -1;
  const fromCoord = PATROL_WAYPOINTS[fromIndex >= 0 ? fromIndex % PATROL_WAYPOINTS.length : 0];
  const toCoord = PATROL_WAYPOINTS[toIndex >= 0 ? toIndex % PATROL_WAYPOINTS.length : 1];

  // En celular vertical la pantalla scrollea entera: con paneles de alto fijo la lista de locaciones quedaba sin lugar.
  // no-desktop-zoom: en escritorio se ve a tamaño completo (ya estaba ajustada antes del achique global)
  return (
    <div className="no-desktop-zoom relative w-full sm:w-screen min-h-dvh sm:h-dvh flex flex-col bg-[#080e18] select-none overflow-x-hidden sm:overflow-hidden [@media(max-height:500px)_and_(pointer:coarse)]:h-dvh [@media(max-height:500px)_and_(pointer:coarse)]:overflow-hidden">
      {/* Animación táctica de patrullero policial entre locaciones */}
      {travel.travelingTo && (
        <TravelAnimationOverlay
          mode="car"
          fromName={originLocation?.name ?? t("originFallback")}
          toName={travel.travelingTo.name}
          fromCoord={fromCoord}
          toCoord={toCoord}
        />
      )}

      {/* Alerta si el sospechoso podría estar en esta provincia */}
      <SuspectProvinceWarning key={provinceId} provinceName={data.name} provinceId={provinceId} />

      {/* En celular la barra baja por debajo del menú de investigación (igual que DialogBox) */}
      <div className="shrink-0 pt-[68px] md:pt-0">
        <LevelScreenTopBar
          label={t("backToMap")}
          badgeText={t("sector")}
          onBack={() => {
            if (travel.isTraveling) return;
            audioManager.play("click");
            router.push(`/level/${levelId}`);
          }}
          disabled={travel.isTraveling}
        />
      </div>

      {/* ========================================================================= */}
      {/* ── ÁREA DE CONTENIDO (DISTRIBUCIÓN 2 PANELES COMPARTIDA CON LOCATIONID) ── */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col-reverse xl:flex-row-reverse min-h-0 px-3 sm:px-4 md:px-6 pb-32 sm:pb-4 md:pb-6 gap-3 sm:gap-4 md:gap-6 [@media(max-height:500px)_and_(pointer:coarse)]:flex-row-reverse [@media(max-height:500px)_and_(pointer:coarse)]:px-3 [@media(max-height:500px)_and_(pointer:coarse)]:pb-3 [@media(max-height:500px)_and_(pointer:coarse)]:gap-3">
        {/* ======================================================================= */}
        {/* PANEL DERECHO: MENÚ DE EXPEDIENTE / LUGARES DE INTERÉS                   */}
        {/* ======================================================================= */}
        <div className="flex-1 flex items-center justify-center min-h-0 min-w-0 w-full xl:flex-1">
          <div
            className="
              relative z-10 w-full max-w-4xl xl:max-w-2xl sm:h-full [@media(max-height:500px)_and_(pointer:coarse)]:h-full flex flex-col
              backdrop-blur-xs
              border border-[rgba(255,243,199,0.18)]
              shadow-[0_20px_50px_rgba(0,0,0,0.6)]
              rounded-2xl
              overflow-hidden
              text-[#FFF3C7]
              bg-[rgba(16,24,36,0.85)]
              p-3 sm:p-4 md:p-6 [@media(max-height:500px)_and_(pointer:coarse)]:p-3
            "
          >
            {/* Cabecera del expediente provincial */}
            <ProvinceDossierHeader
              provinceName={data.name}
              provinceId={provinceId}
              currentLocation={currentLocation}
            />

            {/* Encabezado de la lista de puntos */}
            <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs lg:text-[10px] uppercase tracking-wider text-[#FFF3C7]/70 mb-2 sm:mb-3 font-mono font-semibold">
              <span>{t("availablePoints")}</span>
              <span className="text-[10px] text-[#E1C380]/70 shrink-0">
                {t("destinations", { n: data.locations.length })}
              </span>
            </div>

            {/* Cuadrícula de fotos Polaroid de locaciones (idéntico estilo a sospechosos) */}
            <div className="sm:flex-1 sm:min-h-0 sm:overflow-y-auto overflow-x-hidden px-1.5 sm:px-3.5 pt-2.5 pb-3 [@media(max-height:500px)_and_(pointer:coarse)]:flex-1 [@media(max-height:500px)_and_(pointer:coarse)]:min-h-0 [@media(max-height:500px)_and_(pointer:coarse)]:overflow-y-auto">
              <div
                className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                // Las polaroids no exponen mouseleave: salir de una al hueco de la grilla (o de la grilla) cancela el hover
                onMouseOver={(e) => e.target === e.currentTarget && hoverPreload.cancel()}
                onMouseLeave={hoverPreload.cancel}
              >
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
                      onMouseEnter={() => hoverPreload.start(loc.id)}
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-max max-w-[calc(100vw-2rem)] text-center px-5 py-3 rounded-2xl bg-red-950/90 border border-red-400/50 text-red-200 text-xs sm:text-sm shadow-2xl">
          {travel.error}
        </div>
      )}

      {/* Modal de confirmación para investigar una locación con foto del destino */}
      {locationCost && (
        <TravelConfirmModal
          isOpen={Boolean(travel.selected)}
          title={t("confirmTitle")}
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