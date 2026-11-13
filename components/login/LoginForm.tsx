"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GameButton from "../buttons/GameButton";
import { login } from "@/services/authService";
import { isAdmin } from "@/lib/auth";
import { markSplashPending } from "@/lib/splashStorage";
import { useT } from "@/hooks/useT";
import { loginFormMessages } from "./LoginForm.messages";

type LoginFormProps = {
  onRegisterClick: () => void;
};

export default function LoginForm({ onRegisterClick }: LoginFormProps) {
  const router = useRouter();
  const t = useT(loginFormMessages);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t("missingFields"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await login({ email, password });
      if (token?.token) {
        localStorage.setItem("auth_token", token.token);
        // Los administradores van al panel; los jugadores, al juego (con el splash de bienvenida)
        if (isAdmin()) {
          router.push("/admin");
        } else {
          markSplashPending();
          router.push("/principal");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? t("wrongCredentials") : t("loginError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* TÍTULO */}
      <h2
        className="mb-4 text-center text-2xl tracking-widest"
        style={{
          color: "#E1C380",
          textShadow: "0 2px 0 #1E2A36, 0 0 10px rgba(0,0,0,.8)",
        }}
      >
        {t("title")}
      </h2>

      {error && (
        <div
          className="mb-2 p-3 rounded text-center text-sm"
          style={{
            background: "rgba(255, 0, 0, 0.2)",
            border: "1px solid rgba(255, 0, 0, 0.5)",
            color: "#ff6b6b",
          }}
        >
          {error}
        </div>
      )}

      {/* EMAIL */}
      <div className="flex flex-col gap-2">
        <label
          className="text-md flex items-center gap-2"
          style={{ color: "#FFF3C7" }}
        >
          <span>✉️</span>
          {t("emailLabel")}
        </label>
        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="px-4 py-3 rounded-2xl text-base sm:text-sm"
          style={{
            background: "rgba(255, 243, 199, 0.85)",
            border: "1px solid #5D584D",
            color: "#2A2A2A",
            opacity: loading ? 0.5 : 1,
          }}
        />
      </div>

      {/* CONTRASEÑA */}
      <div className="flex flex-col gap-2">
        <label
          className="text-md flex items-center gap-2"
          style={{ color: "#FFF3C7" }}
        >
          <span>🔑</span>
          {t("passwordLabel")}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
            className="w-full pl-4 pr-12 py-3 rounded-2xl text-base sm:text-sm"
            style={{
              background: "rgba(255, 243, 199, 0.85)",
              border: "1px solid #5D584D",
              color: "#2A2A2A",
              opacity: loading ? 0.5 : 1,
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={loading}
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            aria-pressed={showPassword}
            title={showPassword ? t("hidePassword") : t("showPassword")}
            className="absolute inset-y-0 right-2 my-auto size-9 flex items-center justify-center rounded-xl text-lg cursor-pointer hover:bg-black/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <GameButton
        icon="🚪"
        label={loading ? t("entering") : t("enter")}
        onClick={handleLogin}
        disabled={loading}
      />

      <GameButton
        icon="📜"
        label={t("register")}
        variant="primary"
        onClick={onRegisterClick}
        disabled={loading}
      />
    </div>
  );
}
