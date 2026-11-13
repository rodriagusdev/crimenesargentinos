/**
 * Flag de sesión para el splash "Expediente Clasificado".
 * El login lo marca como pendiente y /principal lo consume una sola vez.
 */

const SPLASH_KEY = "post_login_splash_pending";

export function markSplashPending(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SPLASH_KEY, "true");
  } catch {
    // Ignorar errores en modo incógnito/restringido
  }
}

export function isSplashPending(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SPLASH_KEY) === "true";
  } catch {
    return false;
  }
}

export function clearSplashPending(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SPLASH_KEY);
  } catch {
    // Ignorar errores en SSR
  }
}
