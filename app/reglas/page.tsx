import type { Metadata } from "next";
import RulesBook from "@/components/rules/RulesBook";

export const metadata: Metadata = {
  title: "Cómo se juega · Crímenes Argentinos",
  description:
    "Manual de procedimientos y reglas de juego: niveles, recursos, interrogatorios, pistas y orden de arresto.",
};

// ?desde=principal: se abrió desde la pantalla de casos, así que al cerrar vuelve ahí (si no, al login)
export default async function RulesPage({ searchParams }: PageProps<"/reglas">) {
  const { desde } = await searchParams;
  return <RulesBook returnTo={desde === "principal" ? "/principal" : "/login"} />;
}
