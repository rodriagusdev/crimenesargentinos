interface Props {
  label: string;
  top?: string;
  left?: string;
  onClick: () => void;
}

export function ProvinceButton({ label, top, left, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{ top, left }}
      className="
        absolute
        -translate-x-1/2 -translate-y-1/2
        px-6 py-3
        bg-[rgba(42,58,74,0.85)]
        border border-[#E1C380]/40
        rounded-lg
        text-xs text-[#FFF3C7]
        hover:bg-[rgba(42,58,74,1)]
        hover:border-[#E1C380]
        hover:scale-105
        transition-all
        backdrop-blur-sm
        shadow-lg
      "
    >
      {label}
    </button>
  );
}
