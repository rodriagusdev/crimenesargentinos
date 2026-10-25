import React from "react";

/**
 * Custom pure-HTML/React set dressing for the Detective Desk & Corkboard.
 * Renders the investigation casefile, checklists, sensationalist Argentine
 * newspapers ("¡ALERTA CONURBANO!", "EL HERALDO"), fingerprint dossiers,
 * police telex radiograms, airmail envelopes, red strings, sticky notes,
 * and magnifying glass.
 *
 * All elements are non-interactable (pointer-events-none select-none)
 * with a photographic vintage print overlay so they act as rich background artwork.
 */

// Identikit Avatar 1 (Male suspect retro police sketch)
function SuspectSketchOne() {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full bg-[#e8e2d5]">
      <line x1="0" y1="20" x2="100" y2="20" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="40" x2="100" y2="40" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="60" x2="100" y2="60" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="80" x2="100" y2="80" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="100" x2="100" y2="100" stroke="#c5bba8" strokeWidth="0.75" />
      <path d="M 28 42 C 28 20, 72 20, 72 42 C 75 52, 75 68, 68 82 C 60 92, 40 92, 32 82 C 25 68, 25 52, 28 42 Z" fill="#2b2620" opacity="0.85" />
      <path d="M 32 46 C 32 28, 68 28, 68 46 C 70 56, 70 70, 64 80 C 58 88, 42 88, 36 80 C 30 70, 30 56, 32 46 Z" fill="#cfc5b4" />
      <path d="M 26 40 C 26 18, 74 18, 74 40 C 72 32, 60 24, 50 24 C 40 24, 28 32, 26 40 Z" fill="#1f1b17" />
      <path d="M 37 48 Q 43 45 47 48" stroke="#1f1b17" strokeWidth="2" fill="none" />
      <path d="M 53 48 Q 57 45 63 48" stroke="#1f1b17" strokeWidth="2" fill="none" />
      <circle cx="42" cy="53" r="2.5" fill="#1f1b17" />
      <circle cx="58" cy="53" r="2.5" fill="#1f1b17" />
      <path d="M 50 51 L 52 64 L 47 66" stroke="#4a4237" strokeWidth="1.5" fill="none" />
      <path d="M 43 74 Q 50 77 57 74" stroke="#2b2620" strokeWidth="2" fill="none" />
      <path d="M 20 120 L 34 94 L 50 102 L 66 94 L 80 120 Z" fill="#221e1a" />
      <path d="M 50 102 L 50 120" stroke="#e8e2d5" strokeWidth="1.5" />
    </svg>
  );
}

// Identikit Avatar 2 (Female suspect retro sketch)
function SuspectSketchTwo() {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full bg-[#e8e2d5]">
      <line x1="0" y1="20" x2="100" y2="20" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="40" x2="100" y2="40" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="60" x2="100" y2="60" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="80" x2="100" y2="80" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="100" x2="100" y2="100" stroke="#c5bba8" strokeWidth="0.75" />
      <path d="M 22 45 C 20 22, 80 22, 78 45 C 82 65, 82 95, 76 108 L 24 108 C 18 95, 18 65, 22 45 Z" fill="#1c1815" />
      <path d="M 33 46 C 33 30, 67 30, 67 46 C 68 58, 68 72, 63 80 C 57 88, 43 88, 37 80 C 32 72, 32 58, 33 46 Z" fill="#d6cca0" />
      <path d="M 38 48 Q 43 45 47 47" stroke="#1f1b17" strokeWidth="1.75" fill="none" />
      <path d="M 53 47 Q 57 45 62 48" stroke="#1f1b17" strokeWidth="1.75" fill="none" />
      <ellipse cx="43" cy="53" rx="2.5" ry="2" fill="#1f1b17" />
      <ellipse cx="57" cy="53" rx="2.5" ry="2" fill="#1f1b17" />
      <path d="M 50 52 L 51 63 L 48 64" stroke="#4a4237" strokeWidth="1.25" fill="none" />
      <path d="M 44 72 Q 50 75 56 72" stroke="#2b2620" strokeWidth="1.75" fill="none" />
      <path d="M 26 120 L 38 98 L 62 98 L 74 120 Z" fill="#2d2924" />
    </svg>
  );
}

// Identikit Avatar 3 (Older male suspect retro sketch)
function SuspectSketchThree() {
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full bg-[#e8e2d5]">
      <line x1="0" y1="20" x2="100" y2="20" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="40" x2="100" y2="40" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="60" x2="100" y2="60" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="80" x2="100" y2="80" stroke="#c5bba8" strokeWidth="0.75" />
      <line x1="0" y1="100" x2="100" y2="100" stroke="#c5bba8" strokeWidth="0.75" />
      <path d="M 28 42 C 28 24, 72 24, 72 42 C 74 54, 73 70, 67 82 C 60 92, 40 92, 33 82 C 27 70, 26 54, 28 42 Z" fill="#cfc5b4" />
      <path d="M 25 45 C 25 35, 30 30, 34 28 L 34 45 Z" fill="#25211c" />
      <path d="M 75 45 C 75 35, 70 30, 66 28 L 66 45 Z" fill="#25211c" />
      <path d="M 37 47 Q 44 44 48 48" stroke="#1f1b17" strokeWidth="2" fill="none" />
      <path d="M 52 48 Q 56 44 63 47" stroke="#1f1b17" strokeWidth="2" fill="none" />
      <circle cx="43" cy="53" r="2.5" fill="#1f1b17" />
      <circle cx="57" cy="53" r="2.5" fill="#1f1b17" />
      <path d="M 49 51 L 51 63 L 47 64" stroke="#4a4237" strokeWidth="1.5" fill="none" />
      <path d="M 41 71 C 45 68, 55 68, 59 71 C 57 74, 43 74, 41 71 Z" fill="#2b2620" />
      <path d="M 44 78 Q 50 80 56 78" stroke="#2b2620" strokeWidth="1.75" fill="none" />
      <path d="M 18 120 L 32 96 L 50 102 L 68 96 L 82 120 Z" fill="#3a3229" />
    </svg>
  );
}

/**
 * RECORTE DE PERIÓDICO "ALERTA CONURBANO"
 * Estilo sensacionalista argentino con cartel rojo estridente
 */
