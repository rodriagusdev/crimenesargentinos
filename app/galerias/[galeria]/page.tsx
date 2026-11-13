import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import AlbumScreen from "@/components/galeria/album/AlbumScreen";
import DiarioEdicionScreen from "@/components/galeria/diario/DiarioEdicionScreen";
import FicheroScreen from "@/components/galeria/fichero/FicheroScreen";
import { GALERIAS } from "@/components/galeria/galerias";
import MuroScreen from "@/components/galeria/muro/MuroScreen";
import RuedaScreen from "@/components/galeria/rueda/RuedaScreen";

const SCREENS: Record<string, ComponentType> = {
  album: AlbumScreen,
  fichero: FicheroScreen,
  muro: MuroScreen,
  rueda: RuedaScreen,
  diario: DiarioEdicionScreen,
};

export function generateStaticParams() {
  return GALERIAS.map((g) => ({ galeria: g.id }));
}

export default async function GaleriaPage({ params }: { params: Promise<{ galeria: string }> }) {
  const { galeria } = await params;
  const Screen = SCREENS[galeria];
  if (!Screen) notFound();
  return <Screen />;
}
