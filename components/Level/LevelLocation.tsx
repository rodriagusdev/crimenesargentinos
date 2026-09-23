"use client";

import { useRouter } from "next/navigation";
import IDialog from "@/models/IDialog";
import { getDialogs, getLevelLocations } from "@/services/levelService";
import { useEffect, useState } from "react";
import DialogBox from "../dialog/DialogBox";
import LocationIntro from "./LocationIntro";

interface Props {
  levelId: number;
  locationId: number;
  provinceId: number;
}

export default function LevelLocation({ levelId, locationId, provinceId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const [locationDialog, setLocationDialog] = useState<IDialog | null>(null);
  const [locationName, setLocationName] = useState<string | undefined>(undefined);

  const onCloseDialog = () => {
    router.push(`/level/${levelId}/${provinceId}`);
  };

  useEffect(() => {
    let cancelled = false;

    async function loadLevel() {
      try {
        setLoading(true);
        setError(null);
        const [dialogsData, locationsData] = await Promise.all([
          getDialogs(),
          getLevelLocations(provinceId).catch(() => null),
        ]);

        if (!cancelled) {
          const retrieveLocationDialog = dialogsData.find(
            (dialog) => dialog.provinceId === provinceId && dialog.locationId === locationId
          );
          setLocationDialog(retrieveLocationDialog ?? null);

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
  }, [locationId, provinceId]);

  if (loading) {
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

  if (!showDialog) {
    return (
      <LocationIntro
        levelId={levelId}
        dialog={locationDialog}
        locationName={locationName}
        onAdvance={() => setShowDialog(true)}
        onBack={onCloseDialog}
      />
    );
  }

  return <DialogBox dialog={locationDialog} levelId={levelId} onClose={onCloseDialog} />;
}
