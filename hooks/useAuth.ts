import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTokenClaims, isTokenExpired } from "@/lib/auth";
import { useGameSessionStore } from "@/stores/useGameSessionStore";

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const claims = getTokenClaims();
    // Un token vencido cuenta como sin sesión
    setIsAuthenticated(!!token && !!claims && !isTokenExpired(claims));
    setLoading(false);
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem("auth_token");
      sessionStorage.clear();
    } catch {
      // sin acceso a storage
    }
    useGameSessionStore.getState().resetSession();
    setIsAuthenticated(false);
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
