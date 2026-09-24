import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getGameData } from "@/services/levelService";

async function fetchInitialRoute(levelId: number): Promise<string> {
  try {
    const data = await getGameData(levelId);
    return data.initialRoute;
  } catch (err) {
    console.error("Error al obtener la ruta inicial del nivel:", err);
    return `/level/${levelId}`;
  }
}

export function usePreviewVideoHandler(previewId: number) {
  const router = useRouter();

  const [showVideo, setShowVideo] = useState(false);
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  // Al abrir el video se obtiene la ruta inicial para precargarla mientras se reproduce
  useEffect(() => {
    if (!showVideo) return;

    let cancelled = false;
    fetchInitialRoute(previewId).then((route) => {
      if (cancelled) return;
      setTargetRoute(route);
      router.prefetch(route);
    });

    return () => {
      cancelled = true;
    };
  }, [showVideo, previewId, router]);

  const goToLevel = async () => {
    try {
      sessionStorage.removeItem(`level_${previewId}_briefing_seen`);
    } catch {
    }
    router.push(targetRoute ?? (await fetchInitialRoute(previewId)));
  };

  const handleShowVideo = () => {
    try {
      sessionStorage.removeItem(`level_${previewId}_briefing_seen`);
    } catch {
    }
    setShowVideo((prev) => !prev);
  };

  return { showVideo, handleShowVideo, goToLevel };
}
