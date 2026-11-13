"use client";

import TrailerPosterFrame from "./TrailerPosterFrame";
import { CASE_STORIES } from "@/lib/caseStories";

const PERFORATIONS = "bg-[repeating-linear-gradient(90deg,rgba(255,243,199,0.22)_0_6px,transparent_6px_14px)]";

// Tira de película con los ocho casos, cruzada detrás del título del póster
export default function TrailerFilmStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <div className="bg-[#0d0b08] border-y border-[#E1C380]/20 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className={`h-1.5 mb-1.5 ${PERFORATIONS}`} />
        <div className="flex justify-center gap-1.5 overflow-hidden">
          {CASE_STORIES.map((s) => (
            <TrailerPosterFrame key={s.id} story={s} />
          ))}
        </div>
        <div className={`h-1.5 mt-1.5 ${PERFORATIONS}`} />
      </div>
    </div>
  );
}
