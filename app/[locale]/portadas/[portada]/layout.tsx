import Link from "next/link";
import { portadasGalleryMessages } from "@/components/home/PortadasGallery.messages";
import { localeFromParam } from "@/lib/i18n/locale";

// Botón persistente para volver a la galería desde cualquier portada
export default async function PortadaLayout({ children, params }: LayoutProps<"/[locale]/portadas/[portada]">) {
  const locale = localeFromParam((await params).locale);

  return (
    <>
      {children}
      <Link
        href="/portadas"
        className="fixed top-24 right-4 z-30 px-4 py-3 rounded-xl bg-[#070c16]/90 border border-[#E1C380]/60 text-[#FFF3C7] text-[10px] shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:border-[#E1C380] hover:text-[#E1C380] backdrop-blur-sm"
      >
        {portadasGalleryMessages[locale].back}
      </Link>
    </>
  );
}
