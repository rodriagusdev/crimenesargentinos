"use client";

import { useState, type ChangeEvent } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import { API_URL, authHeaders, handleUnauthorized } from "@/lib/api";
import { slugify, type CaseAssetKind } from "@/lib/caseAssetPaths";
import { adminInputClass } from "./WizardField";

interface Props {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  kind: CaseAssetKind;
  level: number;
  caseTitle: string;
  hint?: string;
}

// URL de una imagen: se puede escribir una ruta de /images/... o subir el archivo al backend (queda en /uploads/...)
export default function ImageUrlField({ label, value, onChange, kind, level, caseTitle, hint }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);
      formData.append("level", String(level || 1));
      formData.append("slug", slugify(caseTitle || "caso"));
      // Sin Content-Type: el navegador arma el multipart con su boundary
      const { Authorization } = authHeaders() as Record<string, string>;
      const response = await fetch(`${API_URL}/api/CaseAssets`, { method: "POST", headers: { Authorization }, body: formData });
      handleUnauthorized(response);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || "No se pudo guardar la imagen.");
      onChange(payload.url || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la imagen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-slate-300">{label}</span>
      <div className="flex gap-2">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element -- preview de una ruta cargada a mano
          <img src={value} alt="" className="size-10 shrink-0 rounded border border-white/10 object-cover" />
        )}
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value.trim() || null)}
          className={adminInputClass}
          placeholder="/images/..."
        />
        <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-[#E1C380]/40 px-3 text-xs text-[#E1C380] transition hover:bg-[#E1C380]/10">
          <AdminIcon name="image" className="size-4" />
          {uploading ? "Subiendo..." : "Subir"}
          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={upload} disabled={uploading} />
        </label>
      </div>
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </div>
  );
}
