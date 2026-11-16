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
    <>
      <HomeNav className="bg-[#070c16]" />
      <FicheroScreen showPreviewToggle={false} />
    </>
  );
}
