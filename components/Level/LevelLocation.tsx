"use client";

import IDialog from "@/models/IDialog";
import { getDialogs } from "@/services/levelService";
import { useEffect, useState } from "react";
import DialogBox from "../dialog/DialogBox";

interface Props {
  locationId: number;
  provinceId: number;
}

export default function LevelProvinces({ locationId, provinceId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [locationDialog, setLocationDialog] = useState<IDialog | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLevel() {
      try {
        setLoading(true);
        setError(null);
        const data = await getDialogs();
        if (!cancelled) {
          const retrieveLocationDialog = data.find((dialog) => dialog.provinceId === provinceId && dialog.locationId === locationId);
          setLocationDialog(retrieveLocationDialog ?? null);
          console.log("Retrieved location dialog:", retrieveLocationDialog);
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

  return <DialogBox dialog={locationDialog} />;
}
