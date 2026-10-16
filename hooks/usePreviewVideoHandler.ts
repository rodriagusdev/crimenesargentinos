import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { abandonSession, GameSessionApiError, IPlayConflict, playConflictOf, sessionRoute } from "@/services/gameSessionService";
import { useGameSessionStore } from "@/stores/useGameSessionStore";

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
  const videoSeen = useRef(false);

  const goToLevel = async () => {
    try {
      const session = await play(level);

      try {
        sessionStorage.removeItem(`level_${session.caseId}_briefing_seen`);
      } catch {
      }

      // Caso recién sorteado con video: se muestra antes de entrar
      const caseVideo = useGameSessionStore.getState().videoUrl;
      if (caseVideo && !videoSeen.current) {
        videoSeen.current = true;
        setVideoURL(caseVideo);
        setShowVideo(true);
        return;
      }

      router.push(sessionRoute(session));
    } catch (err) {
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

  return { showVideo, videoURL, handleShowVideo, goToLevel, pendingAbandon, abandoning, confirmAbandon, cancelAbandon };
}
