"use client";

type SubwayStationProps = {
  label: string;
  leftPct: number;
  lit: boolean;
  delayMs: number;
  terminal: boolean;
};

// Estación del plano: se enciende cuando pasa el tren; la terminal es la Central
export default function SubwayStation({ label, leftPct, lit, delayMs, terminal }: SubwayStationProps) {
  return (
    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${leftPct}%` }}>
      <span
        style={{ transitionDelay: `${delayMs}ms` }}
        className={`block rounded-full border-[3px] transition-all duration-200 ${
          terminal ? "size-6 sm:size-8" : "size-4 sm:size-5"
        } ${
          lit
            ? "bg-[#fff3c7] border-[#e8b100] shadow-[0_0_16px_rgba(232,177,0,0.9)]"
            : "bg-[#1a1f27] border-[#5c636e]"
        }`}
      />
      <span
        style={{ transitionDelay: `${delayMs}ms` }}
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap text-[6px] sm:text-[10px] tracking-widest transition-colors duration-200 [writing-mode:vertical-rl] sm:[writing-mode:horizontal-tb] ${
          lit ? "text-[#fff3c7]" : "text-[#5c636e]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
