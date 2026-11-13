"use client";

import Link from "next/link";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";
import type { StepProps } from "./types";

const messages = defineMessages({
  es: {
    introA: "Elegí 3 sospechosos (mínimo 2) y marcá al culpable. Conviene que compartan algún rasgo, así las pistas tienen que combinarse para descartar. Para agregar uno nuevo, cargalo en",
    suspects: "Sospechosos",
    introB: "con sus rasgos.",
    noTraits: "Sin rasgos cargados",
    isGuilty: "Es el culpable",
  },
  en: {
    introA: "Pick 3 suspects (at least 2) and mark the culprit. Ideally they share some trait, so the clues have to be combined to rule them out. To add a new one, create it in",
    suspects: "Suspects",
    introB: "with its traits.",
    noTraits: "No traits yet",
    isGuilty: "Is the culprit",
  },
});

// Paso 4: sospechosos del caso y quién es el culpable. Las pistas del paso siguiente se escriben con sus rasgos
export default function StepSuspects({ draft, update, catalog }: StepProps) {
  const t = useT(messages);
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
        {t("introA")}{" "}
        <Link href="/admin/suspects" className="text-[#E1C380] underline" target="_blank">{t("suspects")}</Link> {t("introB")}
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
                  <span className="block text-xs text-slate-400">{suspect.traits.join(" · ") || t("noTraits")}</span>
                </span>
              </button>
              {entry && (
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                  <input type="radio" name="guilty" checked={entry.isGuilty} onChange={() => setGuilty(suspect.id)} />
                  {t("isGuilty")}
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
