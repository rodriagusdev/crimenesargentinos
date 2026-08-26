"use client";

import { useState } from "react";
import GameButton from "../buttons/GameButton";
import RegisterForm from "./RegisterForm";
import { login } from "@/services/authService";

type RegisterAndLoginProps = {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisterAndLogin({
  setIsMenuOpen,
}: RegisterAndLoginProps) {
  const [showRegister, setShowRegister] = useState<boolean>(false);
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
      if (token.token) {
        localStorage.setItem("auth_token", token.token);
        setIsMenuOpen(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-[480px] p-8 rounded-xl"
      style={{
        background: "rgba(42, 58, 74, 0.35)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 243, 199, 0.15)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
      }}
    >
      {showRegister ? (
        <RegisterForm onBackClick={() => setShowRegister(false)} />
      ) : (
        <>
          {/* TITULO */}
          <h2
            className="mb-8 text-center text-4xl tracking-widest"
            style={{
              color: "#E1C380",
              textShadow: "0 2px 0 #1E2A36, 0 0 10px rgba(0,0,0,.8)",
            }}
          >
            🔐 ACCESO
          </h2>

          {error && (
            <div
              className="mb-4 p-3 rounded text-center text-sm"
              style={{
                background: "rgba(255, 0, 0, 0.2)",
                border: "1px solid rgba(255, 0, 0, 0.5)",
                color: "#ff6b6b",
              }}
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label
                className="text-lg flex items-center gap-2"
                style={{ color: "#FFF3C7" }}
              >
                <span>✉️</span>
                Email
              </label>

              <input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="px-4 py-3 rounded-[50px]"
                style={{
                  background: "rgba(255, 243, 199, 0.85)",
                  border: "1px solid #5D584D",
                  color: "#2A2A2A",
                  opacity: loading ? 0.5 : 1,
                }}
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-2">
              <label
                className="text-lg flex items-center gap-2"
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
                className="px-4 py-3 rounded-[50px]"
                style={{
                  background: "rgba(255, 243, 199, 0.85)",
                  border: "1px solid #5D584D",
                  color: "#2A2A2A",
                  opacity: loading ? 0.5 : 1,
                }}
              />
            </div>

            {/* LOGIN */}
            <GameButton
              icon="🚪"
              label={loading ? "INGRESANDO..." : "ENTRAR"}
              onClick={handleLogin}
              disabled={loading}
            />

            {/* REGISTER */}
            <GameButton
              icon="📜"
              label="REGISTRAR"
              variant="secondary"
              onClick={() => setShowRegister(true)}
              disabled={loading}
            />
          </div>
        </>
      )}
    </div>
  );
}
