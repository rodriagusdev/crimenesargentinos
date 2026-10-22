import type { Metadata } from "next";
import RulesBook from "@/components/rules/RulesBook";

export const metadata: Metadata = {
  title: "Cómo se juega · Crímenes Argentinos",
  description:
    "Manual de procedimientos y reglas de juego: niveles, recursos, interrogatorios, pistas y orden de arresto.",
};

export default function RulesPage() {
  return <RulesBook />;
}
