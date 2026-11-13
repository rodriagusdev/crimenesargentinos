import type { Locale } from "./locale";
import { readLocaleCookie } from "./localeStorage";

/**
 * Textos de un componente o módulo en los dos idiomas. El inglés tiene que tener exactamente las mismas
 * claves que el castellano (lo controla TypeScript). Variables con llaves: "Hola {name}".
 *
 *   const messages = defineMessages({
 *     es: { title: "Elegí un caso", hours: "{n} horas" },
 *     en: { title: "Choose a case", hours: "{n} hours" },
 *   });
 */
export type MessageVars = Record<string, string | number>;
export type Messages<K extends string> = Record<Locale, Record<K, string>>;

export function defineMessages<K extends string>(messages: { es: Record<K, string>; en: Record<NoInfer<K>, string> }): Messages<K> {
  return messages;
}

export function formatMessage(template: string, vars?: MessageVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

/** Para código que no es un componente (servicios, helpers): usa el idioma guardado en la cookie */
export function translate<K extends string>(messages: Messages<K>, key: K, vars?: MessageVars): string {
  return formatMessage(messages[readLocaleCookie()][key], vars);
}
