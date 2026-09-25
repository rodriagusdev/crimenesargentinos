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
}

export default function LevelLocation({ levelId, locationId, provinceId }: Props) {
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
