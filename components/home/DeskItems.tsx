"use client";

import DeskObject from "./DeskObject";
import { useAudioStore } from "@/stores/useAudioStore";

// Los seis objetos de la mesa del detective. Ojo: nada de caras ni nombres de sospechosos (todos son culpables en algún caso).

const BODY = "font-mono text-sm leading-snug";

export function MapItem() {
  return (
    <DeskObject href="/login" hint="SEGUIR EL RASTRO →" tilt={-2} dropDelayMs={100} className="p-4 rounded-xl bg-[#1b2633] border-[3px] border-[#0c1421]">
      <div
        className="h-36 rounded-md bg-[#0b1a20] bg-no-repeat bg-[length:162%_auto] bg-[position:50%_22%] brightness-90 group-hover:brightness-110 transition-[filter]"
        style={{ backgroundImage: "url(/images/test_composite.webp)" }}
        aria-hidden
      />
      <span className="text-[11px] text-[#E1C380]">MAPA</span>
      <span className={`${BODY} text-[#FFF3C7]/80`}>De Jujuy a Tierra del Fuego: seguí al prófugo por todo el país.</span>
    </DeskObject>
  );
}

export function CaseFolderItem() {
  return (
    <DeskObject
      href="/login"
      hint="ABRIR CASO →"
      tilt={0}
      dropDelayMs={0}
      featured
      className="p-5 rounded-lg bg-[#c9a46a] text-[#2a1d12]"
      ariaLabel="Jugar: abrir el caso"
    >
      <span className="self-start px-2.5 py-1.5 bg-[#f6eedb] font-mono text-sm">EXPTE. N° 0001 — REP. ARGENTINA</span>
      <span className="self-end px-2.5 py-2 border-4 border-double border-red-700 text-red-700 text-xs rotate-[-8deg]">CASO ABIERTO</span>
      <span className="mt-2 text-base">JUGAR</span>
      <span className={BODY}>Abrí la carpeta: entrá o creá tu legajo de agente.</span>
    </DeskObject>
  );
}

export function RulesBookItem() {
  return (
    <DeskObject
      href="/reglas"
      hint="LEER EL MANUAL →"
      tilt={3}
      dropDelayMs={200}
      className="p-4 rounded-lg bg-[#7a1f1f] border-l-[14px] border-[#4d1111]"
    >
      <div className="h-36 flex items-center justify-center border-2 border-[#E1C380] rounded">
        <span className="text-xs leading-loose text-center text-[#E1C380]">
          MANUAL
          <br />
          DEL
          <br />
          DETECTIVE
        </span>
      </div>
      <span className="text-[11px] text-[#E1C380]">REGLAS</span>
      <span className={`${BODY} text-[#FFF3C7]/85`}>Cómo se viaja, se interroga y se emite la orden de arresto.</span>
    </DeskObject>
  );
}

export function RadioItem() {
  const isMuted = useAudioStore((s) => s.isMuted);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const on = !isMuted;

  return (
    <DeskObject
      onClick={toggleMute}
      hint={on ? "APAGAR LA RADIO" : "PRENDER LA RADIO"}
      tilt={-1}
      dropDelayMs={300}
      className="p-4 rounded-xl bg-[#2b2f36] border-[3px] border-[#14171c]"
      ariaLabel={on ? "Apagar la música" : "Prender la música"}
    >
      <div className="h-28 rounded-lg bg-[#07130c] border-2 border-[#1b2a20] flex flex-col items-center justify-center gap-3">
        <span className={`text-[10px] ${on ? "text-[#5dff9d]" : "text-[#5dff9d]/30"}`}>
          {on ? "FREC. 147.30 MHz" : "--- APAGADA ---"}
        </span>
        <svg width="180" height="30" viewBox="0 0 180 30" aria-hidden className={on ? "home-radio-wave" : "opacity-20"}>
          <path d="M0 15 Q 11 0 22 15 T 45 15 T 67 15 T 90 15 T 112 15 T 135 15 T 157 15 T 180 15" fill="none" stroke="#5dff9d" strokeWidth="2" />
        </svg>
      </div>
      <span className="text-[11px] text-[#E1C380]">RADIO</span>
      <span className={`${BODY} text-[#FFF3C7]/80`}>{on ? "Música y lluvia de fondo. Tocá para apagar." : "Tocá para prender la música."}</span>
    </DeskObject>
  );
}

export function NewspaperItem() {
  return (
    <DeskObject href="/login" hint="LEER LA NOTA →" tilt={-3} dropDelayMs={400} className="p-4 rounded bg-[#ece4cf] text-[#1b1813]">
      <span className="text-[8px] tracking-wider">EDICIÓN NOCHE</span>
      <span className="py-1.5 border-y-[3px] border-double border-[#1b1813] text-center text-sm">EL VESPERTINO</span>
      <span className="font-mono text-base font-bold leading-snug">Robaron el bandoneón de oro en plena milonga</span>
      <span className="font-mono text-sm leading-snug">Y la camiseta del 86 sigue sin aparecer. La Central pide refuerzos.</span>
      <span className="mt-auto text-[11px]">NOVEDADES</span>
    </DeskObject>
  );
}

export function RankingItem() {
  return (
    <DeskObject
      href="/login"
      hint="ENTRÁ PARA VERLO →"
      tilt={2}
      dropDelayMs={500}
      className="p-4 rounded-md bg-[#1d2f27] border-8 border-[#6b4423]"
    >
      <span className="text-[11px] text-[#f4efe2]">RANKING</span>
      <div className="relative">
        <ol className="font-mono text-[#f4efe2] text-base leading-relaxed list-decimal pl-6" aria-label="Ranking oculto hasta iniciar sesión">
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <span className="inline-block h-3 w-28 align-middle rounded-sm bg-[#f4efe2]/35 blur-[2px]" />
            </li>
          ))}
        </ol>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 rotate-[-12deg] px-2 py-1 border-[3px] border-double border-red-500 text-red-400 text-[9px]">
          TOP SECRETO
        </span>
      </div>
      <span className={`${BODY} text-[#f4efe2]/70`}>Escrito con tiza: entrá para ver quién lidera la Central.</span>
    </DeskObject>
  );
}
