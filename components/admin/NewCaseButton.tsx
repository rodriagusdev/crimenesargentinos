"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminIcon from "./AdminIcon";
import CaseWizard from "./case-wizard/CaseWizard";

// Abre el asistente de casos (crear o editar); si se guardó algo, lleva a la tabla de casos
export default function NewCaseButton() {
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
        Crear o editar un caso
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
