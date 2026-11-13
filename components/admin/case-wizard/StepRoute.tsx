"use client";

import { useT } from "@/hooks/useT";
import { stepRouteMessages } from "./StepRoute.messages";
import WizardField, { adminInputClass } from "./WizardField";
import type { StepProps } from "./types";

// Paso 3: recorrido. Dónde lo vieron por última vez y dónde se esconde (en provincias distintas)
export default function StepRoute({ draft, update, catalog }: StepProps) {
  const t = useT(stepRouteMessages);
  const groups = draft.provinces.map((p) => ({
    province: catalog.provinces.find((c) => c.id === p.provinceId)?.name ?? "",
    locations: catalog.locations.filter((l) => l.provinceId === p.provinceId),
  }));

  const provinceOf = (locationId: string | null) => catalog.locations.find((l) => l.id === locationId)?.provinceId;
  const sameProvince = draft.startLocationId && draft.criminalLocationId && provinceOf(draft.startLocationId) === provinceOf(draft.criminalLocationId);

  const select = (value: string | null, onChange: (id: string | null) => void) => (
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} className={adminInputClass}>
      <option value="">{t("choose")}</option>
      {groups.map((g) => (
        <optgroup key={g.province} label={g.province}>
          {g.locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        {t("intro")}
      </p>

      <WizardField label={t("start")} hint={t("startHint")}>
        {select(draft.startLocationId, (id) => update((d) => ({ ...d, startLocationId: id })))}
      </WizardField>

      <WizardField label={t("hideout")} hint={t("hideoutHint")}>
        {select(draft.criminalLocationId, (id) => update((d) => ({ ...d, criminalLocationId: id })))}
      </WizardField>

      {sameProvince && (
        <p className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
          {t("sameProvince")}
        </p>
      )}
    </div>
  );
}
