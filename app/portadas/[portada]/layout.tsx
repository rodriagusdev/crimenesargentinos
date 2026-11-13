import Link from "next/link";
import { cookies } from "next/headers";
import { portadasGalleryMessages } from "@/components/home/PortadasGallery.messages";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from "@/lib/i18n/locale";

// Botón persistente para volver a la galería desde cualquier portada
export default async function PortadaLayout({ children }: { children: React.ReactNode }) {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

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
