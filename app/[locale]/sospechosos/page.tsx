import type { Metadata } from "next";
import HomeNav from "@/components/home/HomeNav";
import FicheroScreen from "@/components/galeria/fichero/FicheroScreen";

export const metadata: Metadata = {
  title: "Sospechosos · Crímenes Argentinos",
  description: "El fichero de la Central: todos los sospechosos de Crímenes Argentinos, release por release.",
};

// Página pública con los sospechosos de cada release (el fichero de la galería, sin el botón de simulación)
export default function SospechososPage() {
  return (
    // La barra va dentro del fichero, transparente, para que tenga exactamente el mismo fondo que la página
    <FicheroScreen showPreviewToggle={false} header={<HomeNav transparent />} />
  );
}
