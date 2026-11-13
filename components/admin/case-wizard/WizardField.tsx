import type { ReactNode } from "react";

export { adminInputClass } from "@/components/admin/AdminFieldInput";

interface Props {
  label: string;
  hint?: string;
  children: ReactNode;
}

// Etiqueta + control + ayuda opcional, con el estilo del panel
export default function WizardField({ label, hint, children }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
