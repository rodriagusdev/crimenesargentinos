"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import WitnessEditor from "./WitnessEditor";
import { caseLocations, type StepProps } from "./types";

interface Props extends StepProps {
  selectedId: string | null; // la elige el asistente para que la vista previa muestre la misma locación
  onSelect: (locationId: string) => void;
}

// Paso 6: un testigo por locación de las provincias del caso, con sus preguntas
export default function StepWitnesses({ draft, update, catalog, selectedId, onSelect }: Props) {
  const locations = caseLocations(draft, catalog);
  const selected = locations.find((l) => l.id === selectedId) ?? locations[0];
  const setSelectedId = onSelect;
  const dialog = draft.dialogs.find((d) => d.locationId === selected?.id);

  const clueKeysGiven = new Set(draft.dialogs.flatMap((d) => d.questions.map((q) => q.clueKey)).filter(Boolean));
  const pendingClues = draft.clues.filter((c) => !c.isInitial && !clueKeysGiven.has(c.key));

  const isComplete = (locationId: string) => {
    const d = draft.dialogs.find((x) => x.locationId === locationId);
    return !!d && !!d.npcName.trim() && d.questions.length > 0 && d.questions.every((q) => q.text.trim());
  };

  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr]">
      <nav className="space-y-1">
        {draft.provinces.map((p) => (
          <div key={p.provinceId}>
            <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">{catalog.provinces.find((c) => c.id === p.provinceId)?.name}</p>
            {catalog.locations.filter((l) => l.provinceId === p.provinceId).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setSelectedId(l.id)}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition ${l.id === selected?.id ? "bg-[#E1C380]/15 text-[#E1C380]" : "text-slate-300 hover:bg-white/[0.04]"}`}
              >
                <span className="truncate">{l.name}{l.id === draft.criminalLocationId ? " (escondite)" : l.id === draft.startLocationId ? " (inicio)" : ""}</span>
                {isComplete(l.id) && <AdminIcon name="check" className="size-3.5 shrink-0 text-emerald-400" />}
              </button>
            ))}
          </div>
        ))}

        {pendingClues.length > 0 && (
          <div className="mt-4 rounded-md border border-amber-400/30 bg-amber-400/10 p-2 text-xs text-amber-200">
            Pistas que todavía no da ninguna pregunta:
            <ul className="mt-1 list-disc pl-4">{pendingClues.map((c) => <li key={c.key}>{c.description || "(sin texto)"}</li>)}</ul>
          </div>
        )}
      </nav>

      {selected && dialog ? (
        <WitnessEditor
          draft={draft}
          dialog={dialog}
          locationName={selected.name}
          onChange={(change) => update((d) => ({ ...d, dialogs: d.dialogs.map((x) => (x.locationId === dialog.locationId ? change(x) : x)) }))}
        />
      ) : (
        <p className="text-sm text-slate-400">Elegí las provincias del caso para cargar sus testigos.</p>
      )}
    </div>
  );
}
