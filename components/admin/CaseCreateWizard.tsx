"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { adminInputClass } from "@/components/admin/AdminFieldInput";
import { createRow, listRows, type AdminRow } from "@/services/adminService";
import { slugify, type CaseAssetKind } from "@/lib/caseAssetPaths";
import AdminIcon from "@/components/admin/AdminIcon";

interface Props {
  onClose: () => void;
}

interface Draft extends AdminRow {
  title: string;
  description: string;
  groupLevel: number;
  imageUrl: string;
  videoUrl: string;
  briefing: string;
  initialTime: number;
  initialPI: number;
  startLocationId: string | null;
  criminalLocationId: string | null;
  travelProvinceTime: number;
  travelProvincePi: number;
  travelLocationTime: number;
  travelLocationPi: number;
  askQuestionTime: number;
  askQuestionPi: number;
}

const initialDraft: Draft = {
  title: "",
  description: "",
  groupLevel: 1,
  imageUrl: "",
  videoUrl: "",
  briefing: "",
  initialTime: 60,
  initialPI: 10,
  startLocationId: null,
  criminalLocationId: null,
  travelProvinceTime: 12,
  travelProvincePi: 2,
  travelLocationTime: 6,
  travelLocationPi: 1,
  askQuestionTime: 2,
  askQuestionPi: 1,
};

const stepTitles = [
  "Datos básicos",
  "Tiempo y costos",
  "Ubicación",
  "Mediación y revisión",
];

