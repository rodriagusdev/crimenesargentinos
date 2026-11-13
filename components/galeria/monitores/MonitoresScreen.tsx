"use client";

import { useState } from "react";
import ControlDesk from "./ControlDesk";
import MainScreen from "./MainScreen";
import MonitorBank from "./MonitorBank";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";
import GameBackdrop, { CautionBar, GAME_BG } from "../GameBackdrop";

// Canal en la pantalla principal (0: ninguno) y contador de cambios para la ráfaga de estática
type Tuner = { cam: number; seq: number };

// Propuesta "Sala de monitores": pantalla principal con pupitre y una pared de televisores por release; la nueva se enciende
export default function MonitoresScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  const [tuner, setTuner] = useState<Tuner>({ cam: 0, seq: 0 });
  const newRelease = releases.find(isNew);

  // Todos los canales en orden de cámara
  const channels = [...releases]
    .reverse()
    .flatMap((r) => r.suspects.map((suspect, i) => ({ suspect, cam: firstNumber(r) + i })));
  const live = channels.find((c) => c.cam === tuner.cam) ?? null;

  const tune = (cam: number) => {
    audioManager.play("mechanickey");
    setTuner((prev) => ({ cam, seq: prev.seq + 1 }));
  };
  const step = (delta: number) => {
    const total = channels.length;
    const from = live ? live.cam : delta > 0 ? 0 : 1;
    tune(((from - 1 + delta + total) % total) + 1);
  };

  return (
    <div className={`relative ${GAME_BG} min-h-svh px-3 sm:px-6 py-8 sm:py-12 text-[#d9dde3]`}>
      <GameBackdrop glow="61,255,122" />
      <CautionBar className="max-w-6xl" />
      <div className="relative max-w-6xl mx-auto flex flex-col gap-10">
        <header className="text-center">
          <p className="text-[10px] tracking-[0.3em] text-[#3dff7a]">CENTRAL DE MONITOREO · TURNO NOCHE</p>
          <h1 className="mt-2 text-lg sm:text-2xl leading-relaxed [text-shadow:0_0_14px_rgba(61,255,122,0.35)]">SALA DE MONITORES</h1>
          <p className="mt-2 font-mono text-sm text-[#d9dde3]/60">Tocá un monitor para pasarlo a la pantalla grande.</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <MainScreen live={live} newChannels={newRelease && !live ? newRelease.suspects.length : 0} seq={tuner.seq} />
          <ControlDesk
            cam={live?.cam ?? 0}
            banks={releases.length}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onOff={() => tune(0)}
          />
        </div>

        {releases.map((r) => (
          <MonitorBank
            key={r.id}
            release={r}
            bank={r.id}
            fresh={isNew(r)}
            start={firstNumber(r)}
            onAirCam={live?.cam ?? 0}
            onSelect={tune}
          />
        ))}
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          // La pared nueva se enciende: la pantalla grande corta a "canal nuevo"
          if (!preview) audioManager.play("radio");
          setTuner((prev) => ({ cam: 0, seq: prev.seq + 1 }));
          togglePreview();
        }}
      />
    </div>
  );
}
