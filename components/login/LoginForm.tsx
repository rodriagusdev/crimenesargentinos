"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GameButton from "../buttons/GameButton";
import { login } from "@/services/authService";

type LoginFormProps = {
  onRegisterClick: () => void;
};

export default function LoginForm({ onRegisterClick }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await login({ email, password });
      if (token?.token) {
        localStorage.setItem("auth_token", token.token);
        router.push("/principal");
      }
    } catch (err) {
      setError(
        err instanceof Error ? "El email y/o la contraseña son incorrectos" : "Error al iniciar sesión"
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
        LOGIN
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
          Ingrese su email
        </label>
        <input
          type="email"
          placeholder="usuario@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="px-4 py-3 rounded-2xl text-sm"
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
          Contraseña
        </label>
        <input
          type="password"
          placeholder="Ingrese contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="px-4 py-3 rounded-2xl text-sm"
          style={{
            background: "rgba(255, 243, 199, 0.85)",
            border: "1px solid #5D584D",
            color: "#2A2A2A",
            opacity: loading ? 0.5 : 1,
          }}
        />
      </div>

      {/* BOTONES DE ACCIÓN */}
      <GameButton
        icon="🚪"
        label={loading ? "INGRESANDO..." : "ENTRAR"}
        onClick={handleLogin}
        disabled={loading}
      />

      <GameButton
        icon="📜"
        label="REGISTRAR"
        variant="primary"
        onClick={onRegisterClick}
        disabled={loading}
      />
    </div>
  );
}
