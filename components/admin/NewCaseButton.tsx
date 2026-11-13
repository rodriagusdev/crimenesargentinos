"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";
import AdminIcon from "./AdminIcon";
import CaseWizard from "./case-wizard/CaseWizard";

const messages = defineMessages({
  es: { label: "Crear o editar un caso" },
  en: { label: "Create or edit a case" },
});

// Abre el asistente de casos (crear o editar); si se guardó algo, lleva a la tabla de casos
export default function NewCaseButton() {
  const t = useT(messages);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-[#E1C380] px-4 py-2.5 text-sm font-medium text-[#0a0f18] transition hover:bg-[#ecd29a]"
      >
        <AdminIcon name="plus" />
        {t("label")}
      </button>

      {open && (
        <CaseWizard
          onClose={(created) => {
            setOpen(false);
            if (created) router.push("/admin/cases");
          }}
        />
      )}
    </>
  );
}
