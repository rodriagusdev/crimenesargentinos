import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { abandonSession, GameSessionApiError, IPlayConflict, playConflictOf, sessionRoute } from "@/services/gameSessionService";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { preloadCasePackage } from "@/lib/assetPreloader";
import { clearBriefingSeen } from "@/lib/briefingStorage";

// Entrada a un nivel desde su tarjeta: retoma la partida en curso o sortea el caso,
// muestra el video de intro del caso (si tiene) y va a donde quedó el jugador.
// level: nivel de la tarjeta (el habilitado o uno completado para rejugar); sin él se retoma lo que esté en curso
export function usePreviewVideoHandler(previewVideoURL?: string, level?: number) {
  const router = useRouter();
  const play = useGameSessionStore((state) => state.play);
  const resetSession = useGameSessionStore((state) => state.resetSession);

  const [showVideo, setShowVideo] = useState(false);
  const [videoURL, setVideoURL] = useState<string | undefined>(previewVideoURL);
  // Partida en curso de otro nivel: se pide confirmar antes de abandonarla para rejugar
  const [pendingAbandon, setPendingAbandon] = useState<IPlayConflict | null>(null);
  const [abandoning, setAbandoning] = useState(false);
  const [loadingLevel, setLoadingLevel] = useState(false);
  const videoSeen = useRef(false);

  const goToLevel = async () => {
    if (loadingLevel) return;
    try {
      setLoadingLevel(true);
      const session = await play(level);

      clearBriefingSeen(session.caseId);

      // Caso recién sorteado con video: se muestra antes de entrar
      const caseVideo = useGameSessionStore.getState().videoUrl;
      if (caseVideo && !videoSeen.current) {
        videoSeen.current = true;
        setVideoURL(caseVideo);
        setShowVideo(true);
        setLoadingLevel(false);
        return;
      }

      // Precargar recursos del caso y prefetch de la ruta de destino
      const targetRoute = sessionRoute(session);
      router.prefetch(targetRoute);
      preloadCasePackage(session.caseId);

      router.push(targetRoute);
    } catch (err) {
      setLoadingLevel(false);
      if (err instanceof GameSessionApiError && err.status === 401) {
        router.push("/login");
        return;
      }

      const conflict = playConflictOf(err);
      if (conflict) {
        setPendingAbandon(conflict);
        return;
      }
      console.error("Error al iniciar la partida:", err);
    }
  };

  // Confirmó: se abandona la partida en curso (cuenta como perdida) y se entra al nivel elegido
  const confirmAbandon = async () => {
    if (!pendingAbandon) return;
    try {
      setAbandoning(true);
      await abandonSession(pendingAbandon.sessionId);
      resetSession();
      setPendingAbandon(null);
      await goToLevel();
    } catch (err) {
      console.error("No se pudo abandonar la partida en curso:", err);
      setPendingAbandon(null);
    } finally {
      setAbandoning(false);
    }
  };

  const cancelAbandon = () => setPendingAbandon(null);

  // La tarjeta ya conoce el caso en curso y tiene video: se muestra primero
  const handleShowVideo = () => {
    videoSeen.current = true;
    setShowVideo((prev) => !prev);
  };

  return { showVideo, videoURL, handleShowVideo, goToLevel, loadingLevel, pendingAbandon, abandoning, confirmAbandon, cancelAbandon };
}
