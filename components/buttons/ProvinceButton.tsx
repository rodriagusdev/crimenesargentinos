import Image from "next/image";

interface Props {
  label: string;
  icon: string;
  top?: string;
  left?: string;
  isCurrent?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
}

export function ProvinceButton({
  label,
  icon,
  top,
  left,
  isCurrent = false,
  onClick,
  onMouseEnter,
}: Props) {
  return (
    <div
      style={{ top, left }}
      onMouseEnter={onMouseEnter}
      className="
        absolute
        -translate-x-1/2 -translate-y-1/2
        flex flex-col items-center
        gap-1.5
        z-20
      "
    >
      {/* Badge de ubicación actual */}
      {isCurrent && (
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-mono font-extrabold text-[9px] sm:text-[10px] tracking-wider uppercase shadow-[0_0_18px_rgba(245,158,11,0.9)] border border-amber-200 animate-bounce select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
          <span>ESTÁS ACÁ</span>
        </div>
      )}

      {/* Icono con halo animado si es la provincia actual */}
      <div
        className={`
          relative
          w-20 h-20
          flex items-center justify-center
          rounded-full
          backdrop-blur-sm
          transition-transform duration-150
          hover:scale-110 active:scale-95
          cursor-pointer
          ${
            isCurrent
              ? "bg-[rgba(55,42,25,0.92)] border-2 border-amber-300 ring-4 ring-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.7)]"
              : "bg-[rgba(42,58,74,0.85)] border border-[#E1C380]/40 shadow-lg"
          }
        `}
      >
        {isCurrent && (
          <span className="absolute -inset-1 rounded-full border-2 border-amber-400/60 animate-ping pointer-events-none" />
        )}
        <Image
          src={icon}
          alt={label}
          width={56}
          height={56}
          className="object-contain"
          onClick={onClick}
        />
      </div>

      {/* Botón */}
      <button
        onClick={onClick}
        className={`
          px-3 py-1.5
          rounded-md
          text-[11px]
          transition-all duration-150
          active:scale-95
          shadow-md
          whitespace-nowrap
          cursor-pointer
          ${
            isCurrent
              ? "bg-[rgba(65,48,22,0.95)] border-2 border-amber-400 text-amber-200 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              : "bg-[rgba(42,58,74,0.9)] border border-[#E1C380]/40 text-[#FFF3C7] hover:bg-[rgba(42,58,74,1)] hover:border-[#E1C380]"
          }
        `}
      >
        {label}
      </button>
    </div>
  );
}