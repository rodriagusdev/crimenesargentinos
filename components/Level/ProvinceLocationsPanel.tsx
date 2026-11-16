"use client";

import ILocation from "@/models/ILocation";
import { ICost } from "@/models/IGameData";
import { LocationPolaroidCard } from "../buttons/LocationPolaroidCard";
import { ProvinceDossierHeader } from "./ProvinceDossierHeader";
import { useT } from "@/hooks/useT";
import { levelProvinceLocationsMessages } from "./LevelProvinceLocations.messages";

// Rotación orgánica de polaroid (idéntico a los sospechosos)
const POLAROID_ROTATIONS = ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1.5deg]", "rotate-[2deg]"];

interface ProvinceLocationsPanelProps {
  provinceName: string;
  provinceId: string;
  locations: ILocation[];
  currentLocation: ILocation | undefined;
  currentLocationId: string | null | undefined;
  travelHours: Record<string, number> | undefined;
  locationCost: ICost | undefined;
  isTraveling: boolean;
  onHoverStart: (locationId: string) => void;
  onHoverCancel: () => void;
  onSelect: (location: ILocation) => void;
}

// Panel del expediente provincial: cabecera y grilla de polaroids de las locaciones a inspeccionar
export default function ProvinceLocationsPanel({
  provinceName,
  provinceId,
  locations,
  currentLocation,
  currentLocationId,
  travelHours,
  locationCost,
  isTraveling,
  onHoverStart,
  onHoverCancel,
  onSelect,
}: ProvinceLocationsPanelProps) {
  const t = useT(levelProvinceLocationsMessages);

  return (
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
          provinceName={provinceName}
          provinceId={provinceId}
          currentLocation={currentLocation}
        />

        {/* Encabezado de la lista de puntos */}
        <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs lg:text-[10px] uppercase tracking-wider text-[#FFF3C7]/70 mb-2 sm:mb-3 font-mono font-semibold">
          <span>{t("availablePoints")}</span>
          <span className="text-[10px] text-[#E1C380]/70 shrink-0">
            {t("destinations", { n: locations.length })}
          </span>
        </div>

        {/* Cuadrícula de fotos Polaroid de locaciones (idéntico estilo a sospechosos) */}
        <div className="sm:flex-1 sm:min-h-0 sm:overflow-y-auto overflow-x-hidden px-1.5 sm:px-3.5 pt-2.5 pb-3 [@media(max-height:500px)_and_(pointer:coarse)]:flex-1 [@media(max-height:500px)_and_(pointer:coarse)]:min-h-0 [@media(max-height:500px)_and_(pointer:coarse)]:overflow-y-auto">
          <div
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            // Las polaroids no exponen mouseleave: salir de una al hueco de la grilla (o de la grilla) cancela el hover
            onMouseOver={(e) => e.target === e.currentTarget && onHoverCancel()}
            onMouseLeave={onHoverCancel}
          >
            {locations.map((loc, idx) => {
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
                  disabled={isTraveling}
                  onMouseEnter={() => onHoverStart(loc.id)}
                  onClick={() => onSelect(loc)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
