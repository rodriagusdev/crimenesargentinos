import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { GameSessionApiError, sessionRoute } from "@/services/gameSessionService";
import { IGameSession } from "@/models/IGameSession";

interface ScreenPosition {
  provinceId?: string;
  locationId?: string;
}

// La pantalla corresponde a donde está el jugador. El mapa del nivel (sin posición) siempre se puede ver
function isAtPosition(session: IGameSession, position?: ScreenPosition): boolean {
  if (!position?.provinceId) return true;
  if (session.currentProvinceId !== position.provinceId) return false;
  return !position.locationId || session.currentLocationId === position.locationId;
}

// Inicia o continúa la partida del nivel. Si la URL no coincide con donde quedó el jugador, lo redirige ahí
export function useGameSession(levelId: number, position?: ScreenPosition) {
  const router = useRouter();
  const initSession = useGameSessionStore((state) => state.initSession);
  const session = useGameSessionStore((state) => state.session);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const provinceId = position?.provinceId;
  const locationId = position?.locationId;

  useEffect(() => {
    let cancelled = false;

    initSession(levelId)
      .then((current) => {
        if (cancelled) return;

        // Con la partida terminada no se redirige: se muestra el Game Over donde está
        if (current.status === "InProgress" && !isAtPosition(current, { provinceId, locationId })) {
          router.replace(sessionRoute(current));
          return;
        }

        setReady(true);
      })
      .catch((err) => {
        if (cancelled) return;

        if (err instanceof GameSessionApiError && err.status === 401) {
          router.replace("/login");
        } else if (err instanceof GameSessionApiError && err.status === 403) {
          router.replace("/principal");
        } else {
          setError(err instanceof Error ? err.message : "Error al cargar la partida");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [levelId, provinceId, locationId, initSession, router]);

  return { session, ready, error };
}
