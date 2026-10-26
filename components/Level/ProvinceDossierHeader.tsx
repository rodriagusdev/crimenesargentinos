"use client";

import Image from "next/image";
import ILocation from "@/models/ILocation";

interface ProvinceDossierHeaderProps {
  provinceName: string;
  provinceId: string;
  currentLocation?: ILocation | null;
}

export function ProvinceDossierHeader({
  provinceName,
  provinceId,
  currentLocation,
}: ProvinceDossierHeaderProps) {
  return (
    <div className="flex flex-col mb-4 border-b border-[rgba(255,243,199,0.12)] pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#E1C380]/90 font-semibold">
            POLICÍA FEDERAL // DEPARTAMENTO REGIONAL
          </span>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-black font-mono tracking-tight text-[#FFF3C7] mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {provinceName}
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
  );
}
