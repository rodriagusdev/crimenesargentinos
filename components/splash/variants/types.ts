import type { ComponentType } from "react";
import type { SplashStep } from "@/hooks/useSplashSequence";

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
  steps: (agentName: string) => SplashStep[];
  Scene: ComponentType<SplashSceneProps>;
};
