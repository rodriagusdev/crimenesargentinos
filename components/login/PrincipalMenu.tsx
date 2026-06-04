import { useTypewriterSound } from "@/hooks/useTypewriterSound";
export default function PrincipalMenu() {
  const playSound = useTypewriterSound();

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
      <h2
        className="mb-8 text-center text-4xl tracking-widest"
        style={{
          color: "#E1C380",
          textShadow: "0 2px 0 #1E2A36, 0 0 10px rgba(0,0,0,.8)",
        }}
      >
        MENU PRINCIPAL
      </h2>

      <div className="flex flex-col gap-4">
        {/* CONTINUAR */}
        <button
          onMouseEnter={playSound}
          className="relative group w-full py-4 text-xl modern-button flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(42,58,74,0.95), rgba(42,58,74,0.75))",
            border: "1px solid rgba(69, 96, 117, 0.8)",
            color: "#FFF3C7",
            boxShadow: "inset 0 1px 0 rgba(69,96,117,0.6)",
          }}
        >
          <span className="absolute left-4 opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 icon-float">
            🗺️
          </span>

          <span className="pointer-events-none">CONTINUAR</span>
        </button>

        {/* NUEVA PARTIDA */}
        <button
          onMouseEnter={playSound}
          className="relative group w-full py-4 text-xl modern-button flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(42,58,74,0.95), rgba(42,58,74,0.75))",
            border: "1px solid rgba(69, 96, 117, 0.8)",
            color: "#FFF3C7",
            boxShadow: "inset 0 1px 0 rgba(69,96,117,0.6)",
          }}
        >
          <span className="absolute left-4 opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 icon-float">
            📁
          </span>
          <span className="pointer-events-none">NUEVA PARTIDA</span>
        </button>

        {/* OPCIONES */}
        <button
          onMouseEnter={playSound}
          className="relative group w-full py-4 text-xl modern-button flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(42,58,74,0.95), rgba(42,58,74,0.75))",
            border: "1px solid rgba(69, 96, 117, 0.8)",
            color: "#FFF3C7",
            boxShadow: "inset 0 1px 0 rgba(69,96,117,0.6)",
          }}
        >
          <span className="absolute left-4 opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 icon-float">
            ⚙️
          </span>
          <span className="pointer-events-none">OPCIONES</span>
        </button>
      </div>
    </div>
  );
}
