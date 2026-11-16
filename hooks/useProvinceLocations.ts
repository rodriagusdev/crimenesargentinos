"use client";

import { useEffect, useState } from "react";
import { getCaseLocations } from "@/services/levelService";
import ILevelLocations from "@/models/ILevelLocations";

// Locaciones de una provincia del caso (con estado de carga y error)
export function useProvinceLocations(levelId: number, provinceId: string, loadErrorFallback: string) {
  const [data, setData] = useState<ILevelLocations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLevel() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCaseLocations(levelId, provinceId);
        if (!cancelled) {
          setData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : loadErrorFallback,
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
  }, [levelId, provinceId, loadErrorFallback]);

  return { data, loading, error };
}
