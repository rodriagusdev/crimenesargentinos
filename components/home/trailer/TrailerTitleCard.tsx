"use client";

// Cartel de texto entre escenas, como en los tráileres: aparece, se sostiene y se va con la duración de la escena
export default function TrailerTitleCard({ text, ms, accent = false }: { text: string; ms: number; accent?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6 bg-black">
      <p
        style={{ animationDuration: `${ms}ms` }}
        className={`home-titlecard text-center leading-relaxed tracking-[0.2em] ${
          accent ? "text-xl sm:text-3xl text-[#E1C380]" : "text-base sm:text-2xl text-[#FFF3C7]"
        } [text-shadow:0_0_24px_rgba(225,195,128,0.35)]`}
      >
        {text}
      </p>
    </div>
  );
}
