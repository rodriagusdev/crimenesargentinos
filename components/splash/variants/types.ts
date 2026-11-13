import type { ComponentType } from "react";
import type { SplashStep } from "@/hooks/useSplashSequence";
import type { Locale } from "@/lib/i18n/locale";

export type SplashSceneProps = {
  /** Paso actual de la animación (vale steps.length cuando terminó o se salteó) */
  progress: number;
  /** Cantidad total de pasos */
  total: number;
  exiting: boolean;
  agentName: string;
};

export type SplashVariant = {
  id: string;
  /** Pasos de la animación; el idioma importa cuando un paso dura lo que tarda en tipearse un texto */
  steps: (agentName: string, locale: Locale) => SplashStep[];
  Scene: ComponentType<SplashSceneProps>;
};
