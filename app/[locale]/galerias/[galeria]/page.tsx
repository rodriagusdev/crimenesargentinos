import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import AlbumScreen from "@/components/galeria/album/AlbumScreen";
import ArribosScreen from "@/components/galeria/arribos/ArribosScreen";
import CarteleraScreen from "@/components/galeria/cartelera/CarteleraScreen";
import DiarioEdicionScreen from "@/components/galeria/diario/DiarioEdicionScreen";
import EstampillasScreen from "@/components/galeria/estampillas/EstampillasScreen";
import FicheroScreen from "@/components/galeria/fichero/FicheroScreen";
import { GALERIAS } from "@/components/galeria/galerias";
import GuiaScreen from "@/components/galeria/guia/GuiaScreen";
import MonitoresScreen from "@/components/galeria/monitores/MonitoresScreen";
import MuroScreen from "@/components/galeria/muro/MuroScreen";
import NaipesScreen from "@/components/galeria/naipes/NaipesScreen";
import RuedaScreen from "@/components/galeria/rueda/RuedaScreen";

const SCREENS: Record<string, ComponentType> = {
  album: AlbumScreen,
  fichero: FicheroScreen,
  muro: MuroScreen,
  rueda: RuedaScreen,
  diario: DiarioEdicionScreen,
  arribos: ArribosScreen,
  estampillas: EstampillasScreen,
  naipes: NaipesScreen,
  cartelera: CarteleraScreen,
  monitores: MonitoresScreen,
  guia: GuiaScreen,
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