export default function CaseCreateWizard({ onClose }: Props) {
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([listRows("locations"), listRows("provinces")])
      .then(([locationRows, provinceRows]) => {
        if (cancelled) return;

        const names = (locationRows as Array<{ id: string; name: string }>).map((row) => ({ id: String(row.id), name: String(row.name) }));
        const provinces = (provinceRows as Array<{ id: string; name: string }>).map((row) => ({ id: String(row.id), name: String(row.name) }));

        setLocations([...names, ...provinces]);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudieron cargar las locaciones disponibles.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currentStep = useMemo(() => stepTitles[step], [step]);
  const isLastStep = step === stepTitles.length - 1;

  const updateValue = (field: keyof Draft, value: Draft[keyof Draft]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    const required = ["title", "description"] as const;
    const missing = required.filter((field) => !String(draft[field] ?? "").trim());

    if (missing.length > 0) {
      setError("Completá el título y la descripción antes de continuar.");
      return;
    }

    setError(null);
    setStep((prev) => Math.min(prev + 1, stepTitles.length - 1));
  };

  const previousStep = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const uploadAsset = async (event: ChangeEvent<HTMLInputElement>, kind: CaseAssetKind) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);
      formData.append("level", String(draft.groupLevel || 1));
      formData.append("slug", slugify(draft.title || "caso"));

      const response = await fetch("/api/admin/case-assets", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "No se pudo guardar la imagen.");
      }

      updateValue("imageUrl", payload.url || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo adjuntar la imagen.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSaving(true);

    try {
      const payload = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        groupLevel: Number(draft.groupLevel || 1),
        imageUrl: draft.imageUrl || null,
        videoUrl: draft.videoUrl || null,
        briefing: draft.briefing || null,
        initialTime: Number(draft.initialTime || 0),
        initialPI: Number(draft.initialPI || 0),
        startLocationId: draft.startLocationId || null,
        criminalLocationId: draft.criminalLocationId || null,
        travelProvinceTime: Number(draft.travelProvinceTime || 0),
        travelProvincePi: Number(draft.travelProvincePi || 0),
        travelLocationTime: Number(draft.travelLocationTime || 0),
        travelLocationPi: Number(draft.travelLocationPi || 0),
        askQuestionTime: Number(draft.askQuestionTime || 0),
        askQuestionPi: Number(draft.askQuestionPi || 0),
      };

      await createRow("Cases", payload);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el caso.");
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Título</label>
            <input value={draft.title} onChange={(e) => updateValue("title", e.target.value)} className={adminInputClass} placeholder="Ej. El Gran Robo del Alfajor" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Nivel</label>
            <input type="number" min={1} value={draft.groupLevel} onChange={(e) => updateValue("groupLevel", Number(e.target.value || 1))} className={adminInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Descripción</label>
            <textarea value={draft.description} onChange={(e) => updateValue("description", e.target.value)} className={`${adminInputClass} min-h-32`} placeholder="Resumen del caso..." />
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Tiempo inicial</label>
            <input type="number" value={draft.initialTime} onChange={(e) => updateValue("initialTime", Number(e.target.value || 0))} className={adminInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">PI iniciales</label>
            <input type="number" value={draft.initialPI} onChange={(e) => updateValue("initialPI", Number(e.target.value || 0))} className={adminInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Viajar a provincia: tiempo</label>
            <input type="number" value={draft.travelProvinceTime} onChange={(e) => updateValue("travelProvinceTime", Number(e.target.value || 0))} className={adminInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Viajar a provincia: PI</label>
            <input type="number" value={draft.travelProvincePi} onChange={(e) => updateValue("travelProvincePi", Number(e.target.value || 0))} className={adminInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Ir a locación: tiempo</label>
            <input type="number" value={draft.travelLocationTime} onChange={(e) => updateValue("travelLocationTime", Number(e.target.value || 0))} className={adminInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Ir a locación: PI</label>
            <input type="number" value={draft.travelLocationPi} onChange={(e) => updateValue("travelLocationPi", Number(e.target.value || 0))} className={adminInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Preguntar: tiempo</label>
            <input type="number" value={draft.askQuestionTime} onChange={(e) => updateValue("askQuestionTime", Number(e.target.value || 0))} className={adminInputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Preguntar: PI</label>
            <input type="number" value={draft.askQuestionPi} onChange={(e) => updateValue("askQuestionPi", Number(e.target.value || 0))} className={adminInputClass} />
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Locación inicial</label>
            <select value={draft.startLocationId ?? ""} onChange={(e) => updateValue("startLocationId", e.target.value || null)} className={adminInputClass}>
              <option value="">Seleccionar...</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Escondite del criminal</label>
            <select value={draft.criminalLocationId ?? ""} onChange={(e) => updateValue("criminalLocationId", e.target.value || null)} className={adminInputClass}>
              <option value="">Seleccionar...</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">Vista previa del caso</span>
            <span className="text-xs text-slate-500">Ruta guardada: {draft.imageUrl || "sin imagen"}</span>
          </div>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#E1C380]/50 bg-[#0a0f18] px-3 py-2 text-sm text-[#E1C380] transition hover:bg-[#0d1421]">
            <AdminIcon name="image" className="size-4" />
            {uploading ? "Guardando archivo..." : "Subir imagen del caso"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadAsset(e, "preview")} />
          </label>

          {draft.imageUrl && (
            <div className="mt-3 overflow-hidden rounded-md border border-white/10 bg-[#0a0f18]">
              <img src={draft.imageUrl} alt={draft.title || "Vista previa del caso"} className="h-44 w-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Video (URL)</label>
          <input value={draft.videoUrl} onChange={(e) => updateValue("videoUrl", e.target.value)} className={adminInputClass} placeholder="https://..." />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Briefing del caso</label>
          <textarea value={draft.briefing} onChange={(e) => updateValue("briefing", e.target.value)} className={`${adminInputClass} min-h-28`} placeholder="Resumen operativo del caso..." />
        </div>

        <div className="rounded-lg border border-white/10 bg-[#0a0f18] p-4 text-sm text-slate-300">
          <p className="font-medium text-slate-100">Resumen</p>
          <ul className="mt-3 space-y-2 text-xs text-slate-400">
            <li>• Caso: {draft.title || "Sin título"}</li>
            <li>• Nivel: {draft.groupLevel}</li>
            <li>• Tiempo inicial: {draft.initialTime} hs</li>
            <li>• PI iniciales: {draft.initialPI}</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d1421] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Nuevo caso</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-50">{currentStep}</h3>
          </div>
          <button className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-100" onClick={onClose} aria-label="Cerrar">
            <AdminIcon name="close" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="mb-5 flex items-center gap-2">
            {stepTitles.map((title, index) => (
              <div key={title} className="flex flex-1 items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${index <= step ? "bg-[#E1C380] text-[#0a0f18]" : "bg-white/[0.05] text-slate-500"}`}>
                  {index + 1}
                </div>
                {index < stepTitles.length - 1 && <div className={`h-px flex-1 ${index < step ? "bg-[#E1C380]" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>

          {renderStep()}

          {error && (
            <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
          <button className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.04]" onClick={onClose} disabled={saving}>
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.04]" onClick={previousStep} disabled={saving}>
                Atrás
              </button>
            )}

            {!isLastStep ? (
              <button className="rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18] transition hover:bg-[#ecd29a]" onClick={nextStep} disabled={saving}>
                Siguiente
              </button>
            ) : (
              <button className="rounded-md bg-[#E1C380] px-3.5 py-2 text-sm font-medium text-[#0a0f18] transition hover:bg-[#ecd29a] disabled:opacity-60" onClick={handleSubmit} disabled={saving}>
                {saving ? "Creando..." : "Crear caso"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
