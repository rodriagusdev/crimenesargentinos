"use client";

import Image from "next/image";
import ILocation from "@/models/ILocation";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
  es: {
    department: "POLICÍA FEDERAL // DEPARTAMENTO REGIONAL",
    provincialFile: "EXPEDIENTE PROVINCIAL #{id}",
    currentPost: "PUESTO OPERATIVO ACTUAL",
    fieldPresence: "Presencia de campo confirmada · Reingreso sin costo",
  },
  en: {
    department: "FEDERAL POLICE // REGIONAL DEPARTMENT",
    provincialFile: "PROVINCIAL FILE #{id}",
    currentPost: "CURRENT FIELD POST",
    fieldPresence: "On-site presence confirmed · Free re-entry",
  },
});

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
  const t = useT(messages);
  return (
    <div className="flex flex-col mb-3 sm:mb-4 border-b border-[rgba(255,243,199,0.12)] pb-3 sm:pb-4 [@media(max-height:500px)_and_(pointer:coarse)]:mb-2 [@media(max-height:500px)_and_(pointer:coarse)]:pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-normal sm:tracking-widest leading-snug text-[#E1C380]/90 font-semibold">
            {t("department")}
          </span>
        </div>
      </div>

      <h1 className="text-base sm:text-2xl md:text-3xl [@media(max-height:500px)_and_(pointer:coarse)]:text-base leading-snug font-black font-mono tracking-tight break-words text-[#FFF3C7] mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {provinceName}
      </h1>
      <p className="text-[10px] text-[#E1C380]/70 font-mono tracking-wider mt-0.5">
        {t("provincialFile", { id: provinceId.slice(0, 8).toUpperCase() })}
      </p>

      {/* Tarjeta destacada: Puesto Operativo Actual */}
      {currentLocation && (
        <div className="mt-2.5 sm:mt-3.5 p-2.5 sm:p-3 [@media(max-height:500px)_and_(pointer:coarse)]:mt-2 [@media(max-height:500px)_and_(pointer:coarse)]:p-2 rounded-xl bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-[rgba(15,23,42,0.8)] border border-amber-400/50 shadow-inner flex items-center gap-3 sm:gap-3.5">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 [@media(max-height:500px)_and_(pointer:coarse)]:w-10 [@media(max-height:500px)_and_(pointer:coarse)]:h-10 rounded-lg overflow-hidden border border-amber-300/60 shrink-0 shadow-md">
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
              <span className="text-[10px] sm:text-[10px] sm:text-[9px] font-mono uppercase tracking-normal sm:tracking-widest text-amber-300 font-bold">
                {t("currentPost")}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#FFF3C7] truncate font-mono mt-0.5">
              {currentLocation.name}
            </span>
            <span className="text-[10px] text-[#E1C380]/80 font-mono">
              {t("fieldPresence")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
