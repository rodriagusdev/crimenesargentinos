"use client";

import Link from "next/link";
import type { StepProps } from "./types";

// Paso 4: sospechosos del caso y quién es el culpable. Las pistas del paso siguiente se escriben con sus rasgos
export default function StepSuspects({ draft, update, catalog }: StepProps) {
  const chosen = new Map(draft.suspects.map((s) => [s.suspectId, s]));

  const toggle = (suspectId: string) =>
    update((d) => ({
      ...d,
      suspects: chosen.has(suspectId) ? d.suspects.filter((s) => s.suspectId !== suspectId) : [...d.suspects, { suspectId, isGuilty: false }],
    }));

  const setGuilty = (suspectId: string) =>
    update((d) => ({ ...d, suspects: d.suspects.map((s) => ({ ...s, isGuilty: s.suspectId === suspectId })) }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Elegí 3 sospechosos (mínimo 2) y marcá al culpable. Conviene que compartan algún rasgo, así las pistas tienen que
        combinarse para descartar. Para agregar uno nuevo, cargalo en{" "}
        <Link href="/admin/suspects" className="text-[#E1C380] underline" target="_blank">Sospechosos</Link> con sus rasgos.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.suspects.map((suspect) => {
          const entry = chosen.get(suspect.id);
          return (
            <div key={suspect.id} className={`rounded-lg border p-3 transition ${entry ? "border-[#E1C380] bg-[#E1C380]/5" : "border-white/10"}`}>
              <button type="button" onClick={() => toggle(suspect.id)} className="flex w-full items-center gap-3 text-left">
                {suspect.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- imagen del sospechoso cargada en el panel
                  <img src={suspect.imageUrl} alt="" className="size-12 rounded object-cover" />
                ) : (
                  <span className="size-12 rounded bg-white/5" />
                )}
                <span>
                  <span className="block text-sm font-medium text-slate-100">{suspect.name}</span>
                  <span className="block text-xs text-slate-400">{suspect.traits.join(" · ") || "Sin rasgos cargados"}</span>
                </span>
              </button>
              {entry && (
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                  <input type="radio" name="guilty" checked={entry.isGuilty} onChange={() => setGuilty(suspect.id)} />
                  Es el culpable
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
