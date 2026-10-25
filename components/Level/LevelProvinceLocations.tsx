"use client";

import Image from "next/image";
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
import GameButton from "../buttons/GameButton";

const TravelConfirmModal = dynamic(() => import("./TravelConfirmModal"), { ssr: false });
const TravelAnimationOverlay = dynamic(() => import("./TravelAnimationOverlay"), { ssr: false });
const SuspectProvinceWarning = dynamic(() => import("./SuspectProvinceWarning"), { ssr: false });

interface LevelDataProps {
  levelId: number;
  provinceId: string;
}

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

  const [data, SetData] = useState<ILevelLocations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(null);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const [travelingTo, setTravelingTo] = useState<ILocation | null>(null);
  const [travelFrom, setTravelFrom] = useState<{ id: string; name: string } | null>(null);
  const [traveling, setTraveling] = useState(false);
  const [travelError, setTravelError] = useState<string | null>(null);

  // Coordenadas tácticas para animación de patrullaje policial
  const LOCATION_COORDS = [
    { left: "34%", top: "42%" },
    { left: "60%", top: "34%" },
    { left: "45%", top: "68%" },
    { left: "66%", top: "58%" },
  ];

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

  // Precargar anticipadamente los recursos de la locación actual en segundo plano
  useEffect(() => {
    if (currentLocationId) {
      preloadLocationPackage(levelId, provinceId, currentLocationId);
    }
  }, [levelId, provinceId, currentLocationId]);

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

  const currentLocation = data?.locations.find((l) => l.id === currentLocationId);

  // El servidor cobra el traslado y mueve al jugador; recién después se navega con animación de patrulla
  const handleConfirmLocation = async () => {
    if (!selectedLocation || traveling) return;
    const targetLocation = selectedLocation;
    const targetId = targetLocation.id;

    setTravelFrom(currentLocation ?? null);
    setTraveling(true);
    setTravelingTo(targetLocation);
    setTravelError(null);
    setSelectedLocation(null);

    try {
      router.prefetch(`/level/${levelId}/${provinceId}/${targetId}`);
      await Promise.all([
        travelLocation(targetId),
        preloadLocationPackage(levelId, provinceId, targetId),
        new Promise((resolve) => setTimeout(resolve, 1400)),
      ]);
      router.push(`/level/${levelId}/${provinceId}/${targetId}`);
    } catch (err) {
      setTravelingTo(null);
      setTravelFrom(null);
      setTravelError(err instanceof Error ? err.message : "No se pudo ir a la locación");
    } finally {
      setTraveling(false);
    }
  };

  const handleSelectLocation = (loc: ILocation) => {
    if (traveling) return;
    audioManager.play("click");
    setTravelError(null);

    // Si ya está en la locación, reingresa inmediatamente sin costo
    if (loc.id === currentLocationId) {
      router.push(`/level/${levelId}/${provinceId}/${loc.id}`);
      return;
    }
    setSelectedLocation(loc);
  };

  const originLocation = travelFrom ?? currentLocation;
  const fromIndex = data?.locations.findIndex((l) => l.id === originLocation?.id) ?? -1;
  const toIndex = travelingTo ? (data?.locations.findIndex((l) => l.id === travelingTo.id) ?? -1) : -1;
  const fromCoord = LOCATION_COORDS[fromIndex >= 0 ? fromIndex % LOCATION_COORDS.length : 0];
  const toCoord = LOCATION_COORDS[toIndex >= 0 ? toIndex % LOCATION_COORDS.length : 1];

  return (
    <div className="relative w-screen h-screen flex flex-col bg-[#080e18] select-none overflow-hidden">
      {/* Animación táctica de patrullero policial entre locaciones */}
      {travelingTo && (
        <TravelAnimationOverlay
          mode="car"
          fromName={originLocation?.name ?? "Punto Operativo"}
          toName={travelingTo.name}
          fromCoord={fromCoord}
          toCoord={toCoord}
        />
      )}

      {/* Alerta si el sospechoso podría estar en esta provincia */}
      <SuspectProvinceWarning levelId={levelId} provinceName={data.name} provinceId={provinceId} />

      {/* ========================================================================= */}
      {/* ── BARRA SUPERIOR (IDÉNTICA A LOCATIONID / DIALOGBOX) ──                  */}
      {/* ========================================================================= */}
      <div className="relative z-20 p-4 md:p-6 flex items-center justify-end">
        <div className="flex flex-row gap-2 md:gap-4 flex-row-reverse">
          <GameButton
            icon=""
            label="VOLVER AL MAPA GENERAL"
            onClick={() => {
              if (traveling) return;
              audioManager.play("click");
              router.push(`/level/${levelId}`);
            }}
            variant="secondary"
            disabled={traveling}
          />

          <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-[#FFF3C7]">
            <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#E1C380] font-semibold font-mono">
              Sector Provincial
            </span>
          </div>
        </div>
      </div>

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
            <div className="flex flex-col mb-4 border-b border-[rgba(255,243,199,0.12)] pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#E1C380]/90 font-semibold">
                    POLICÍA FEDERAL // DEPARTAMENTO REGIONAL
                  </span>
                </div>
                <span className="text-[9px] font-mono text-cyan-300/80 border border-cyan-400/30 px-2 py-0.5 rounded-md">
                  ZONA ACTIVA
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black font-mono tracking-tight text-[#FFF3C7] mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {data.name}
              </h1>
              <p className="text-[10px] text-[#E1C380]/70 font-mono tracking-wider mt-0.5">
                EXPEDIENTE PROVINCIAL #{provinceId.slice(0, 8).toUpperCase()}
              </p>

              {/* Tarjeta destacada: Puesto Operativo Actual */}
              {currentLocation && (
                <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-[rgba(15,23,42,0.8)] border border-amber-400/50 shadow-inner flex items-center gap-3.5">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-amber-300/60 shrink-0 shadow-md">
                    <Image
                      src={currentLocation.imageUrl}
                      alt={currentLocation.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                        PUESTO OPERATIVO ACTUAL
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#FFF3C7] truncate font-mono mt-0.5">
                      {currentLocation.name}
                    </span>
                    <span className="text-[10px] text-[#E1C380]/80 font-mono">
                      Presencia de campo confirmada · Reingreso sin costo
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Encabezado de la lista de puntos */}
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#FFF3C7]/70 mb-3 font-mono font-semibold">
              <span>Puntos de Inspección Disponibles</span>
              <span className="text-[10px] text-[#E1C380]/70">
                {data.locations.length} DESTINOS
              </span>
            </div>

            {/* Cuadrícula de fotos Polaroid de locaciones (idéntico estilo a sospechosos) */}
            <div className="flex-1 overflow-y-auto pr-1 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.locations.map((loc, idx) => {
                  const isCurrent = loc.id === currentLocationId;
                  const isHovered = loc.id === hoveredLocationId;
                  const hours = travelHours?.[loc.id] ?? locationCost?.time ?? 1;

                  // Rotación orgánica de polaroid (idéntico a los sospechosos)
                  const rotations = ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1.5deg]", "rotate-[2deg]"];
                  const rotation = rotations[idx % rotations.length];

                  return (
                    <button
                      key={loc.id}
                      type="button"
                      disabled={traveling}
                      onMouseEnter={() => {
                        setHoveredLocationId(loc.id);
                        preloadLocationPackage(levelId, provinceId, loc.id);
                      }}
                      onMouseLeave={() => setHoveredLocationId(null)}
                      onClick={() => handleSelectLocation(loc)}
                      className={`
                        group relative flex flex-col justify-between p-2.5 sm:p-3 rounded-sm bg-[#faf8f5] text-zinc-900
                        shadow-[0_12px_28px_rgba(0,0,0,0.65)] select-none transition-all duration-200 cursor-pointer
                        hover:scale-105 hover:rotate-0 hover:z-20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)]
                        active:scale-95 text-left
                        ${rotation}
                        ${isCurrent
                          ? "ring-4 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                          : isHovered
                            ? "ring-2 ring-amber-400/80 shadow-[0_0_18px_rgba(245,158,11,0.3)]"
                            : "hover:ring-2 hover:ring-[#E1C380]"
                        }
                      `}
                    >
                      {/* Chincheta superior */}
                      <div
                        className={`
                          absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 shadow-md flex items-center justify-center z-20
                          ${isCurrent
                            ? "bg-amber-400 border-amber-100 ring-2 ring-amber-400/60 shadow-[0_0_10px_#f59e0b]"
                            : "bg-red-600 border-red-200 shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                          }
                        `}
                      >
                        <span className="w-1 h-1 rounded-full bg-white/80" />
                      </div>

                      {/* Foto Polaroid cuadrada */}
                      <div className="relative aspect-square w-full rounded-xs overflow-hidden bg-zinc-950 border border-zinc-300">
                        <Image
                          src={loc.imageUrl}
                          alt={loc.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 240px"
                          className="object-cover transition-transform duration-300 group-hover:scale-108"
                        />
                        {isCurrent && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-amber-400 text-[8px] font-mono font-black text-black uppercase tracking-wider shadow">
                            ACTUAL
                          </span>
                        )}
                      </div>

                      {/* Faldón blanco clásico de Polaroid con tipografía mecanografiada */}
                      <div className="flex flex-col items-center mt-2.5 w-full">
                        <h3 className="font-mono font-black text-xs sm:text-sm text-zinc-900 tracking-tight text-center truncate w-full">
                          {loc.name}
                        </h3>

                        <div className="mt-1 flex items-center justify-center">
                          {isCurrent ? (
                            <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-[9px] font-mono font-bold text-amber-900 tracking-wider">
                              📍 BASE ACTUAL
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-300 text-[9px] font-mono font-semibold text-zinc-700 tracking-wider flex items-center gap-1">
                              <span className="text-cyan-700 font-bold">⏱</span> {hours} HS
                            </span>
                          )}
                        </div>

                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1.5 opacity-70 group-hover:opacity-100 group-hover:text-amber-800 transition-opacity">
                          {isCurrent ? "REINGRESAR ➔" : "INSPECCIONAR ➔"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* PANEL IZQUIERDO: CUADRO ENMARCADO DEL MAPA PROVINCIAL (IDÉNTICO A ESCENA)*/}
        {/* ======================================================================= */}
        <div className="h-48 md:h-60 xl:h-auto xl:flex-[2] p-3 md:p-4 xl:p-6 backdrop-blur-xs flex items-center justify-center border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl shrink-0 xl:shrink">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Image
              src={data.backgroundUrl}
              alt={`Mapa provincia ${data.name}`}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 60vw"
              className="object-cover object-center"
            />
            {/* Viñeta sutil interior (idéntica a DialogBox) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080e18]/40 via-transparent to-transparent pointer-events-none" />
            {/* Gradiente inferior para profundidad y cinematografía */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#080e18]/90 via-[#080e18]/50 to-transparent pointer-events-none" />

            {/* Marca de agua cartográfica oficial en esquina inferior izquierda */}
            <div className="absolute bottom-4 left-5 flex flex-col pointer-events-none">
              <span className="text-[10px] font-mono tracking-widest text-[#E1C380]/80 uppercase font-semibold">
                CARTOGRAFÍA REGIONAL // {data.name.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-[#FFF3C7]/90 font-bold">
                SECTOR OPERATIVO #{provinceId.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notificación de error de viaje */}
      {travelError && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-2xl bg-red-950/90 border border-red-400/50 text-red-200 text-sm shadow-2xl">
          {travelError}
        </div>
      )}

      {/* Modal de confirmación para investigar una locación con foto del destino */}
      {locationCost && (
        <TravelConfirmModal
          isOpen={Boolean(selectedLocation)}
          title="¿Inspeccionar Locación?"
          destinationName={selectedLocation?.name ?? ""}
          destinationIcon={selectedLocation?.imageUrl}
          cost={{
            ...locationCost,
            time: (selectedLocation && travelHours?.[selectedLocation.id]) ?? locationCost.time,
          }}
          currentResources={{ time: currentTime, pi: currentPI }}
          loading={traveling}
          onConfirm={handleConfirmLocation}
          onCancel={() => !traveling && setSelectedLocation(null)}
        />
      )}
    </div>
  );
}