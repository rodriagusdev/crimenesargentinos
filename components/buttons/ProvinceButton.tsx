import Image from "next/image";

interface Props {
  label: string;
  icon: string;
  top?: string;
  left?: string;
  onClick: () => void;
}

export function ProvinceButton({
  label,
  icon,
  top,
  left,
  onClick,
}: Props) {
  return (
    <div
      style={{ top, left }}
      className="
        absolute
        -translate-x-1/2 -translate-y-1/2
        flex flex-col items-center
        gap-1.5
      "
    >
      {/* Icono */}
      <div
        className="
          w-20 h-20
          flex items-center justify-center
          rounded-full
          bg-[rgba(42,58,74,0.85)]
          border border-[#E1C380]/40
          shadow-lg
          backdrop-blur-sm
          transition-transform
          hover:scale-110
        "
      >
        <Image
          src={icon}
          alt=""
          width={56}
          height={56}
          className="object-contain"
          onClick={onClick}
        />
      </div>

      {/* Botón */}
      <button
        onClick={onClick}
        className="
          px-3 py-1.5
          bg-[rgba(42,58,74,0.9)]
          border border-[#E1C380]/40
          rounded-md
          text-[11px] text-[#FFF3C7]
          hover:bg-[rgba(42,58,74,1)]
          hover:border-[#E1C380]
          transition-all
          shadow-md
          whitespace-nowrap
        "
      >
        {label}
      </button>
    </div>
  );
}