export function AlertaConurbanoNewspaper() {
  return (
    <div className="relative w-60 xl:w-68 p-3 rounded-xs bg-[#e4dac7] border border-[#c4b69d] shadow-[0_16px_36px_rgba(0,0,0,0.75)] rotate-[-3deg] select-none pointer-events-none">
      {/* Chincheta roja superior */}
      <span className="absolute -top-1.5 left-6 text-[10px] z-20">📍</span>

      {/* Cabecera sensacionalista */}
      <div className="border-b-2 border-zinc-900 pb-1 mb-1">
        <div className="flex items-center justify-between text-[6px] font-mono font-bold text-zinc-700 uppercase">
          <span>CRÓNICA POLICIAL DE URGENCIA</span>
          <span>CONURBANO OESTE</span>
        </div>
      </div>

      {/* Cartel ROJO impactante: ¡ALERTA CONURBANO! */}
      <div className="bg-[#dc2626] text-white px-2 py-1 rounded-xs text-center shadow-inner mb-1.5 border border-red-700">
        <span className="block font-black font-sans text-xs xl:text-sm tracking-widest uppercase text-shadow-sm">
          ¡ALERTA CONURBANO!
        </span>
      </div>

      {/* Titular */}
      <h5 className="font-serif font-black text-[9px] xl:text-[10px] leading-tight text-zinc-950 uppercase mb-1">
        OPERATIVO CERROJO: BUSCAN A LA BANDA EN EL OESTE
      </h5>

      {/* Miniatura de imagen policial + texto */}
      <div className="flex items-center gap-2 border-t border-zinc-400 pt-1">
        <div className="w-12 h-9 bg-zinc-800 rounded-xs border border-zinc-500 shrink-0 flex flex-col items-center justify-center text-xs text-zinc-300">
          <span>🚔</span>
          <span className="text-[5px] text-zinc-400 font-mono">MORÓN</span>
        </div>
        <p className="font-serif text-[7px] leading-snug text-zinc-800 text-justify">
          Allanamiento de madrugada en Morón y La Matanza. Cortan accesos en Gral. Paz y Camino de Cintura. Los prófugos habrían tomado un micro al norte.
        </p>
      </div>

      {/* Franja de última hora */}
      <div className="mt-1.5 pt-1 border-t border-dashed border-red-700/60 flex items-center justify-between text-[6px] font-mono font-bold text-red-800">
        <span>SECRETO DE SUMARIO</span>
        <span>JUZGADO FEDERAL N° 2</span>
      </div>
    </div>
  );
}

/**
 * RADIOGRAMA POLICIAL DE MATRIZ DE PUNTOS
 */
export function PoliceRadiogramTelex() {
  return (
    <div className="relative w-56 xl:w-64 p-3 rounded-xs bg-[#f6f2e6] border border-zinc-300 shadow-[0_12px_24px_rgba(0,0,0,0.65)] rotate-[2deg] font-mono select-none pointer-events-none">
      <span className="absolute -top-1.5 right-6 text-[9px] z-20">📌</span>

      {/* Orificios laterales de papel continuo */}
      <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none opacity-40">
        <div className="size-1 rounded-full bg-zinc-600" />
        <div className="size-1 rounded-full bg-zinc-600" />
        <div className="size-1 rounded-full bg-zinc-600" />
        <div className="size-1 rounded-full bg-zinc-600" />
      </div>

      <div className="pl-2 border-b border-zinc-300 pb-1 mb-1">
        <span className="block text-[7px] font-black tracking-widest text-zinc-900">
          RADIOGRAMA // POLICÍA FEDERAL
        </span>
        <span className="text-[6px] text-zinc-600">DIV. DELITOS COMPLEJOS // RED NACIONAL</span>
      </div>

      <p className="pl-2 text-[7px] text-zinc-800 leading-tight tracking-tight uppercase">
        A TODAS LAS DELEGACIONES REGIONALES: SOSPECHOSO AVISTADO EN TERMINAL DE RETIRO // COBERTURA INMEDIATA DE RUTAS // RADIAR NOVEDADES.
      </p>
    </div>
  );
}

/**
 * PASAJE DE MICRO DE LARGA DISTANCIA (RETIRO - INTERIOR)
 */
export function LongDistanceBusTicket() {
  return (
    <div className="relative w-48 p-2 rounded-xs bg-[#fffbeb] border border-amber-300 shadow-md rotate-[-4deg] font-mono text-[7px] text-zinc-800 select-none pointer-events-none">
      <span className="absolute -top-1 right-2 text-[8px] z-20">📌</span>
      <div className="border-b border-dashed border-amber-400 pb-0.5 mb-1 font-bold text-amber-950 flex justify-between">
        <span>TRANSPORTE INTERURBANO</span>
        <span>RET-CBA</span>
      </div>
      <div className="flex justify-between text-zinc-800">
        <span>ORIGEN: RETIRO (BS. AS.)</span>
        <span>DESTINO: INTERIOR</span>
      </div>
      <div className="flex justify-between text-zinc-500 text-[6px] mt-0.5">
        <span>BUTACA: 24 · COCHE CAMA</span>
        <span>TICKET N° 09841</span>
      </div>
    </div>
  );
}

/**
 * FICHA DACTILOSCÓPICA CON HUELLAS DACTILARES Y SELLO
 */
