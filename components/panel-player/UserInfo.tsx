"use client";

import { useEffect, useState } from "react";
import InfoItem from "./UserInfoItem";
import { getPlayerStats } from "@/services/gameSessionService";

interface UserData {
  username: string;
  level: number;
  points: number;
  gamesPlayed: number;
  highScore: number;
}

export default function UserInfo() {
  const [user, setUser] = useState<UserData>({
    username: "Cargando...",
    level: 0,
    points: 0,
    gamesPlayed: 0,
    highScore: 0,
  });

  useEffect(() => {
    // Decodificar JWT para obtener el username
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        // El JWT tiene formato: header.payload.signature
        const parts = token.split(".");
        if (parts.length !== 3) {
          throw new Error("Token JWT inválido");
        }

        // Agregar padding si es necesario para base64
        let payloadBase64 = parts[1];
        const padding = 4 - (payloadBase64.length % 4);
        if (padding !== 4) {
          payloadBase64 += "=".repeat(padding);
        }

        const decodedPayload = JSON.parse(atob(payloadBase64));

        // El username está en el claim ClaimTypes.Name de .NET
        const username =
          decodedPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
          decodedPayload.unique_name ||
          decodedPayload.sub ||
          "Usuario";

        setUser((prevUser) => ({
          ...prevUser,
          username: username,
        }));
      } catch (error) {
        console.error("Error decodificando token:", error);
        setUser((prevUser) => ({
          ...prevUser,
          username: "Usuario",
        }));
      }
    }

    // Nivel, puntos y partidas salen del progreso guardado en el servidor
    let cancelled = false;
    getPlayerStats()
      .then((stats) => {
        if (!cancelled) setUser((prevUser) => ({ ...prevUser, ...stats }));
      })
      .catch((error) => console.error("Error al obtener las estadísticas del jugador:", error));

    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border-2 border-[#1c2c3e] bg-[#0c1421] shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-300 hover:border-amber-400/40">
      {/* 1. Header con estilo táctico matching LevelCard */}
      <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-[#1c2c3e]/80 bg-[#0e1724]">
        <h3 className="font-mono font-bold text-xs sm:text-sm tracking-wider uppercase text-[#f1f5f9] text-center w-full">
          FICHA POLICIAL
        </h3>
      </div>

      {/* 2. Cuerpo de perfil y avatar */}
      <div className="p-5 flex flex-col items-center justify-center bg-[#0c1421]">
        <div className="relative mb-3 w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-b from-[#1b2536] to-[#0e1724] border-2 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <span className="font-mono font-black text-2xl text-amber-300 tracking-wider">
            {user.username
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase())
              .join("")
              .slice(0, 2) || "AG"}
          </span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0c1421] border border-amber-400/60 flex items-center justify-center text-[10px] shadow-sm select-none">
            ⭐
          </div>
        </div>

        <h3 className="font-mono font-bold text-sm sm:text-base tracking-wider uppercase text-[#f1f5f9] text-center truncate max-w-full">
          {user.username}
        </h3>
      </div>

      {/* 3. Estadísticas del jugador */}
      <div className="p-3 bg-[#080d15]/60 border-t border-[#1c2c3e]/80">
        <div className="grid grid-cols-2 gap-2">
          <InfoItem label="NIVEL" value={user.level} />
          <InfoItem label="PUNTOS" value={user.points.toLocaleString()} />
          <InfoItem label="PARTIDAS" value={user.gamesPlayed} />
          <InfoItem label="RÉCORD" value={user.highScore.toLocaleString()} />
        </div>
      </div>
    </div>
  );
}

