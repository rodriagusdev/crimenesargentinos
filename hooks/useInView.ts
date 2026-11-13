"use client";

import { useEffect, useRef, useState } from "react";

/**
 * true a partir de que el elemento entra en pantalla (una sola vez: no se "des-anima" al salir).
 * Para animaciones que arrancan al hacer scroll.
 */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}
