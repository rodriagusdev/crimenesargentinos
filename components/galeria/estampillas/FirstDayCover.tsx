import Postmark from "./Postmark";
import SuspectPhoto from "../SuspectPhoto";
import styles from "./estampillas.module.css";
import type { GallerySuspect } from "@/lib/suspectReleases";

type Props = {
  /** Primera estampilla de la serie más nueva (va pegada en el sobre) */
  stamp: GallerySuspect;
  stampNumber: number;
  series: number;
  /** Hay serie nueva: el sobre pasa a ser de "primer día" y recibe el matasellos */
  firstDay: boolean;
};

// Sobre de correo aéreo con el título de la colección; con serie nueva, es el sobre de primer día matasellado
export default function FirstDayCover({ stamp, stampNumber, series, firstDay }: Props) {
  return (
    <div className="rounded-md p-2 sm:p-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.5)] bg-[repeating-linear-gradient(135deg,#c81e1e_0_14px,#f4efe3_14px_24px,#1d4e89_24px_38px,#f4efe3_38px_48px)]">
      <div className={`${styles.watermark} relative flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-sm bg-[#f7f1e2] p-4 sm:p-6 text-[#1b1813]`}>
        {/* Viñeta y título */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-[0.3em] text-[#8a6a2a]">COLECCIÓN FILATÉLICA</p>
          <h1 className="mt-2 text-lg sm:text-2xl leading-relaxed text-[#1d4e89]">ROSTROS DE LA REPÚBLICA</h1>
          <p className="mt-2 inline-block rounded-sm border-2 border-[#1d4e89] px-2 py-1 text-[10px] text-[#1d4e89]">
            {firstDay ? `SOBRE DE PRIMER DÍA · SERIE ${series}` : "POR AVIÓN · CORREO AÉREO"}
          </p>
          {/* Renglones de la dirección */}
          <div className="mt-4 max-w-xs space-y-2 font-serif text-sm italic text-[#3b3328]">
            <p className="border-b border-[#5a4f40]/40 pb-0.5">Sr. Coleccionista</p>
            <p className="border-b border-[#5a4f40]/40 pb-0.5">Casilla de Correo 1810</p>
            <p className="border-b border-[#5a4f40]/40 pb-0.5">Buenos Aires · Rep. Argentina</p>
          </div>
        </div>

        {/* Estampilla pegada y matasellos */}
        <div className="relative self-end sm:self-start flex items-start">
          {firstDay && (
            <div className="absolute -left-20 sm:-left-24 top-6 sm:top-4">
              <Postmark series={series} size="md" />
            </div>
          )}
          <div className={`${styles.perforated} w-24 sm:w-28 rotate-2 bg-[#fffdf6] drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)]`}>
            <div className={`border-2 p-1 ${firstDay ? "border-[#1d4e89] bg-[#e8f1fb]" : "border-[#8b7d68] bg-[#efe6d4] sepia-[0.4]"}`}>
              <div className="flex justify-between text-[8px]">
                <span>${stampNumber}</span>
                <span>ARG</span>
              </div>
              <div className="relative mt-0.5 aspect-[4/5] overflow-hidden bg-[#3a4250]">
                <SuspectPhoto suspect={stamp} index={stampNumber} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
