"use client";

import type { CSSProperties } from "react";
import SuspectSilhouette, { SilhouetteVariant } from "./SuspectSilhouette";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
  es: { wanted: "SE BUSCA", reward: "RECOMPENSA {reward}" },
  en: { wanted: "WANTED", reward: "REWARD {reward}" },
});

type WantedPosterProps = {
  variant: SilhouetteVariant;
  reward: string;
  className?: string;
  style?: CSSProperties;
};

// Afiche de "SE BUSCA" pegado en la pared
export default function WantedPoster({ variant, reward, className = "", style }: WantedPosterProps) {
  const t = useT(messages);
  return (
    <div
      style={style}
      className={`w-[clamp(56px,8vw,110px)] p-1 sm:p-1.5 bg-[#e6dcc0] text-[#2a1d12] text-center shadow-[0_6px_12px_rgba(0,0,0,0.6)] ${className}`}
    >
      <p className="text-[6px] sm:text-[10px] tracking-widest">{t("wanted")}</p>
      <div className="relative mt-1 aspect-square">
        <SuspectSilhouette variant={variant} />
      </div>
      <p className="mt-1 text-[4px] sm:text-[7px]">{t("reward", { reward })}</p>
    </div>
  );
}
