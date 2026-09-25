import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { GameSessionApiError, sessionRoute } from "@/services/gameSessionService";
import { useGameSessionStore } from "@/stores/useGameSessionStore";

// Entrada al nivel habilitado desde su tarjeta: retoma la partida en curso o sortea el caso,
// muestra el video de intro del caso (si tiene) y va a donde quedó el jugador
export function usePreviewVideoHandler(previewVideoURL?: string) {
  const router = useRouter();
  const play = useGameSessionStore((state) => state.play);

  const [showVideo, setShowVideo] = useState(false);
  const [videoURL, setVideoURL] = useState<string | undefined>(previewVideoURL);
  const videoSeen = useRef(false);

  const goToLevel = async () => {
    try {
      const session = await play();

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
      console.error("Error al iniciar la partida:", err);
    }
  };

  // La tarjeta ya conoce el caso en curso y tiene video: se muestra primero
  const handleShowVideo = () => {
    videoSeen.current = true;
    setShowVideo((prev) => !prev);
  };

  return { showVideo, videoURL, handleShowVideo, goToLevel };
}
