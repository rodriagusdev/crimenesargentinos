import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getGameData } from "@/services/levelService";
import { GameSessionApiError, getCurrentSession, sessionRoute } from "@/services/gameSessionService";
import { useGameSessionStore } from "@/stores/useGameSessionStore";

// Pantalla a precargar mientras corre el video: donde quedó la partida en curso o, si no hay, el inicio del nivel
async function fetchRouteToPrefetch(levelId: number): Promise<string> {
  try {
    return sessionRoute(await getCurrentSession(levelId));
  } catch {
    try {
      return (await getGameData(levelId)).initialRoute;
    } catch {
      return `/level/${levelId}`;
    }
  }
}

export function usePreviewVideoHandler(previewId: number) {
  const router = useRouter();
  const initSession = useGameSessionStore((state) => state.initSession);

  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!showVideo) return;

    let cancelled = false;
    fetchRouteToPrefetch(previewId).then((route) => {
      if (!cancelled) router.prefetch(route);
    });

    return () => {
      cancelled = true;
    };
  }, [showVideo, previewId, router]);

  // Continúa la partida en curso (o empieza una) y va a donde quedó el jugador
  const goToLevel = async () => {
    try {
      sessionStorage.removeItem(`level_${previewId}_briefing_seen`);
    } catch {
    }

    try {
      const session = await initSession(previewId);
      router.push(sessionRoute(session));
    } catch (err) {
      if (err instanceof GameSessionApiError && err.status === 401) {
        router.push("/login");
        return;
      }
      console.error("Error al iniciar la partida:", err);
      router.push(`/level/${previewId}`);
    }
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
