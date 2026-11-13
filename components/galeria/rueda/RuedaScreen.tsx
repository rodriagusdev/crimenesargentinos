"use client";

import { useState } from "react";
import Intercom from "./Intercom";
import LineupRow from "./LineupRow";
import ObservationHero from "./ObservationHero";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";
import GameBackdrop, { CautionBar, GAME_BG } from "../GameBackdrop";

// Estado del intercomunicador: sin órdenes, alguien al frente o alguien que vuelve a la fila
type IntercomState =
  | { kind: "idle"; seq: number }
  | { kind: "forward"; seq: number; number: number; name: string }
  | { kind: "back"; seq: number; number: number };

// Propuesta "Rueda de reconocimiento": del lado oscuro del vidrio, una rueda por release; la nueva entra caminando con reflector
export default function RuedaScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  const [intercom, setIntercom] = useState<IntercomState>({ kind: "idle", seq: 0 });
  const newRelease = releases.find(isNew);

  const message =
    intercom.kind === "forward"
      ? `Número ${intercom.number}, un paso al frente.`
      : intercom.kind === "back"
        ? `Número ${intercom.number}, vuelva a la fila.`
        : newRelease
          ? `Atención: ingresa una rueda nueva de ${newRelease.suspects.length} personas. Todos mirando al frente.`
          : "Todos mirando al frente. Tocá a alguien para llamarlo.";

  const call = (number: number, name: string) => {
    audioManager.play("radio");
    setIntercom((prev) =>
      prev.kind === "forward" && prev.name === name
        ? { kind: "back", seq: prev.seq + 1, number }
        : { kind: "forward", seq: prev.seq + 1, number, name },
    );
  };

  return (
    <div className={`relative ${GAME_BG} min-h-svh px-3 sm:px-6 py-8 sm:py-12 text-[#FFF3C7]`}>
      <GameBackdrop glow="120,170,255" />
      <CautionBar className="max-w-6xl" />
      <div className="relative max-w-6xl mx-auto">
        <ObservationHero />
        <Intercom message={message} seq={intercom.seq} speaking={intercom.seq > 0} />

        <div className="flex flex-col gap-8 rounded-b-xl border-4 border-t-0 border-[#1d2026] bg-[#08090b] px-2 sm:px-4 pt-6 pb-8">
          {releases.map((r) => (
            <LineupRow
              key={r.id}
              release={r}
              fresh={isNew(r)}
              start={firstNumber(r)}
              steppedName={intercom.kind === "forward" ? intercom.name : null}
              onCall={call}
            />
          ))}
        </div>
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          // La rueda nueva entra con portazo y aviso por el intercomunicador
          if (!preview) audioManager.play("stamp");
          setIntercom((prev) => ({ kind: "idle", seq: prev.seq + 1 }));
          togglePreview();
        }}
      />
    </div>
  );
}
