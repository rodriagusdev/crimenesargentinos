"use client";

import { useTypewriterSound } from "@/hooks/useTypewriterSound";
import { useRouter } from "next/navigation";
import GameButton from "../GameButton";
export default function PrincipalMenu() {
  const playSound = useTypewriterSound();
  const router = useRouter();

  return (
    <div
      className="w-120 p-8 rounded-xl"
      style={{
        background: "rgba(42, 58, 74, 0.35)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 243, 199, 0.15)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
      }}
    >
      <h2
        className="mb-8 text-center text-4xl tracking-widest"
        style={{
          color: "#E1C380",
          textShadow: "0 2px 0 #1E2A36, 0 0 10px rgba(0,0,0,.8)",
        }}
      >
        MENU PRINCIPAL
      </h2>

      <div className="flex flex-col gap-4">
        {/* CONTINUAR */}
        <GameButton
          icon="🗺️"
          label="CONTINUAR"
          onClick={() => router.push("/")}
        />

        {/* NUEVA PARTIDA */}
        <GameButton icon="📁" label="NUEVA PARTIDA" />

        {/* OPCIONES */}
        <GameButton icon="⚙️" label="OPCIONES" />
      </div>
    </div>
  );
}
