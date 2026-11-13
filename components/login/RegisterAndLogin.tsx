"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type RegisterAndLoginProps = {
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisterAndLogin({
  setIsMenuOpen,
}: RegisterAndLoginProps) {
  // /login?registro abre directo el formulario de registro (lo usa el botón REGISTRARSE de la home)
  const searchParams = useSearchParams();
  const [showRegister, setShowRegister] = useState<boolean>(() => searchParams.has("registro"));

  return (
    <div
      className="w-full max-w-[480px] p-5 sm:p-6 rounded-2xl"
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
        <LoginForm onRegisterClick={() => setShowRegister(true)} />
      )}
    </div>
  );
}
