// components/login/RegisterForm.tsx
"use client";

import { useState } from "react";
import GameButton from "../buttons/GameButton";
import { register } from "@/services/authService";
import { useT } from "@/hooks/useT";
import { registerFormMessages } from "./RegisterForm.messages";

type RegisterFormProps = {
  onBackClick: () => void;
};

export default function RegisterForm({ onBackClick }: RegisterFormProps) {
  const t = useT(registerFormMessages);
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async () => {
    if (!email || !userName || !password) {
      setError(t("missingFields"));
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("invalidEmail"));
      return;
    }

    // Validar userName
    if (userName.length < 3) {
      setError(t("userNameTooShort"));
      return;
    }

    if (userName.length > 50) {
      setError(t("userNameTooLong"));
      return;
    }

    const userNameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!userNameRegex.test(userName)) {
      setError(t("userNameChars"));
      return;
    }

    // Validar password
    if (password.length < 8) {
      setError(t("passwordTooShort"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register({ email, userName, password });
      setSuccess(true);
      setTimeout(() => {
        onBackClick();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("registerError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2
        className="text-center text-3xl sm:text-4xl tracking-widest"
        style={{
          color: "#E1C380",
          textShadow: "0 2px 0 #1E2A36, 0 0 10px rgba(0,0,0,.8)",
        }}
      >
        {t("title")}
      </h2>

      {success && (
        <div
          className="p-3 rounded text-center text-sm"
          style={{
            background: "rgba(0, 255, 0, 0.2)",
            border: "1px solid rgba(0, 255, 0, 0.5)",
            color: "#00ff00",
          }}
        >
          {t("success")}
        </div>
      )}

      {error && (
        <div
          className="p-3 rounded text-center text-sm"
          style={{
            background: "rgba(255, 0, 0, 0.2)",
            border: "1px solid rgba(255, 0, 0, 0.5)",
            color: "#ff6b6b",
          }}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label
          className="text-lg flex items-center gap-2"
          style={{ color: "#FFF3C7" }}
        >
          <span>✉️</span>
          {t("emailLabel")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder={t("emailPlaceholder")}
          className="px-4 py-3 rounded-[50px]"
          style={{
            background: "rgba(255, 243, 199, 0.85)",
            border: "1px solid #5D584D",
            color: "#2A2A2A",
            opacity: loading ? 0.5 : 1,
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-lg flex items-center gap-2"
          style={{ color: "#FFF3C7" }}
        >
          <span>👤</span>
          {t("userNameLabel")}
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={loading}
          placeholder={t("userNamePlaceholder")}
          className="px-4 py-3 rounded-[50px]"
          style={{
            background: "rgba(255, 243, 199, 0.85)",
            border: "1px solid #5D584D",
            color: "#2A2A2A",
            opacity: loading ? 0.5 : 1,
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-lg flex items-center gap-2"
          style={{ color: "#FFF3C7" }}
        >
          <span>🔑</span>
          {t("passwordLabel")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder={t("passwordPlaceholder")}
          className="px-4 py-3 rounded-[50px]"
          style={{
            background: "rgba(255, 243, 199, 0.85)",
            border: "1px solid #5D584D",
            color: "#2A2A2A",
            opacity: loading ? 0.5 : 1,
          }}
        />
      </div>

      <GameButton
        icon="✓"
        label={loading ? t("registering") : t("createAccount")}
        onClick={handleRegister}
        disabled={loading}
      />

      <GameButton
        icon="◄"
        label={t("back")}
        variant="secondary"
        onClick={onBackClick}
        disabled={loading}
      />
    </div>
  );
}