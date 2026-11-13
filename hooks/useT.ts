"use client";

import { useCallback } from "react";
import { formatMessage, type Messages, type MessageVars } from "@/lib/i18n/messages";
import { useLocale } from "@/stores/useLocaleStore";

/** Traductor de un componente: `const t = useT(messages); t("title")` */
export function useT<K extends string>(messages: Messages<K>) {
  const locale = useLocale();
  return useCallback((key: K, vars?: MessageVars) => formatMessage(messages[locale][key], vars), [locale, messages]);
}
