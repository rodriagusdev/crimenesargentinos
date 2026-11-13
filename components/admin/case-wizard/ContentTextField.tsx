"use client";

import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";
import { useContentLanguage } from "./contentLanguage";
import { adminInputClass } from "./WizardField";

const messages = defineMessages({
  es: { reference: "Castellano:", noReference: "(sin texto en castellano)" },
  en: { reference: "Spanish:", noReference: "(no Spanish text)" },
});

interface Props {
  es: string | null | undefined;
  en: string | null | undefined;
  onEs: (value: string) => void;
  onEn: (value: string | null) => void;
  multiline?: boolean;
  className?: string; // clases extra del control (ej. min-h-20)
  placeholder?: string;
}

// Campo de texto del contenido del caso: en modo ES edita el castellano; en modo EN edita la traducción
// y muestra el castellano debajo como referencia (la traducción es opcional)
export default function ContentTextField({ es, en, onEs, onEn, multiline, className = "", placeholder }: Props) {
  const t = useT(messages);
  const lang = useContentLanguage();
  const isEn = lang === "en";
  const reference = es?.trim() ? es : null;

  const controlClass = `${adminInputClass} ${className} ${isEn ? "border-sky-400/30" : ""}`;
  const common = {
    value: (isEn ? en : es) ?? "",
    placeholder: isEn ? reference ?? placeholder : placeholder,
    className: controlClass,
    lang,
  };
  const change = (value: string) => (isEn ? onEn(value || null) : onEs(value));

  return (
    <span className="block w-full">
      {multiline ? (
        <textarea {...common} onChange={(e) => change(e.target.value)} />
      ) : (
        <input {...common} onChange={(e) => change(e.target.value)} />
      )}
      {isEn && (
        <span className="mt-1 block whitespace-pre-line text-[11px] text-sky-200/70">
          <span className="font-medium">{t("reference")}</span> {reference ?? t("noReference")}
        </span>
      )}
    </span>
  );
}
