"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import InfoItem from "./UserInfoItem";
import { getPlayerStats } from "@/services/gameSessionService";
import { useAvatarStore } from "@/stores/useAvatarStore";
import { audioManager } from "@/lib/audioManager";
import AvatarPickerModal from "./AvatarPickerModal";
import { useT } from "@/hooks/useT";
import { useLocale } from "@/stores/useLocaleStore";
import { userInfoMessages } from "./UserInfo.messages";

interface UserData {
  username: string | null; // null: cargando; "": sin nombre en el token
  level: number;
  points: number;
  gamesPlayed: number;
  highScore: number;
}

export default function UserInfo() {
  const currentAvatar = useAvatarStore((state) => state.currentAvatar);
  const initAvatar = useAvatarStore((state) => state.initAvatar);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const t = useT(userInfoMessages);
  const numberLocale = useLocale() === "en" ? "en-US" : "es-AR";

  const [user, setUser] = useState<UserData>({
    username: null,
    level: 0,
    points: 0,
    gamesPlayed: 0,
    highScore: 0,
  });

  useEffect(() => {
    void initAvatar();

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
          "";

        setUser((prevUser) => ({
          ...prevUser,
          username: username,
        }));
      } catch (error) {
        console.error("Error decodificando token:", error);
        setUser((prevUser) => ({
          ...prevUser,
          username: "",
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
          {t("title")}
        </h3>
      </div>

      {/* 2. Cuerpo de perfil y avatar */}
      <div className="p-4 sm:p-5 flex flex-col items-center justify-center bg-[#0c1421]">
        {/* Foto de perfil del detective: tamaño equilibrado (~175px / w-44 h-44) */}
        <div
          onClick={() => {
            audioManager.play("click");
            setIsPickerOpen(true);
          }}
          className="group/avatar relative mb-3 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#1b2536] to-[#0e1724] border-2 border-amber-400/50 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all duration-200 cursor-pointer"
          title={t("changePhotoTitle")}
        >
          {currentAvatar ? (
            <Image
              src={currentAvatar}
              alt={t("avatarAlt")}
              fill
              sizes="176px"
              priority
              className="object-cover rounded-2xl transition-transform duration-200 group-hover/avatar:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 group-hover/avatar:text-amber-300 transition-colors">
              <svg className="w-20 h-20 opacity-75" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
              <span className="font-mono text-[10px] sm:text-[9px] tracking-widest uppercase mt-1.5 opacity-80 text-amber-300/80 font-bold">
                {t("noPhoto")}
              </span>
            </div>
          )}

          <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#0c1421] border border-amber-400/70 flex items-center justify-center text-xs shadow-md select-none z-20">
            ⭐
          </div>
        </div>

        {/* Botón CAMBIAR ubicado abajo de la tarjeta de foto */}
        <button
          type="button"
          onClick={() => {
            audioManager.play("click");
            setIsPickerOpen(true);
          }}
          className="
            mb-3 w-36 sm:w-44 py-2.5 sm:py-2 px-4 rounded-xl border border-amber-400/60 bg-[#0e1724]
            hover:border-amber-400 hover:bg-amber-400/15 hover:text-amber-200
            text-amber-400 font-mono text-xs font-bold tracking-widest uppercase
            shadow-sm hover:shadow-[0_0_14px_rgba(245,158,11,0.3)]
            transition-all duration-150 cursor-pointer flex items-center justify-center gap-2
          "
        >
          <span>📸</span>
          <span>{t("change")}</span>
        </button>

        <h3 className="font-mono font-bold text-sm sm:text-base tracking-wider uppercase text-[#f1f5f9] text-center truncate max-w-full">
          {user.username === null ? t("loading") : user.username || t("user")}
        </h3>
      </div>

      <AvatarPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
      />

      {/* 3. Estadísticas del jugador */}
      <div className="p-3 bg-[#080d15]/60 border-t border-[#1c2c3e]/80">
        <div className="grid grid-cols-2 gap-2">
          <InfoItem label={t("level")} value={user.level} />
          <InfoItem label={t("points")} value={user.points.toLocaleString(numberLocale)} />
          <InfoItem label={t("games")} value={user.gamesPlayed} />
          <InfoItem label={t("record")} value={user.highScore.toLocaleString(numberLocale)} />
        </div>
      </div>
    </div>
  );
}

