import { getTokenClaims, isTokenExpired, redirectToLogin } from "./auth";
import { readLocaleCookie } from "./i18n/localeStorage";

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function authHeaders(): HeadersInit {
  const token = localStorage.getItem("auth_token");
  const claims = getTokenClaims();

  // Sin token o vencido: no tiene sentido llamar a la API
  if (!token || !claims || isTokenExpired(claims)) {
    redirectToLogin();
    throw new Error("No authentication token found");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    // La API devuelve el contenido de los casos en este idioma (si no hay traducción, en castellano)
    "Accept-Language": readLocaleCookie(),
  };
}

// 401: la API rechazó el token (vencido o inválido) -> al login
export function handleUnauthorized(response: Response) {
  if (response.status === 401) redirectToLogin();
}