import Link from "next/link";

// Botón persistente para volver a la galería desde cualquier portada
export default function PortadaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Link
        href="/portadas"
        className="fixed top-24 right-4 z-30 px-4 py-3 rounded-xl bg-[#070c16]/90 border border-[#E1C380]/60 text-[#FFF3C7] text-[9px] shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:border-[#E1C380] hover:text-[#E1C380] backdrop-blur-sm"
      >
        ← PORTADAS
      </Link>
    </>
  );
}
