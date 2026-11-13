import { API_URL } from "@/lib/api";

export const PREVIEW_PLACEHOLDER = "/images/slate_board.webp";

// next/image solo acepta rutas propias o del backend (remotePatterns): cualquier otra URL que se escriba a mano
// rompería la vista previa, así que se reemplaza por una imagen de relleno
export function previewImage(url: string | null | undefined, fallback: string = PREVIEW_PLACEHOLDER): string {
  if (!url) return fallback;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (API_URL && url.startsWith(`${API_URL.replace(/\/$/, "")}/uploads/`)) return url;
  return fallback;
}
