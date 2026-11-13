"use client";

import WizardField, { adminInputClass } from "./WizardField";
import type { StepProps } from "./types";

// Paso 3: recorrido. Dónde lo vieron por última vez y dónde se esconde (en provincias distintas)
export default function StepRoute({ draft, update, catalog }: StepProps) {
  const groups = draft.provinces.map((p) => ({
    province: catalog.provinces.find((c) => c.id === p.provinceId)?.name ?? "",
    locations: catalog.locations.filter((l) => l.provinceId === p.provinceId),
  }));

  const provinceOf = (locationId: string | null) => catalog.locations.find((l) => l.id === locationId)?.provinceId;
  const sameProvince = draft.startLocationId && draft.criminalLocationId && provinceOf(draft.startLocationId) === provinceOf(draft.criminalLocationId);

  const select = (value: string | null, onChange: (id: string | null) => void) => (
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} className={adminInputClass}>
      <option value="">Elegir...</option>
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
        El jugador arranca en la locación inicial, recorre todas las provincias siguiendo las pistas y termina en el escondite.
        El tiempo inicial del caso se calcula solo, con el recorrido más corto entre estos dos puntos.
      </p>

      <WizardField label="Locación inicial" hint="Donde vieron al sospechoso por última vez (va en una pista inicial).">
        {select(draft.startLocationId, (id) => update((d) => ({ ...d, startLocationId: id })))}
      </WizardField>

      <WizardField label="Escondite" hint="Su testigo tiene la pregunta de encontrarlo / se escapó.">
        {select(draft.criminalLocationId, (id) => update((d) => ({ ...d, criminalLocationId: id })))}
      </WizardField>

      {sameProvince && (
        <p className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
          La locación inicial y el escondite tienen que estar en provincias distintas.
        </p>
      )}
    </div>
  );
}
