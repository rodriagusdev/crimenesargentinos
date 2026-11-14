"use client";

import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/lib/i18n/locale";

/**
 * usePathname() sin el prefijo interno de idioma. Con la reescritura de proxy.ts el servidor
 * prerenderiza /es/principal mientras el navegador muestra /principal: así ambos ven la misma ruta
 * (sin errores de hidratación) y las comparaciones del tipo pathname === "/principal" siguen andando.
 */
export function useAppPathname(): string {
  return stripLocalePrefix(usePathname() ?? "/");
}
