"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTokenClaims, isAdmin, isTokenExpired } from "@/lib/auth";

/**
 * En la home ("/") con sesión iniciada no hay nada que mostrar: directo al juego (o al panel si es admin).
 * `enabled` false en la galería de portadas, para poder verlas logueado.
 */
export function useRedirectIfLoggedIn(enabled: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    const claims = getTokenClaims();
    if (claims && !isTokenExpired(claims)) router.replace(isAdmin(claims) ? "/admin" : "/principal");
  }, [router, enabled]);
}
