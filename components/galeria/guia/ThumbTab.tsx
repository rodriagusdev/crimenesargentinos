type Props = { label: string; target?: string; onJump: (anchor: string) => void; vertical: boolean };

// Pestaña del uñero: salta al primer encabezado de esas letras
export default function ThumbTab({ label, target, onJump, vertical }: Props) {
  const text = label.length === 3 ? `${label[0]}–${label[2]}` : label;
  return (
    <button
      type="button"
      disabled={!target}
      onClick={() => target && onJump(target)}
      aria-label={`Ir a la ${label.split("").join(", ")}`}
      className={`font-mono text-[10px] font-bold leading-none transition-transform ${
        vertical ? "w-full rounded-l-md py-1.5 enabled:hover:-translate-x-1" : "rounded-md px-2 py-1.5 enabled:hover:-translate-y-0.5"
      } ${target ? "bg-[#1b1813] text-[#f7f2e2] cursor-pointer" : "bg-[#1b1813]/25 text-[#1b1813]/40 cursor-default"}`}
    >
      {text}
    </button>
  );
}
