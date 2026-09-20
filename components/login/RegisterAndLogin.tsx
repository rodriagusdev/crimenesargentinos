"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type RegisterAndLoginProps = {
  setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisterAndLogin({
  setIsMenuOpen,
}: RegisterAndLoginProps) {
  const [showRegister, setShowRegister] = useState<boolean>(false);

  return (
    <div
      className="w-[480px] p-6 rounded-2xl"
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