export function FingerprintDossierCard() {
  return (
    <div className="relative w-48 xl:w-56 p-2.5 rounded-sm bg-[#ece3d0] border border-[#cfbf9e] shadow-[0_14px_30px_rgba(0,0,0,0.7)] rotate-[-2deg] select-none pointer-events-none">
      <span className="absolute -top-1.5 left-4 text-[9px] z-20">📌</span>

      <div className="border-b border-zinc-400 pb-1 mb-1.5 flex items-center justify-between">
        <span className="text-[7px] font-mono font-black text-zinc-800 uppercase">
          FICHA DACTILOSCÓPICA
        </span>
        <span className="text-[6px] font-mono text-zinc-600">REG. N° 441</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        {/* Huella Pulgar */}
        <div className="p-1 rounded-xs bg-[#f3ecde] border border-zinc-300 flex flex-col items-center">
          <svg viewBox="0 0 40 50" className="w-8 h-10 opacity-75">
            <path d="M 20 5 C 10 5, 5 15, 5 25 C 5 35, 10 45, 20 45 C 30 45, 35 35, 35 25 C 35 15, 30 5, 20 5 Z" stroke="#27272a" strokeWidth="1.2" fill="none" />
            <path d="M 20 10 C 13 10, 9 18, 9 25 C 9 32, 13 40, 20 40 C 27 40, 31 32, 31 25 C 31 18, 27 10, 20 10 Z" stroke="#27272a" strokeWidth="1.2" fill="none" />
            <path d="M 20 16 C 16 16, 13 20, 13 25 C 13 30, 16 34, 20 34 C 24 34, 27 30, 27 25 C 27 20, 24 16, 20 16 Z" stroke="#27272a" strokeWidth="1.2" fill="none" />
            <path d="M 20 21 C 18 21, 16 23, 16 25 C 16 27, 18 29, 20 29 C 22 29, 24 27, 24 25" stroke="#27272a" strokeWidth="1.2" fill="none" />
          </svg>
          <span className="text-[6px] font-mono text-zinc-600 uppercase font-bold">Pulgar</span>
        </div>

        {/* Huella Índice */}
        <div className="p-1 rounded-xs bg-[#f3ecde] border border-zinc-300 flex flex-col items-center">
          <svg viewBox="0 0 40 50" className="w-8 h-10 opacity-75">
            <path d="M 20 6 C 11 6, 6 15, 6 25 C 6 35, 11 44, 20 44 C 29 44, 34 35, 34 25 C 34 15, 29 6, 20 6 Z" stroke="#27272a" strokeWidth="1.2" fill="none" />
            <path d="M 20 12 C 14 12, 10 18, 10 25 C 10 32, 14 38, 20 38 C 26 38, 30 32, 30 25 C 30 18, 26 12, 20 12 Z" stroke="#27272a" strokeWidth="1.2" fill="none" />
            <path d="M 20 18 C 17 18, 14 21, 14 25 C 14 29, 17 32, 20 32 C 23 32, 26 29, 26 25" stroke="#27272a" strokeWidth="1.2" fill="none" />
          </svg>
          <span className="text-[6px] font-mono text-zinc-600 uppercase font-bold">Índice</span>
        </div>
      </div>

      {/* Sello de coincidencia positiva */}
      <div className="text-center border-t border-dashed border-zinc-400 pt-1">
        <span className="inline-block border border-purple-800 text-purple-900 font-mono font-black text-[7px] px-1.5 py-0.5 rounded rotate-[-4deg] tracking-wider bg-purple-100/70">
          COINCIDENCIA 100%
        </span>
      </div>
    </div>
  );
}

/**
 * MANCHA DE TAZA DE CAFÉ
 */
export function CoffeeMugStain() {
  return (
    <div className="size-20 rounded-full border-[3px] border-amber-900/25 pointer-events-none select-none blur-[0.4px] shadow-inner rotate-45 flex items-center justify-center">
      <div className="size-16 rounded-full border border-amber-900/15" />
    </div>
  );
}

/**
 * LEFT WING: ALERTA CONURBANO + Dossier "CASO ABIERTO" + Checklists + Pasaje
 */
