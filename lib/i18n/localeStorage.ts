import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./locale";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Idioma elegido en este navegador (cookie que fija el proxy o el selector ES / EN) */
export function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function writeLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  document.documentElement.lang = locale;
}
