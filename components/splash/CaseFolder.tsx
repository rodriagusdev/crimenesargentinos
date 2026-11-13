"use client";

import SplashLogo from "./SplashLogo";

type CaseFolderProps = {
  visible: boolean;
  open: boolean;
  label: string;
  typing: boolean;
};

// Carpeta de cartón madera: tapa con sello y etiqueta a máquina; al abrirse revela el logo del juego
export default function CaseFolder({ visible, open, label, typing }: CaseFolderProps) {
  return (
    <div
      className={`splash-folder relative w-[min(86vw,620px)] aspect-[10/7] transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Pestaña de la carpeta */}
      <div className="absolute -top-[7%] left-[6%] h-[9%] w-[34%] rounded-t-lg bg-[#b38b52] shadow-[inset_0_2px_0_rgba(255,255,255,0.15)]" />

      {/* Interior de la carpeta: aquí aparece el logo */}
      <div className="absolute inset-0 rounded-md bg-[#a67e47] shadow-[0_30px_60px_rgba(0,0,0,0.75),inset_0_0_40px_rgba(60,35,10,0.5)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-[5%] rounded bg-[#efe3c4]/90 shadow-[2px_3px_0_rgba(0,0,0,0.25)] rotate-[-1.2deg]" />
        <SplashLogo visible={open} className="w-[88%]" />
      </div>

      {/* Tapa: gira como la tapa de un libro */}
      <div className={`splash-cover absolute inset-0 ${open ? "splash-cover--open" : ""}`}>
        {/* Frente de la tapa */}
        <div className="splash-face absolute inset-0 rounded-md bg-[#c9a46a] shadow-[inset_0_0_50px_rgba(90,55,15,0.45)] overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(95deg,transparent_0_6px,rgba(80,50,15,0.35)_6px_7px)]" />

          {/* Mancha de café */}
          <div className="absolute top-[48%] left-[10%] size-[22%] rounded-full bg-[radial-gradient(circle,transparent_58%,rgba(90,50,15,0.35)_62%,rgba(90,50,15,0.12)_70%,transparent_74%)] rotate-12" />

          {/* Etiqueta escrita a máquina */}
          <div className="absolute top-[12%] left-[8%] right-[8%] px-3 py-3 bg-[#f6eedb] shadow-[2px_2px_0_rgba(0,0,0,0.25)] text-[#2a2a2a] text-[9px] sm:text-xs leading-relaxed min-h-[3.2em]">
            {label}
            {typing && <span className="splash-caret">▌</span>}
          </div>

          {/* Sello CONFIDENCIAL */}
          <span className="absolute bottom-[18%] right-[10%] rotate-[-12deg] px-3 py-2 border-4 border-double border-red-700/85 text-red-700/85 text-sm sm:text-2xl tracking-widest mix-blend-multiply">
            CONFIDENCIAL
          </span>

          <span className="absolute bottom-[8%] left-[8%] text-[8px] sm:text-[10px] text-[#5a3e17]/80 tracking-widest">
            POLICÍA FEDERAL · DIV. HOMICIDIOS
          </span>
        </div>

        {/* Dorso de la tapa (visible al abrir) */}
        <div className="splash-face splash-face--back absolute inset-0 rounded-md bg-[#b8925a] shadow-[inset_0_0_50px_rgba(60,35,10,0.6)]" />
      </div>
    </div>
  );
}
