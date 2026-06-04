import { useTypewriterSound } from "@/hooks/useTypewriterSound";

type RegisterAndLoginProps = {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisterAndLogin({
  setIsMenuOpen,
}: RegisterAndLoginProps) {
  const playSound = useTypewriterSound();

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
        <button
          onMouseEnter={playSound}
          onClick={enterGame}
          className="relative group mt-4 w-full py-4 text-xl modern-button flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(42,58,74,0.95), rgba(42,58,74,0.75))",
            border: "1px solid rgba(69, 96, 117, 0.8)",
            color: "#FFF3C7",
            boxShadow: "inset 0 1px 0 rgba(69,96,117,0.6)",
          }}
        >
          <span className="absolute left-4 opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
            🚪
          </span>

          <span className="pointer-events-none">ENTRAR</span>
        </button>

        {/* REGISTER */}
        <button
          onMouseEnter={playSound}
          className="relative group w-full py-4 text-xl modern-button flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(93,88,77,0.85), rgba(93,88,77,0.6))",
            border: "1px solid rgba(61, 58, 53, 0.9)",
            color: "#FFF3C7",
          }}
        >
          <span className="absolute left-4 opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
            📜
          </span>

          <span className="pointer-events-none">REGISTRAR</span>
        </button>
      </div>
    </div>
  );
}