export function DetectiveLeftWing() {
  return (
    <div className="opacity-80 flex flex-col gap-3 xl:gap-4 w-[180px] lg:w-[220px] xl:w-[260px] 2xl:w-[300px] shrink-0 pointer-events-none select-none relative z-0 animate-fade-in">
      {/* Overlay fotográfico sutil para simular arte/ilustración no interactuable */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-30 rounded-xl"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 65%, rgba(0,0,0,0.3) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.18) 100%)
          `,
        }}
      />

      {/* 1. DIARIO "¡ALERTA CONURBANO!" */}
      <AlertaConurbanoNewspaper />

      {/* 2. CARPETA MANILA "CASO ABIERTO" */}
      <div className="relative p-3 xl:p-3.5 rounded-xl bg-gradient-to-br from-[#f5ebd7] via-[#ebdcbe] to-[#dfcda9] border-2 border-[#caa877] shadow-[0_16px_36px_rgba(0,0,0,0.7)] rotate-[-1deg]">
        {/* Binder Clip metálico en el borde superior */}
        <div className="absolute -top-3.5 left-8 w-9 h-7 bg-zinc-900 rounded-sm border border-zinc-700 shadow-md flex flex-col items-center justify-between p-0.5 z-20">
          <div className="w-5 h-2 rounded-full border border-zinc-400" />
          <div className="w-6 h-1 bg-zinc-800 rounded-xs" />
        </div>

        {/* Tab de archivo lateral derecha */}
        <div className="absolute -right-3 top-6 bg-[#dfcda9] border-2 border-l-0 border-[#caa877] px-2 py-0.5 rounded-r-md text-[8px] font-mono font-black tracking-widest text-zinc-700 uppercase shadow-sm rotate-90 origin-top-left">
          SUSPECTS
        </div>

        {/* Título de expediente */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-[#b89562] pb-1 mb-2">
          <div className="flex flex-col">
            <span className="font-mono font-black text-xs xl:text-sm tracking-wider text-zinc-900 uppercase">
              CASO ABIERTO
            </span>
            <span className="text-[7px] font-mono text-zinc-600 font-bold tracking-tight">
              EXP. POLICIAL N° 0924-B
            </span>
          </div>
          <span className="border border-red-700 text-red-700 font-mono font-black text-[7px] px-1.5 py-0.5 rounded rotate-[-6deg] tracking-widest bg-red-100/50">
            CONFIDENCIAL
          </span>
        </div>

        {/* Galería de 3 Fotos Polaroid de Sospechosos */}
        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            {/* Polaroid 1 */}
            <div className="relative p-1 pb-1.5 rounded-xs bg-[#faf8f3] border border-zinc-300 shadow-md rotate-[-2deg]">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px]">📌</span>
              <div className="w-full aspect-square rounded-xs overflow-hidden border border-zinc-300">
                <SuspectSketchOne />
              </div>
              <span className="block mt-0.5 text-[6px] font-mono text-center font-bold text-zinc-800 truncate uppercase">
                Sujeto A
              </span>
            </div>

            {/* Polaroid 2 */}
            <div className="relative p-1 pb-1.5 rounded-xs bg-[#faf8f3] border border-zinc-300 shadow-md rotate-[1.5deg]">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px]">📌</span>
              <div className="w-full aspect-square rounded-xs overflow-hidden border border-zinc-300">
                <SuspectSketchTwo />
              </div>
              <span className="block mt-0.5 text-[6px] font-mono text-center font-bold text-zinc-800 truncate uppercase">
                Sujeto B
              </span>
            </div>
          </div>

          {/* Polaroid 3 + Lista mecanografiada */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#caa877]/60">
            <div className="relative w-14 p-1 pb-1.5 rounded-xs bg-[#faf8f3] border border-zinc-300 shadow-md rotate-[-1deg] shrink-0">
              <div className="w-full aspect-square rounded-xs overflow-hidden border border-zinc-300">
                <SuspectSketchThree />
              </div>
            </div>

            <div className="flex-1 font-mono text-[7px] leading-tight text-zinc-800 flex flex-col gap-0.5">
              <span className="font-bold text-zinc-900 uppercase">Perfil:</span>
              <span className="text-zinc-700">1. Visto en Ezeiza</span>
              <span className="text-zinc-700">2. Rastro al norte</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RADIOGRAMA POLICIAL PFA */}
      <PoliceRadiogramTelex />

      {/* 4. LIBRETA DE CHECKLISTS & BOLETO DE MICRO */}
      <div className="relative p-3 rounded-lg bg-[#fbf9f4] border border-zinc-300 shadow-[0_12px_28px_rgba(0,0,0,0.6)] rotate-[-1deg]">
        <div className="absolute -top-2 left-6 w-5 h-4 border-2 border-zinc-500 rounded-t-full bg-zinc-200/50 shadow-xs" />

        <div className="flex items-center justify-between border-b border-zinc-300 pb-1 mb-1.5 font-mono">
          <span className="font-bold text-[9px] uppercase tracking-wider text-zinc-800 flex items-center gap-1">
            <span>📋</span>
            <span>CHECKLISTS</span>
          </span>
          <span className="text-[7px] text-zinc-500 font-bold">CASO ACTIVO</span>
        </div>

        <div className="flex flex-col gap-1 font-mono text-[7px] text-zinc-700">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs border border-emerald-600 bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[6px]">
              ✓
            </span>
            <span className="line-through text-zinc-500">Testimonios de pista</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs border border-zinc-400 bg-white" />
            <span className="font-semibold text-zinc-800">Verificar coartada en destino</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-xs border border-zinc-400 bg-white" />
            <span className="font-semibold text-zinc-800">Orden judicial de captura</span>
          </div>
        </div>

        {/* Boleto de micro overlapping */}
        <div className="mt-2 -mb-1">
          <LongDistanceBusTicket />
        </div>
      </div>
    </div>
  );
}

/**
 * RIGHT WING: El Heraldo + Ficha Dactilar + Sobres + Hilos Rojos + Lupa + Mancha de Café
 */
export function DetectiveRightWing() {
  return (
    <div className="flex flex-col gap-3 xl:gap-4 w-[180px] lg:w-[220px] xl:w-[260px] 2xl:w-[300px] shrink-0 pointer-events-none select-none relative z-10 animate-fade-in">
      {/* Overlay fotográfico sutil para simular arte/ilustración no interactuable */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-30 rounded-xl"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 65%, rgba(0,0,0,0.3) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.18) 100%)
          `,
        }}
      />

      {/* Hilos rojos de investigación que conectan las pistas y el mapa */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
        {/* Hilo 1: Hacia el mapa */}
        <path
          d="M 6 12 Q -60 40 -120 70"
          stroke="#dc2626"
          strokeWidth="2.25"
          fill="none"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.85))" }}
        />
        {/* Hilo 2: Entre chinchetas del diario */}
        <path
          d="M 6 12 Q 110 24 210 14"
          stroke="#b91c1c"
          strokeWidth="1.75"
          fill="none"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.85))" }}
        />
        {/* Hilo 3: Del diario a la ficha dactilar */}
        <path
          d="M 210 14 Q 170 90 190 150"
          stroke="#ef4444"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.85))" }}
        />
        {/* Hilo 4: De la ficha al sobre */}
        <path
          d="M 190 150 Q 80 200 -70 180"
          stroke="#dc2626"
          strokeWidth="1.75"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="5 2.5"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.85))" }}
        />
      </svg>

      {/* 1. RECORTE DE PERIÓDICO "EL HERALDO" */}
      <div className="relative p-3 xl:p-3.5 rounded-sm bg-[#ded5c2] border border-[#c2b69e] shadow-[0_16px_36px_rgba(0,0,0,0.7)] rotate-[1deg]">
        <span className="absolute -top-1.5 -left-1.5 text-[9px] z-20">📍</span>
        <span className="absolute -top-1.5 -right-1.5 text-[9px] z-20">📍</span>

        <div className="text-center border-b-2 border-zinc-900 pb-1 mb-1">
          <span className="block font-serif font-black text-xs xl:text-sm tracking-tight text-zinc-900 uppercase">
            EL HERALDO NACIONAL
          </span>
          <div className="flex items-center justify-between text-[6px] font-mono text-zinc-600 border-t border-zinc-400 pt-0.5 mt-0.5">
            <span>EDICIÓN MATUTINA</span>
            <span>POLICIALES</span>
          </div>
        </div>

        <h4 className="font-serif font-bold text-[9px] xl:text-[10px] leading-tight text-zinc-950 uppercase mb-1">
          EL ROBO DEL SIGLO: BÚSQUEDA NACIONAL
        </h4>

        <div className="grid grid-cols-2 gap-1 text-[7px] font-serif leading-tight text-zinc-800 text-justify border-t border-zinc-400 pt-1">
          <p>
            La Policía Federal intensificó las pesquisas tras la sustracción de piezas de valor incalculable...
          </p>
          <p>
            Comandos provinciales han sido alertados ante posibles avistamientos en terminales...
          </p>
        </div>
      </div>

      {/* Mancha circular de café de comisaría */}
      <div className="absolute top-28 -left-4 z-15">
        <CoffeeMugStain />
      </div>

      {/* 2. RECORTE SENSACIONALISTA "ALERTA CONURBANO" - SAN MARTÍN */}
      <div className="relative p-2.5 rounded-xs bg-[#e4d9c6] border border-[#c5b69c] shadow-[0_12px_24px_rgba(0,0,0,0.65)] rotate-[-1.5deg] select-none pointer-events-none">
        <span className="absolute -top-1.5 left-4 text-[9px] z-20">📌</span>
        <div className="bg-[#b91c1c] text-white px-1.5 py-0.5 rounded-xs text-center shadow-inner mb-1 border border-red-800">
          <span className="block font-black font-sans text-[8px] xl:text-[9px] tracking-wider uppercase">
            ¡ALERTA CONURBANO!
          </span>
        </div>
        <h5 className="font-serif font-black text-[8.5px] leading-tight text-zinc-950 uppercase mb-0.5">
          ALLANAN DESARMADERO CLANDESTINO EN SAN MARTÍN
        </h5>
        <p className="font-serif text-[6.5px] leading-tight text-zinc-800 text-justify">
          Secuestran autopartes y chapas patentes vinculadas al vehículo utilizado en la fuga inicial de los sospechosos.
        </p>
      </div>

      {/* 3. FICHA DACTILOSCÓPICA CON HUELLAS */}
      <FingerprintDossierCard />

      {/* 3. SOBRE POSTAL AÉREO CON SELLO Y MATASELLOS */}
      <div className="relative p-3 rounded-sm bg-[#ede2cb] border border-[#d2c3a5] shadow-[0_12px_28px_rgba(0,0,0,0.6)] rotate-[-1.5deg]">
        <span className="absolute -top-1.5 right-6 text-[9px] z-20">📍</span>

        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #dc2626 0 6px, transparent 6px 10px, #2563eb 10px 16px, transparent 16px 20px)",
          }}
        />

        <div className="flex items-start justify-between pt-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[7px] font-mono font-bold uppercase tracking-wider text-zinc-600">
              CORREO AÉREO OFICIAL
            </span>
            <span className="font-serif italic text-[8px] text-zinc-900 leading-snug">
              Dpto. Investigaciones Complejas
            </span>
            <span className="text-[6px] font-mono text-zinc-700">
              Buenos Aires — Rep. Argentina
            </span>
          </div>

          <div className="relative size-8 rounded-xs bg-[#b45309] text-amber-100 border border-amber-300 p-0.5 flex flex-col items-center justify-center text-center shadow-xs">
            <span className="text-[5px] font-mono font-bold">ARGENTINA</span>
            <span className="text-[7px] font-black">$ 10</span>
            <div className="absolute inset-0 border border-dashed border-zinc-900/60 rounded-full rotate-12 flex items-center justify-center">
              <span className="text-[4px] font-mono text-zinc-900/80 font-bold">BS AS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. LUPA DE DETECTIVE & MANOJO DE LLAVES */}
      <div className="relative h-20 w-full flex items-center justify-end pr-2">
        <div className="relative size-18 rounded-full border-4 border-amber-500/80 bg-white/5 backdrop-blur-[0.5px] shadow-[0_12px_30px_rgba(0,0,0,0.85)] flex items-center justify-center rotate-[-15deg]">
          <div className="absolute top-1 left-2 w-7 h-3 rounded-full bg-white/25 rotate-[-25deg] blur-[0.5px]" />
          <span className="text-lg text-zinc-300/40 select-none">🔍</span>
          <div className="absolute -bottom-9 -right-5 w-3.5 h-10 rounded-sm bg-gradient-to-b from-[#3a2216] via-[#24130a] to-[#120904] border border-amber-600/50 shadow-md rotate-45" />
        </div>

        <div className="absolute bottom-1 left-2 flex items-center gap-1 rotate-12">
          <div className="size-4 rounded-full border-2 border-zinc-400 bg-transparent shadow-xs" />
          <div className="w-7 h-1.5 bg-gradient-to-r from-zinc-400 to-amber-600 rounded-xs shadow" />
        </div>
      </div>
    </div>
  );
}

