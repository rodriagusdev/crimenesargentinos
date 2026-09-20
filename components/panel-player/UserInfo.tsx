"use client";

import { useEffect, useState } from "react";
import InfoItem from "./UserInfoItem";

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
  }, []);
  return (
    <section
      className="
        w-full mx-auto
        rounded-2xl
        overflow-hidden
        backdrop-blur-xs
        border border-[rgba(255,243,199,0.18)]
        shadow-[0_20px_50px_rgba(0,0,0,0.6)]
        text-[#FFF3C7]
      "
    >
      <div className="p-5 border-b border-[rgba(255,243,199,0.12)]">
        <h2
          className="
            text-center
            text-[#E1C380]
            text-xs sm:text-sm
            font-semibold
            tracking-widest
          "
        >
          JUGADOR
        </h2>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-6 text-center">
          <div
            className="
              mx-auto mb-4
              w-20 h-20
              rounded-2xl
              flex items-center justify-center
              bg-[rgba(20,30,42,0.6)]
              backdrop-blur-xs
              border border-[rgba(255,243,199,0.18)]
              shadow-[0_10px_25px_rgba(0,0,0,0.5)]
            "
          >
            <span className="text-[#E1C380] font-bold text-xl tracking-wider">
              {user.username
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase())
                .join("")
                .slice(0, 2)}
            </span>
          </div>

          <h3 className="text-[#FFF3C7] text-xs font-semibold tracking-widest uppercase">
            {user.username}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="NIVEL" value={user.level} />
          <InfoItem label="PUNTOS" value={user.points.toLocaleString()} />
          <InfoItem label="JUEGOS" value={user.gamesPlayed} />
          <InfoItem
            label="MEJOR PUNTUACION"
            value={user.highScore.toLocaleString()}
          />
        </div>
      </div>
    </section>
  );
}
