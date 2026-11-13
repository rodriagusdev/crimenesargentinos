"use client";

export type Conventillo = {
  color: string; // color de la chapa
  trim: string; // color de marcos y persianas
  heightPct: number;
  widthPct: number;
  windows: number;
};

// Fachada de conventillo de chapa acanalada con persianas y balcón de hierro
export default function ConventilloHouse({ house, lit }: { house: Conventillo; lit: boolean }) {
  return (
    <div
      className="relative shrink-0 self-end border-x-2 border-black/40"
      style={{
        width: `${house.widthPct}%`,
        height: `${house.heightPct}%`,
        backgroundColor: house.color,
        backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 9px)",
      }}
    >
      {/* Techo */}
      <div className="absolute -top-2 -inset-x-1 h-2 bg-[#2a2420]" />

      {/* Ventanas con persianas */}
      <div className="absolute top-[14%] inset-x-[10%] flex justify-around">
        {Array.from({ length: house.windows }, (_, i) => (
          <span
            key={i}
            className="block w-[18%] aspect-[2/3] border-2"
            style={{
              borderColor: house.trim,
              background: lit && i % 2 === 0 ? "#f3c46b" : "#14110e",
              boxShadow: lit && i % 2 === 0 ? "0 0 14px rgba(243,196,107,0.6)" : undefined,
            }}
          />
        ))}
      </div>

      {/* Balcón */}
      <div className="absolute top-[46%] inset-x-[6%] h-[8%] border-t-2 border-b-2 border-[#15110e] bg-[repeating-linear-gradient(90deg,#15110e_0_2px,transparent_2px_7px)]" />

      {/* Puerta */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[24%] h-[30%] border-2 bg-[#1d1915]" style={{ borderColor: house.trim }} />

      {/* Sombra de la noche */}
      <div className="absolute inset-0 bg-[#060912]/55" />
    </div>
  );
}