/**
 * BOTTOM STRIP: Pinned Yellow Sticky Notes & Evidence Tag Overlapping Desk
 */
export function DetectiveBottomStrip() {
  return (
    <div className="relative z-10 w-full px-4 sm:px-6 py-1 flex items-center justify-center gap-3 sm:gap-5 pointer-events-none select-none flex-wrap">
      {/* Nota 1: "¿Siguiente paso?" */}
      <div className="relative px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xs bg-[#fef08a] border border-amber-300 shadow-md rotate-[-2deg] text-zinc-900 font-serif italic text-[11px] sm:text-xs flex items-center gap-1.5">
        <span className="text-[10px]">📌</span>
        <span>¿Siguiente paso?</span>
      </div>

      {/* Nota 2: "?" */}
      <div className="relative px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xs bg-[#fde047] border border-amber-400 shadow-md rotate-[2.5deg] text-zinc-950 font-mono font-black text-xs sm:text-sm flex items-center justify-center">
        <span>❓</span>
      </div>

      {/* Nota 3: "¿Dónde se oculta?" */}
      <div className="relative px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xs bg-[#fef9c3] border border-amber-200 shadow-md rotate-[-1.5deg] text-zinc-900 font-serif italic text-[11px] sm:text-xs flex items-center gap-1.5">
        <span className="text-[10px]">📌</span>
        <span>¿Dónde se oculta?</span>
      </div>

      {/* Nota 4: Falcon bordó */}
      <div className="relative px-3 py-1 rounded-xs bg-[#fed7aa] border border-orange-300 shadow-md rotate-[3deg] text-zinc-900 font-mono text-[9px] sm:text-[10px] flex items-center gap-1.5">
        <span className="text-[9px]">📍</span>
        <span className="font-semibold">Vehículo: Falcon / 504 bordó</span>
      </div>

      {/* Etiqueta de evidencia judicial */}
      <div className="relative px-2.5 py-1 rounded-xs bg-[#f4e8d2] border border-[#c5b596] shadow-sm rotate-[-2deg] text-zinc-800 font-mono text-[8px] flex items-center gap-1">
        <span className="text-amber-800 font-bold">🏷️ EVIDENCIA N° 782</span>
      </div>
    </div>
  );
}

