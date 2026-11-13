"use client";

type Props = {
  frequency: number;
  emoji: string;
  title: string;
  active: boolean;
  onTune: () => void;
};

// Marca del dial: la frecuencia del capítulo; al tocarla se sintoniza
export default function DialMark({ frequency, emoji, title, active, onTune }: Props) {
  return (
    <button
      type="button"
      onClick={onTune}
      aria-label={`Sintonizar ${title}`}
      aria-pressed={active}
      className={`group relative flex flex-1 flex-col items-center gap-0.5 pt-1 outline-none ${active ? "text-[#7a1a0a]" : "text-[#4a2c14]"}`}
    >
      <span className={`block w-px ${active ? "h-3 bg-[#7a1a0a]" : "h-2 bg-[#4a2c14]/70"}`} aria-hidden />
      <span className="text-[7px] sm:text-[9px] font-mono font-bold leading-none group-hover:underline group-focus-visible:underline">
        {frequency}
      </span>
      <span className={`text-xs sm:text-sm leading-none transition-transform ${active ? "scale-125" : "opacity-70 group-hover:opacity-100"}`} aria-hidden>
        {emoji}
      </span>
    </button>
  );
}
