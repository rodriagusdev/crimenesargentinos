"use client";

import { useEffect, useRef, useState } from "react";
import { audioManager } from "@/lib/audioManager";

// ms por letra y cada cuántas letras suena la máquina de escribir
const TYPE_MS = 25;
const SFX_EVERY = 3;

/**
 * Texto a máquina: escribe `text` letra por letra con el sonido de la máquina y avisa con `onDone` al terminar.
 * Es el único que se vuelve a renderizar en cada letra (el informe y el tablero que lo rodean quedan quietos).
 * Para reiniciar con otro texto, montarlo con `key={text}`.
 */
export default function TypedText({ text, onDone }: { text: string; onDone: () => void }) {
  const [count, setCount] = useState(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!text) return;
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        if (index % SFX_EVERY === 0) audioManager.play("typewriter", { volume: 0.3 });
        index++;
        setCount(index);
      } else {
        clearInterval(timer);
        onDoneRef.current();
      }
    }, TYPE_MS);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <>
      {text.slice(0, count)}
      <span className="ml-0.5 inline-block h-5 w-2.5 bg-zinc-800 align-middle animate-pulse" />
    </>
  );
}
