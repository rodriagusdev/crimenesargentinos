import GameButton from "../buttons/GameButton";

type RegisterAndLoginProps = {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisterAndLogin({
  setIsMenuOpen,
}: RegisterAndLoginProps) {

  const enterGame = () => {
    setIsMenuOpen(true);
  };

  return (
    <div
      className="w-[480px] p-8 rounded-xl"
      style={{
        background: "rgba(42, 58, 74, 0.35)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 243, 199, 0.15)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
      }}
    >
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

      <div className="flex flex-col gap-4">
        {/* USERNAME */}
        <div className="flex flex-col gap-2">
          <label
            className="text-lg flex items-center gap-2"
            style={{ color: "#FFF3C7" }}
          >
            <span>👤</span>
            Nombre de Usuario
          </label>

          <input
            type="text"
            placeholder="Ingrese usuario"
            className="px-4 py-3 modern-input"
            style={{
              background: "rgba(255, 243, 199, 0.85)",
              border: "1px solid #5D584D",
              color: "#2A2A2A",
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
            className="px-4 py-3 modern-input"
            style={{
              background: "rgba(255, 243, 199, 0.85)",
              border: "1px solid #5D584D",
              color: "#2A2A2A",
            }}
          />
        </div>

        {/* LOGIN */}
        <GameButton icon="🚪" label="ENTRAR" onClick={enterGame} />

        {/* REGISTER */}
        <GameButton icon="📜" label="REGISTRAR" variant="secondary" />
      </div>
    </div>
  );
}
