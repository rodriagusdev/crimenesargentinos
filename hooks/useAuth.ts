import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { getTokenClaims, isTokenExpired } from "@/lib/auth";
import { useGameSessionStore } from "@/stores/useGameSessionStore";

const subscribe = () => () => {};

/** Sesión válida según el token guardado. Un token vencido cuenta como sin sesión. */
function readAuthenticated(): boolean {
  try {
    const token = localStorage.getItem("auth_token");
    const claims = getTokenClaims();
    return !!token && !!claims && !isTokenExpired(claims);
  } catch {
    return false;
  }
}

/** null en el servidor y en la hidratación: todavía no se leyó el storage. */
const readServerAuthenticated = (): boolean | null => null;

export function useAuth() {
  const router = useRouter();
  const stored = useSyncExternalStore<boolean | null>(subscribe, readAuthenticated, readServerAuthenticated);
  const [loggedOut, setLoggedOut] = useState(false);

  const loading = stored === null;
  const isAuthenticated = !loggedOut && stored === true;

  const logout = () => {
    try {
      localStorage.removeItem("auth_token");
      sessionStorage.clear();
    } catch {
      // sin acceso a storage
    }
    useGameSessionStore.getState().resetSession();
    setLoggedOut(true);
    router.push("/login");
  };

  const requireAuth = () => {
    if (!isAuthenticated && !loading) {
      router.push("/login");
      return false;
    }
    return true;
  };

  return { isAuthenticated, loading, logout, requireAuth };
}
