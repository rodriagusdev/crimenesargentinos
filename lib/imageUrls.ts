/**
 * Los fondos de diálogo (/images/dialogbackground/...) se convirtieron de .jpg a .webp (scripts/convert-dialogbackgrounds.js),
 * pero algunos registros de la base todavía guardan la ruta vieja en .jpg. Esta función devuelve la ruta que existe.
 */
export function resolveImageUrl(url: string): string;
export function resolveImageUrl(url: string | null | undefined): string | null | undefined;
export function resolveImageUrl(url: string | null | undefined) {
  if (!url || !url.includes("/dialogbackground/")) return url;
  return url.replace(/\.jpe?g$/i, ".webp");
}
