// components/login/RegisterForm.tsx
"use client";

import { useState } from "react";
import GameButton from "../buttons/GameButton";
import { register } from "@/services/authService";

type RegisterFormProps = {
  onBackClick: () => void;
};

export default function RegisterForm({ onBackClick }: RegisterFormProps) {
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async () => {
    if (!email || !userName || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    // Validar userName
    if (userName.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }

    if (userName.length > 50) {
      setError("El nombre de usuario no puede exceder 50 caracteres");
      return;
    }

    const userNameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!userNameRegex.test(userName)) {
      setError("El nombre de usuario solo puede contener letras, números, guiones y guiones bajos");
      return;
    }

    // Validar password
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
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
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-4"
      style={{
        background: "rgba(42, 58, 74, 0.35)",
      }}
    >
      <h2
        className="text-center text-4xl tracking-widest"
        style={{
          color: "#E1C380",
          textShadow: "0 2px 0 #1E2A36, 0 0 10px rgba(0,0,0,.8)",
        }}
      >
        📝 REGISTRO
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
          ✓ Usuario registrado exitosamente. Redirigiendo...
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
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="usuario@ejemplo.com"
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
          Nombre de Usuario
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={loading}
          placeholder="nombre_usuario"
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
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="Mínimo 8 caracteres"
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
        label={loading ? "REGISTRANDO..." : "CREAR CUENTA"}
        onClick={handleRegister}
        disabled={loading}
      />

      <GameButton
        icon="◄"
        label="VOLVER AL ACCESO"
        variant="secondary"
        onClick={onBackClick}
        disabled={loading}
      />
    </div>
  );
}