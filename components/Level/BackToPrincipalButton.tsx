"use client";

import { useRouter } from "next/navigation";
import GameButton from "../buttons/GameButton";
import { useFlagStore } from "@/stores/useFlagStore";

export default function BackToPrincipalButton() {
  const router = useRouter();
  const clearFlags = useFlagStore((state) => state.clearFlags);

  // Esto es para controlar si se abrio el modal donde se muestra la info del caso al iniciar un nivel
  const handleBack = () => {
    try {
      clearFlags();
      Object.keys(sessionStorage).forEach((key) => {
        if (key.endsWith("_briefing_seen")) {
          sessionStorage.removeItem(key);
        }
      });
    } catch {
      // nada que hacer si falla
    }
    router.push("/principal");
  };

  return (
    <div className="absolute top-6 right-6 z-30 w-100">
      <GameButton
        icon=""
        label="VOLVER AL MENU PRINCIPAL"
        variant="secondary"
        onClick={handleBack}
      />
    </div>
  );
}
