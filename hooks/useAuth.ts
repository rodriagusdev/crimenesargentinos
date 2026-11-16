import { useRouter } from "next/navigation";
<<<<<<< HEAD
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
=======
import { useSyncExternalStore } from "react";
import { getTokenClaims, isTokenExpired } from "@/lib/auth";
import { useGameSessionStore } from "@/stores/useGameSessionStore";

// Suscripción a cambios de sesión: otras pestañas (evento storage) y el logout de esta pestaña
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
const notify = () => listeners.forEach((l) => l());

// Se lee sincrónicamente en el cliente: al navegar desde el login no hay render de "cargando"
// ni hay que esperar a un useEffect para empezar a pedir los datos de los paneles.
function getSnapshot(): boolean {
  const claims = getTokenClaims();
  // Un token vencido cuenta como sin sesión
  return !!claims && !isTokenExpired(claims);
}
// En el servidor (y durante la hidratación) no hay localStorage: estado "cargando"
const getServerSnapshot = (): boolean | null => null;

export function useAuth() {
  const router = useRouter();
  const snapshot = useSyncExternalStore<boolean | null>(subscribe, getSnapshot, getServerSnapshot);
  const loading = snapshot === null;
  const isAuthenticated = snapshot === true;
>>>>>>> ae55200a7b6eb941d2f4bf1d16c2087db019adc1

  const logout = () => {
    try {
      localStorage.removeItem("auth_token");
      sessionStorage.clear();
    } catch {
      // sin acceso a storage
    }
    useGameSessionStore.getState().resetSession();
<<<<<<< HEAD
    setLoggedOut(true);
=======
    notify();
>>>>>>> ae55200a7b6eb941d2f4bf1d16c2087db019adc1
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
