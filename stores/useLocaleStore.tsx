"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import type { Locale } from "@/lib/i18n/locale";
import { writeLocaleCookie } from "@/lib/i18n/localeStorage";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

// Un store por pedido (no global): en el servidor dos visitantes con idiomas distintos no se pisan
function createLocaleStore(initial: Locale): StoreApi<LocaleState> {
  return createStore<LocaleState>()((set) => ({
    locale: initial,
    setLocale: (locale) => {
      writeLocaleCookie(locale);
      set({ locale });
    },
  }));
}

const LocaleStoreContext = createContext<StoreApi<LocaleState> | null>(null);

/** Va en el layout raíz con el idioma que leyó el servidor de la cookie */
export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [store] = useState(() => createLocaleStore(initialLocale));
  return <LocaleStoreContext.Provider value={store}>{children}</LocaleStoreContext.Provider>;
}

export function useLocaleStore<T>(selector: (state: LocaleState) => T): T {
  const store = useContext(LocaleStoreContext);
  if (!store) throw new Error("useLocaleStore requiere <LocaleProvider> en el layout");
  return useStore(store, selector);
}

export function useLocale(): Locale {
  return useLocaleStore((s) => s.locale);
}
