"use client";

import Image from "next/image";
import { ProvinceButton } from "@/components/buttons/ProvinceButton";
import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import { getCalibratedProvinceCoordinates, TACTICAL_MONITOR_BOUNDS as B } from "@/lib/mapCalibration";
import type { CaseDraft } from "@/models/ICaseDraft";
import ScaledViewport from "./ScaledViewport";
import { previewImage } from "./previewImages";

// Mapa general del caso: las provincias elegidas con sus pines, como en /level/[id]
export default function MapPreview({ draft, catalog }: { draft: CaseDraft; catalog: CaseWizardCatalog }) {
  const locationName = (id: string | null) => catalog.locations.find((l) => l.id === id)?.name;
  const startProvince = catalog.locations.find((l) => l.id === draft.startLocationId)?.provinceId;

  return (
    <div className="space-y-2">
      <ScaledViewport>
        <div className="relative h-screen w-screen overflow-hidden bg-[#05070a]">
          <Image src="/images/test_composite.webp" alt="" fill className="object-fill" sizes="100vw" />
          <div className="absolute z-10" style={{ left: `${B.leftPct}%`, top: `${B.topPct}%`, width: `${B.widthPct}%`, height: `${B.heightPct}%` }}>
            {draft.provinces.map((p) => {
              const name = catalog.provinces.find((c) => c.id === p.provinceId)?.name ?? "";
              const coords = getCalibratedProvinceCoordinates({ id: p.provinceId, name, top: p.top ?? undefined, left: p.left ?? undefined });
              return (
                <ProvinceButton
                  key={p.provinceId}
                  label={name}
                  icon={previewImage(p.icon)}
                  top={coords.top}
                  left={coords.left}
                  isCurrent={p.provinceId === startProvince}
                  onClick={() => {}}
                />
              );
            })}
          </div>
        </div>
      </ScaledViewport>
      <p className="text-xs text-slate-400">
        Arranca en <b className="text-slate-200">{locationName(draft.startLocationId) ?? "—"}</b> · escondite en{" "}
        <b className="text-slate-200">{locationName(draft.criminalLocationId) ?? "—"}</b>
      </p>
    </div>
  );
}
