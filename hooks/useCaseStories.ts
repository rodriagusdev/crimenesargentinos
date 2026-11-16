"use client";

import { useMemo } from "react";
import { localizeStories, type CaseStory } from "@/lib/caseStories";
import { useLocale } from "@/stores/useLocaleStore";

/** Historias públicas de los casos en el idioma del jugador */
export function useCaseStories(): CaseStory[] {
  const locale = useLocale();
  return useMemo(() => localizeStories(locale), [locale]);
}
