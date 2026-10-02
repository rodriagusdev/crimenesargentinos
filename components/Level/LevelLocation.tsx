"use client";

import { useRouter } from "next/navigation";
import IDialog from "@/models/IDialog";
import { getDialog, getLevelLocations } from "@/services/levelService";
import { useEffect, useState } from "react";
import DialogBox from "../dialog/DialogBox";
import { useGameSession } from "@/hooks/useGameSession";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import LocationIntro from "./LocationIntro";

interface Props {
  levelId: number;
  locationId: string;
  provinceId: string;
  criminalLocationId?: string | null;
  targetSuspectId?: string | null;
}

export default function LevelLocation({
  levelId,
  locationId,
  provinceId,
  criminalLocationId: propsCriminalLocationId,
  targetSuspectId: propsTargetSuspectId,
}: Props) {
  const router = useRouter();
  // Si el jugador no está en esta locación, se lo redirige a donde quedó
  const { session, ready, error: sessionError } = useGameSession(levelId, { provinceId, locationId });
  const markIntroSeen = useGameSessionStore((state) => state.markIntroSeen);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const [locationDialog, setLocationDialog] = useState<IDialog | null>(null);
  const [locationName, setLocationName] = useState<string | undefined>(undefined);

  const onCloseDialog = () => {
    router.push(`/level/${levelId}/${provinceId}`);
  };

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    async function loadLevel() {
      try {
        setLoading(true);
        setError(null);
        const [dialogData, locationsData] = await Promise.all([
          getDialog(levelId, locationId),
          getLevelLocations(provinceId).catch(() => null),
        ]);

        if (!cancelled) {
          setLocationDialog(dialogData);

          if (locationsData) {
            const loc = locationsData.locations.find((l) => l.id === locationId);
            if (loc) setLocationName(loc.name);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar el nivel",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLevel();

    return () => {
      cancelled = true;
    };
  }, [ready, levelId, locationId, provinceId]);

  // Escena de intro ya vista en esta partida: se va directo al interrogatorio
  const introSeen = Boolean(
    session?.visitedLocations.find((l) => l.locationId === locationId)?.introSeen
  );

  const storeCriminalLocationId = useGameSessionStore((state) => state.criminalLocationId);
  const targetSuspect = useGameSessionStore((state) => state.targetSuspect);
  const issuedArrestSuspectId = useGameSessionStore((state) => state.issuedArrestSuspectId);
  const triggerGameOver = useGameSessionStore((state) => state.triggerGameOver);
  const triggerVictory = useGameSessionStore((state) => state.triggerVictory);
  const isGameOver = useGameSessionStore((state) => state.isGameOver);
  const isVictory = useGameSessionStore((state) => state.isVictory);

  const effectiveCriminalLocationId = propsCriminalLocationId ?? storeCriminalLocationId;
  const effectiveTargetSuspectId = propsTargetSuspectId ?? targetSuspect?.id;

  // Evaluación de confrontación al llegar a la locación
  useEffect(() => {
    if (!ready || loading || isGameOver || isVictory) return;

    console.log("[ENTER LOCATION]", {
      locationId,
      locationName,
      provinceId,
      criminalLocationId: effectiveCriminalLocationId,
      issuedArrestSuspectId,
      targetSuspectId: effectiveTargetSuspectId,
      targetSuspectName: targetSuspect?.name,
    });

    // El sospechoso se encuentra únicamente en su locación escondite (criminalLocationId)
    const isSuspectHere = Boolean(
      effectiveCriminalLocationId && locationId === effectiveCriminalLocationId
    );

    if (isSuspectHere) {
      console.log("[CONFRONTATION EVALUATION]", {
        locationId,
        criminalLocationId: effectiveCriminalLocationId,
        issuedArrestSuspectId,
        targetSuspectId: effectiveTargetSuspectId,
        isMatch: Boolean(effectiveTargetSuspectId && issuedArrestSuspectId === effectiveTargetSuspectId),
      });

      if (!issuedArrestSuspectId) {
        // Caso 1: Llegó al escondite sin orden de arresto
        triggerGameOver("arrest");
      } else if (effectiveTargetSuspectId && issuedArrestSuspectId !== effectiveTargetSuspectId) {
        // Caso 2: Orden emitida pero para el sospechoso equivocado
        triggerGameOver("arrest");
      } else if (effectiveTargetSuspectId && issuedArrestSuspectId === effectiveTargetSuspectId) {
        // Caso 3: Orden correcta emitida para el culpable
        triggerVictory();
      }
    }
  }, [
    ready,
    loading,
    locationId,
    locationName,
    provinceId,
    effectiveCriminalLocationId,
    effectiveTargetSuspectId,
    issuedArrestSuspectId,
    targetSuspect,
    isGameOver,
    isVictory,
    triggerGameOver,
    triggerVictory,
  ]);

  const onAdvance = () => {
    setShowDialog(true);
    markIntroSeen(locationId).catch((err) => console.error("No se pudo marcar la intro como vista:", err));
  };

  if (sessionError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        {sessionError}
      </div>
    );
  }

  if (!ready || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#FFF3C7]">
        Cargando lugar...
      </div>
    );
  }

  if (error || !locationDialog) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        {error ?? "Lugar no encontrado"}
      </div>
    );
  }

  if (!showDialog && !introSeen) {
    return (
      <LocationIntro
        levelId={levelId}
        dialog={locationDialog}
        locationName={locationName}
        onAdvance={onAdvance}
        onBack={onCloseDialog}
      />
    );
  }

  return <DialogBox dialog={locationDialog} onClose={onCloseDialog} />;
}
