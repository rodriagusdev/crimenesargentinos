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

const LAST_VARIANT_KEY = "post_login_splash_last";

/** Elige un splash al azar, sin repetir el último que se mostró en este navegador */
export function pickSplashVariant<T extends string>(ids: readonly T[]): T {
  let last: string | null = null;
  try {
    last = localStorage.getItem(LAST_VARIANT_KEY);
  } catch {
    // sin acceso a storage
  }

  const pool = ids.length > 1 ? ids.filter((id) => id !== last) : ids;
  const chosen = pool[Math.floor(Math.random() * pool.length)];

  try {
    localStorage.setItem(LAST_VARIANT_KEY, chosen);
  } catch {
    // sin acceso a storage
  }
  return chosen;
}
