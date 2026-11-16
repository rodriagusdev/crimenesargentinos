import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import HomeScreen from "@/components/home/HomeScreen";
import DiarioScreen from "@/components/home/diario/DiarioScreen";
import PizarraScreen from "@/components/home/pizarra/PizarraScreen";
import { PORTADAS } from "@/components/home/portadas";
import RelampagoScreen from "@/components/home/relampago/RelampagoScreen";
import TrailerScreen from "@/components/home/trailer/TrailerScreen";

const SCREENS: Record<string, ComponentType> = {
  mesa: HomeScreen,
  trailer: TrailerScreen,
  diario: DiarioScreen,
  pizarra: PizarraScreen,
  relampago: RelampagoScreen,
};

export function generateStaticParams() {
  return PORTADAS.map((p) => ({ portada: p.id }));
}

export default async function PortadaPage({ params }: { params: Promise<{ portada: string }> }) {
  const { portada } = await params;
  const Screen = SCREENS[portada];
  if (!Screen) notFound();
  return <Screen />;
}
