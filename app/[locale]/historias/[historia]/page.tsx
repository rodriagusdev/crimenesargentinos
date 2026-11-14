import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import AfichesScreen from "@/components/historias/afiches/AfichesScreen";
import CensuradosScreen from "@/components/historias/censurados/CensuradosScreen";
import { HISTORIAS } from "@/components/historias/historias";
import ManualScreen from "@/components/historias/manual/ManualScreen";
import MapaScreen from "@/components/historias/mapa/MapaScreen";
import RadioteatroScreen from "@/components/historias/radioteatro/RadioteatroScreen";
import SeBuscaScreen from "@/components/historias/sebusca/SeBuscaScreen";
import TrailerHistoriasScreen from "@/components/historias/trailer/TrailerHistoriasScreen";
import VespertinoScreen from "@/components/historias/vespertino/VespertinoScreen";

const SCREENS: Record<string, ComponentType> = {
  trailer: TrailerHistoriasScreen,
  manual: ManualScreen,
  censurados: CensuradosScreen,
  sebusca: SeBuscaScreen,
  vespertino: VespertinoScreen,
  afiches: AfichesScreen,
  mapa: MapaScreen,
  radioteatro: RadioteatroScreen,
};

export function generateStaticParams() {
  return HISTORIAS.map((h) => ({ historia: h.id }));
}

export default async function HistoriaPage({ params }: { params: Promise<{ historia: string }> }) {
  const { historia } = await params;
  const Screen = SCREENS[historia];
  if (!Screen) notFound();
  return <Screen />;
}