/**
 * SOL DE MAYO OFICIAL ARGENTINO
 * Renderizado vectorial nítido con 32 rayos (16 rectos + 16 ondulados flamígeros)
 * y rostro neoclásico sereno.
 */
export function SolDeMayo({ className = "w-full h-full" }: { className?: string }) {
  const straightAngles = [
    0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5,
    180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5,
  ];
  const wavyAngles = [
    11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 146.25, 168.75,
    191.25, 213.75, 236.25, 258.75, 281.25, 303.75, 326.25, 348.75,
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]`}
      aria-label="Sol de Mayo"
    >
      <defs>
        <radialGradient id="solFaceGrad" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <linearGradient id="rayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* 16 Rayos rectos piramidales */}
      {straightAngles.map((angle) => (
        <polygon
          key={`straight-${angle}`}
          points="48.2,33 50,14 51.8,33"
          fill="url(#rayGrad)"
          stroke="#b45309"
          strokeWidth="0.4"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}

      {/* 16 Rayos ondulados flamígeros */}
      {wavyAngles.map((angle) => (
        <path
          key={`wavy-${angle}`}
          d="M 48.6,33 C 46.8,27 53.2,21 50,14 C 48.8,20 51.4,27 51.4,33 Z"
          fill="url(#rayGrad)"
          stroke="#b45309"
          strokeWidth="0.4"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}

      {/* Disco central del Sol */}
      <circle
        cx="50"
        cy="50"
        r="17"
        fill="url(#solFaceGrad)"
        stroke="#b45309"
        strokeWidth="0.8"
      />

      {/* Rasgos faciales neoclásicos del Sol de Mayo */}
      <path d="M 41.5 43.5 Q 44.5 41 47.5 43.5" stroke="#78350f" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M 52.5 43.5 Q 55.5 41 58.5 43.5" stroke="#78350f" strokeWidth="0.8" fill="none" strokeLinecap="round" />

      <ellipse cx="44.5" cy="46.5" rx="2" ry="1.2" fill="#78350f" />
      <ellipse cx="55.5" cy="46.5" rx="2" ry="1.2" fill="#78350f" />
      <circle cx="44.8" cy="46.2" r="0.5" fill="#ffffff" />
      <circle cx="55.8" cy="46.2" r="0.5" fill="#ffffff" />

      <path d="M 50 45 L 50.8 51.5 L 48.2 52.5" stroke="#78350f" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      <path d="M 45.5 55.5 Q 50 54.2 54.5 55.5 Q 50 57.2 45.5 55.5 Z" fill="#78350f" />

      <circle cx="41.5" cy="50.5" r="2.2" fill="#ef4444" opacity="0.25" />
      <circle cx="58.5" cy="50.5" r="2.2" fill="#ef4444" opacity="0.25" />
    </svg>
  );
}

/**
 * BANDERA ARGENTINA CON CHINCHETA DORADA
 * Orientada y rotada unos grados, colocada sobre el tablero de investigación policial.
 */
export function ArgentinaFlagDecor({
  className = "",
  rotation = "rotate-[12deg]",
}: {
  className?: string;
  rotation?: string;
}) {
  return (
    <div
      className={`relative select-none pointer-events-none transition-transform duration-300 ${rotation} ${className}`}
    >
      {/* Chincheta dorada de fijación (arriba a la izquierda de la bandera) */}
      <div className="absolute -top-2 left-6 z-30 flex flex-col items-center drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]">
        <div className="size-3.5 sm:size-4 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 border border-amber-200/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] flex items-center justify-center">
          <div className="size-1 sm:size-1.5 rounded-full bg-white/70" />
        </div>
        <div className="w-1.5 h-0.5 bg-amber-950/80 rounded-full blur-[0.5px]" />
      </div>

      {/* Paño de la Bandera Argentina */}
      <div
        className="
          relative
          w-28 h-18 sm:w-36 sm:h-23 md:w-44 md:h-28 xl:w-52 xl:h-33
          rounded-xs
          shadow-[0_16px_36px_rgba(0,0,0,0.85),0_6px_14px_rgba(0,0,0,0.65)]
          border border-white/25
          overflow-hidden
          grayscale-40
          flex flex-col
          bg-white
        "
      >
        {/* Franja Celeste Superior */}
        <div className="w-full h-1/3 bg-[#74acdf] border-b border-[#5c98ce]/30" />

        {/* Franja Blanca Central con el Sol de Mayo */}
        <div className="w-full h-1/3 bg-[#ffffff] relative flex items-center justify-center">
          <div className="h-full aspect-square p-0.5 flex items-center justify-center">
            <SolDeMayo />
          </div>
        </div>

        {/* Franja Celeste Inferior */}
        <div className="w-full h-1/3 bg-[#74acdf] border-t border-[#5c98ce]/30" />

        {/* Efecto de ondulación y brillo satinado de tela */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.2) 0%, transparent 24%, rgba(0,0,0,0.12) 50%, rgba(255,255,255,0.14) 74%, transparent 100%)",
          }}
        />

        {/* Textura sutil de hilado textil */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
          }}
        />

        {/* Costura perimetral tenue */}
        <div className="absolute inset-0 border border-dashed border-black/10 rounded-xs pointer-events-none" />
      </div>
    </div>
  );
}

/**
 * PERIÓDICO "ALERTA CONURBANO" DETRÁS DEL MAPA (BORDE SUPERIOR)
 * Se ubica debajo del marco del mapa (z-0), asomando por la parte superior-izquierda
 * como si el mapa hubiera sido desplegado encima del diario.
 */
export function AlertaConurbanoBehindMapTop() {
  return (
    <div
      className="
        absolute
        -top-10 sm:-top-14 md:-top-16 lg:-top-18
        -left-4 sm:-left-8 md:-left-10 lg:-left-12
        w-64 sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem]
        p-3 sm:p-4 pb-12
        rounded-xs
        bg-[#e3d8c4]
        border border-[#c5b79e]
        shadow-[0_18px_36px_rgba(0,0,0,0.75)]
        rotate-[-4deg]
        select-none pointer-events-none
        opacity-20
        z-0
      "
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)",
      }}
    >
      {/* Cabecera periodística sensacionalista */}
      <div className="border-b-2 border-zinc-900 pb-1 mb-1">
        <div className="flex items-center justify-between text-[6px] sm:text-[7px] font-mono font-bold text-zinc-700 uppercase">
          <span>CRÓNICA POLICIAL DE URGENCIA</span>
          <span>EDICIÓN NOCTURNA // VALOR $ 1,50</span>
        </div>
      </div>

      {/* Cartel ROJO estridente: ¡ALERTA CONURBANO! */}
      <div className="bg-[#dc2626] text-white px-2 py-0.5 sm:py-1 rounded-xs text-center shadow-inner mb-1.5 border border-red-700">
        <span className="block font-black font-sans text-[10px] sm:text-xs xl:text-sm tracking-widest uppercase">
          ¡ALERTA CONURBANO!
        </span>
      </div>

      {/* Titular de gran impacto */}
      <h4 className="font-serif font-black text-[9px] sm:text-[11px] xl:text-[12px] leading-tight text-zinc-950 uppercase mb-1">
        MISTERIO EN CRUCE VARELA: PERSECUCIÓN A LOS TIROS Y VEHÍCULO ABANDONADO
      </h4>

      {/* Copete y columnas informativas */}
      <div className="grid grid-cols-2 gap-2 text-[7px] sm:text-[8px] font-serif leading-snug text-zinc-800 text-justify border-t border-zinc-400 pt-1">
        <p>
          Personal de la DDI interceptó a tres sospechosos sobre Ruta 2. Tras un intenso tiroteo, los delincuentes cambiaron de rodado.
        </p>
        <p>
          Fuentes judiciales no descartan que los prófugos intenten cruzar hacia provincias vecinas con identidades falsas.
        </p>
      </div>

      {/* Sello rojo judicial */}
      <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 border-2 border-red-700/80 rounded-xs rotate-[-3deg] text-[6.5px] sm:text-[7.5px] font-mono font-black text-red-700 uppercase">
        <span>🚨 EVIDENCIA CAUSA N° 841</span>
      </div>
    </div>
  );
}

/**
 * PERIÓDICO "ALERTA CONURBANO" DETRÁS DEL MAPA (BORDE INFERIOR)
 * Se ubica debajo del mapa (z-0), asomando por la esquina inferior derecha
 * simulando un diario apoyado debajo del tablero operativo.
 */
export function AlertaConurbanoBehindMapBottom() {
  return (
    <div
      className="
        absolute
        -bottom-8 sm:-bottom-12 md:-bottom-14 lg:-bottom-16
        -right-3 sm:-right-6 md:-right-8 lg:-right-10
        w-60 sm:w-72 md:w-84 lg:w-96
        p-3 sm:p-3.5 pt-8
        rounded-xs
        opacity-20
        bg-[#ded4bf]
        border border-[#c2b49b]
        shadow-[0_16px_34px_rgba(0,0,0,0.7)]
        rotate-[3.5deg]
        select-none pointer-events-none
        z-0
      "
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)",
      }}
    >
      {/* Cartel ROJO: ¡ALERTA CONURBANO! */}
      <div className="bg-[#b91c1c] text-white px-2 py-0.5 rounded-xs text-center shadow-inner mb-1 border border-red-800">
        <span className="block font-black font-sans text-[9px] sm:text-[10px] xl:text-[11px] tracking-wider uppercase">
          ¡ALERTA CONURBANO! // CRÓNICA ROJA
        </span>
      </div>

      {/* Titular */}
      <h5 className="font-serif font-black text-[8.5px] sm:text-[10px] leading-tight text-zinc-950 uppercase mb-1">
        GOLPE COMANDO EN BANFIELD: ROBAN BOTÍN Y ESCAPAN POR VÍAS DEL ROCA
      </h5>

      {/* Texto de columna */}
      <p className="font-serif text-[7px] sm:text-[8px] leading-tight text-zinc-800 text-justify border-t border-zinc-400 pt-1">
        Operativos cerrojo en estaciones de Temperley y Lomas. La brigada investiga conexiones directas con cabecillas interprovinciales. Secreto de sumario ordenado por el Juzgado.
      </p>

      {/* Sello policial de comisaría */}
      <div className="mt-1.5 flex items-center justify-between text-[6px] sm:text-[7px] font-mono font-bold text-blue-900 border-t border-dashed border-blue-800/40 pt-1">
        <span>DDI LANÚS — POLICÍA PBA</span>
        <span>PRIORIDAD 1</span>
      </div>
    </div>
  );
}

/**
 * MATE ARGENTINO TRADICIONAL
 * Calabaza/cuero con virola de alpaca grabada, yerba mate con espumita y montañita,
 * bombilla metálica con anillo dorado, humito caliente y sombra sobre la mesa de madera.
 */
export function ArgentineMateDecor({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative select-none pointer-events-none transition-transform duration-300 drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] ${className}`}
    >
      {/* Humito cálido sutil que sube del mate */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 pointer-events-none opacity-40">
        <svg viewBox="0 0 40 40" className="w-full h-full animate-pulse">
          <path
            d="M 16 35 C 13 25, 23 18, 18 8"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.75"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 23 35 C 26 26, 17 20, 22 10"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.25"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <svg
        viewBox="0 0 120 120"
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 overflow-visible"
        aria-label="Mate Argentino"
      >
        <defs>
          {/* Sombra de contacto difusa sobre la mesa */}
          <radialGradient id="tableContactShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.95)" />
            <stop offset="50%" stopColor="rgba(0,0,0,0.7)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Gradiente del cuerpo de cuero/calabaza del mate */}
          <linearGradient id="mateLeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a2612" />
            <stop offset="25%" stopColor="#2e160a" />
            <stop offset="70%" stopColor="#1a0c05" />
            <stop offset="100%" stopColor="#0b0502" />
          </linearGradient>

          {/* Gradiente de la Virola de Alpaca / Acero Inox */}
          <linearGradient id="virolaMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4d4d8" />
            <stop offset="18%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#71717a" />
            <stop offset="60%" stopColor="#e4e4e7" />
            <stop offset="85%" stopColor="#52525b" />
            <stop offset="100%" stopColor="#a1a1aa" />
          </linearGradient>

          {/* Gradiente de la Bombilla Metálica */}
          <linearGradient id="bombillaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a1a1aa" />
            <stop offset="30%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#71717a" />
            <stop offset="100%" stopColor="#e4e4e7" />
          </linearGradient>

          {/* Gradiente del anillo dorado de la bombilla */}
          <linearGradient id="bombillaGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Gradiente de la Yerba Mate húmeda y espumosa */}
          <radialGradient id="yerbaGrad" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#4d7c0f" />
            <stop offset="45%" stopColor="#365314" />
            <stop offset="80%" stopColor="#1a2e05" />
            <stop offset="100%" stopColor="#0f1a03" />
          </radialGradient>
        </defs>

        {/* 1. Sombra sobre la mesa */}
        <ellipse cx="60" cy="104" rx="42" ry="12" fill="url(#tableContactShadow)" />
        <ellipse cx="60" cy="103" rx="30" ry="7" fill="rgba(0,0,0,0.85)" />

        {/* 2. Base posa-mate de cuero o madera */}
        <ellipse cx="60" cy="99" rx="26" ry="6" fill="#1c0e06" stroke="#3b1d0c" strokeWidth="1" />

        {/* 3. Cuerpo de la calabaza / cuero del Mate */}
        <path
          d="M 33 46 C 24 57, 21 73, 26 87 C 31 96, 44 100, 60 100 C 76 100, 89 96, 94 87 C 99 73, 96 57, 87 46 Z"
          fill="url(#mateLeatherGrad)"
          stroke="#1f0d04"
          strokeWidth="1.5"
        />

        {/* Costura artesanal criolla de cuero en el frente */}
        <path
          d="M 60 48 L 60 99"
          stroke="#92400e"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0.8"
        />
        {/* Pequeños cruces de hilo encerado */}
        <g stroke="#b45309" strokeWidth="0.8" opacity="0.6">
          <line x1="58" y1="56" x2="62" y2="58" />
          <line x1="62" y1="56" x2="58" y2="58" />
          <line x1="58" y1="68" x2="62" y2="70" />
          <line x1="62" y1="68" x2="58" y2="70" />
          <line x1="58" y1="80" x2="62" y2="82" />
          <line x1="62" y1="80" x2="58" y2="82" />
          <line x1="58" y1="92" x2="62" y2="94" />
          <line x1="62" y1="92" x2="58" y2="94" />
        </g>

        {/* Brillo curvo del cuero satinado a la izquierda */}
        <path
          d="M 28 56 C 24 68, 26 81, 33 90"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* 4. Virola de Alpaca (Boca metálica) */}
        {/* Base exterior de la virola */}
        <ellipse
          cx="60"
          cy="46"
          rx="29"
          ry="11"
          fill="url(#virolaMetalGrad)"
          stroke="#3f3f46"
          strokeWidth="1"
        />
        {/* Labio biselado superior */}
        <ellipse
          cx="60"
          cy="45"
          rx="27"
          ry="9.5"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="0.8"
        />
        {/* Cincelado decorativo criollo en la virola */}
        <ellipse
          cx="60"
          cy="46"
          rx="25.5"
          ry="8.5"
          fill="none"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="0.75"
          strokeDasharray="2 1.5"
        />

        {/* 5. Yerba Mate en el interior */}
        <ellipse cx="60" cy="46" rx="23" ry="8" fill="url(#yerbaGrad)" />

        {/* Montañita de yerba seca a la izquierda */}
        <ellipse
          cx="52"
          cy="45"
          rx="12"
          ry="5.5"
          fill="#4d7c0f"
          opacity="0.85"
        />
        <circle cx="49" cy="44" r="1.5" fill="#65a30d" />
        <circle cx="53" cy="46" r="1.2" fill="#84cc16" />
        <circle cx="46" cy="45" r="1" fill="#3f6212" />
        <circle cx="56" cy="43" r="1" fill="#65a30d" />

        {/* Espumita verde clara y blanca donde entra el agua */}
        <ellipse cx="68" cy="47" rx="8" ry="3.5" fill="#1e2908" opacity="0.9" />
        <circle cx="66" cy="46" r="1.8" fill="#bef264" opacity="0.7" />
        <circle cx="70" cy="47" r="1.5" fill="#d9f99d" opacity="0.75" />
        <circle cx="64" cy="48" r="1.2" fill="#bef264" opacity="0.6" />
        <circle cx="72" cy="46" r="1.4" fill="#ecfccb" opacity="0.8" />
        <circle cx="68" cy="49" r="1.1" fill="#bef264" opacity="0.65" />

        {/* Sombra de la bombilla dentro del mate */}
        <line
          x1="66"
          y1="47"
          x2="56"
          y2="52"
          stroke="rgba(0,0,0,0.6)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* 6. Bombilla de Alpaca/Acero Inoxidable */}
        {/* Tubo de la bombilla inclinado */}
        <line
          x1="67"
          y1="47"
          x2="92"
          y2="10"
          stroke="url(#bombillaGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Brillo especular blanco en el lomo de la bombilla */}
        <line
          x1="67.5"
          y1="46.5"
          x2="91.5"
          y2="10"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Anillo dorado ornamental de la bombilla */}
        <line
          x1="81"
          y1="26"
          x2="84"
          y2="21.5"
          stroke="url(#bombillaGoldRing)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Pico / Boquilla curva ("pico de loro") en la punta */}
        <path
          d="M 91 11 Q 94 7 98 7"
          stroke="url(#bombillaGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 91.5 10.5 Q 94 6.8 97.5 6.8"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />

        {/* Briznas de yerba caídas sobre la mesa */}
        <ellipse cx="28" cy="105" rx="1.5" ry="0.8" fill="#4d7c0f" opacity="0.75" />
        <ellipse cx="94" cy="104" rx="1.2" ry="0.7" fill="#365314" opacity="0.7" />
        <ellipse cx="98" cy="106" rx="1" ry="0.6" fill="#4d7c0f" opacity="0.65" />
      </svg>
    </div>
  );
}
