import type { Metadata } from "next";
import HomeNav from "@/components/home/HomeNav";
import TrailerHistoriasScreen from "@/components/historias/trailer/TrailerHistoriasScreen";

export const metadata: Metadata = {
  title: "Casos · Crímenes Argentinos",
  description: "Los casos de Crímenes Argentinos: un tráiler por caso, sin pistas. El resto del expediente se abre al jugar.",
};

// Página pública de presentación de los casos: la videoteca con un tráiler por caso
export default function CasosPage() {
  return (
    <>
      <HomeNav className="bg-[#070c16]" />
      <TrailerHistoriasScreen />
    </>
  );
}
