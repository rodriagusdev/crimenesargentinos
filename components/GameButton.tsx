import { useTypewriterSound } from "@/hooks/useTypewriterSound";

type GameButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function GameButton({
  icon,
  label,
  onClick,
  variant = "primary",
}: GameButtonProps) {
  const baseStyle =
    variant === "primary"
      ? {
          background:
            "linear-gradient(180deg, rgba(42,58,74,0.95), rgba(42,58,74,0.75))",
          border: "1px solid rgba(69, 96, 117, 0.8)",
          color: "#FFF3C7",
          boxShadow: "inset 0 1px 0 rgba(69,96,117,0.6)",
        }
      : {
          background:
            "linear-gradient(180deg, rgba(93,88,77,0.85), rgba(93,88,77,0.6))",
          border: "1px solid rgba(61, 58, 53, 0.9)",
          color: "#FFF3C7",
        };

  return (
    <button
      onClick={onClick}
      onMouseEnter={useTypewriterSound()}
      className="relative group w-full py-4 text-xl modern-button flex items-center justify-center"
      style={baseStyle}
    >
      <span className="absolute left-4 opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 icon-float">
        {icon}
      </span>

      <span className="pointer-events-none">{label}</span>
    </button>
  );
}