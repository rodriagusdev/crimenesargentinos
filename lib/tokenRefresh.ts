import { API_URL, authHeaders } from "./api";

// Una sola renovación en vuelo a la vez (varias señales de actividad no disparan varias requests)
let inFlight: Promise<boolean> | null = null;

/**
 * Pide un token nuevo con el actual (POST /api/Auth/refresh) y lo guarda donde lo deja el login.
 * Devuelve false si no se pudo renovar: el token viejo sigue valiendo hasta que venza.
 */
export function refreshAuthToken(): Promise<boolean> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const response = await fetch(`${API_URL}/api/Auth/refresh`, { method: "POST", headers: authHeaders() });
      if (!response.ok) return false;
      const data: { token?: string } = await response.json();
      if (!data.token) return false;
      localStorage.setItem("auth_token", data.token);
      return true;
    } catch {
      return false;
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}
