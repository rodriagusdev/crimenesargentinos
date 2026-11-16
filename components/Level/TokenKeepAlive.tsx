"use client";

import { useTokenKeepAlive } from "@/hooks/useTokenKeepAlive";

// Renueva la sesión mientras se juega con actividad (ver useTokenKeepAlive). No dibuja nada.
export default function TokenKeepAlive() {
  useTokenKeepAlive();
  return null;
}
