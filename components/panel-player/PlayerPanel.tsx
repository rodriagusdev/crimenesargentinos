"use client";

import Image from "next/image";
import UserInfo from "./UserInfo";
import GameButton from "../buttons/GameButton";
import { useAuth } from "@/hooks/useAuth";

export default function PlayerPanel() {
  const { logout } = useAuth();

  return (
    <div
      className="
        flex flex-col
        w-full
        gap-4
      "
    >
      {/* USER INFO */}
      <div className="order-2 lg:order-1">
        <UserInfo />
      </div>

      {/* BOTON ABANDONAR */}
      <div className="order-3">
        <GameButton
          icon="🚪"
          label="ABANDONAR"
          variant="secondary"
          className="w-full"
          onClick={logout}
        />
      </div>

      {/* GAME LOGO */}
      <div
        className="
          order-1 md:order-1 lg:order-2
          flex justify-center items-center
          p-4
        "
      >
        <Image
          src="/images/logofinal.png"
          alt="Game Logo"
          width={240}
          height={240}
          priority
          className="
            h-auto
            object-contain
            opacity-90
            hover:opacity-100
            transition
            drop-shadow-[0_0_10px_rgba(225,195,128,0.25)]
          "
        />
      </div>
    </div>
  );
}