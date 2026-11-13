"use client";

import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import { useT } from "@/hooks/useT";
import { projectLatLonToMap } from "@/lib/mapCalibration";
import ImageUrlField from "./ImageUrlField";
import { stepProvincesMessages } from "./StepProvinces.messages";
import type { StepProps } from "./types";

// Paso 2: provincias del caso. Sus locaciones son los lugares que se pueden visitar (cada una va a tener un testigo)
export default function StepProvinces({ draft, update, catalog }: StepProps) {
  const t = useT(stepProvincesMessages);
  const selected = new Set(draft.provinces.map((p) => p.provinceId));

  const toggle = (provinceId: string) => {
    update((d) => {
      if (d.provinces.some((p) => p.provinceId === provinceId)) {
        return { ...d, provinces: d.provinces.filter((p) => p.provinceId !== provinceId) };
      }
      const province = catalog.provinces.find((p) => p.id === provinceId);
      const pin = province?.latitude != null && province.longitude != null ? projectLatLonToMap(province.latitude, province.longitude) : null;
      return { ...d, provinces: [...d.provinces, { provinceId, top: pin?.top ?? null, left: pin?.left ?? null, icon: null }] };
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        {t("introA")}{" "}
        <Link href="/admin/provinces" className="text-[#E1C380] underline" target="_blank">{t("provinces")}</Link> {t("or")}{" "}
        <Link href="/admin/locations" className="text-[#E1C380] underline" target="_blank">{t("locations")}</Link> {t("introB")}
      </p>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.provinces.map((province) => {
          const locations = catalog.locations.filter((l) => l.provinceId === province.id);
          const missingCoords = province.latitude == null || locations.some((l) => l.latitude == null);
          const isSelected = selected.has(province.id);
          return (
            <button
              key={province.id}
              type="button"
              onClick={() => toggle(province.id)}
              disabled={locations.length === 0}
              className={`rounded-lg border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${isSelected ? "border-[#E1C380] bg-[#E1C380]/10" : "border-white/10 hover:bg-white/[0.03]"}`}
            >
              <span className="flex items-center justify-between text-sm font-medium text-slate-100">
                {province.name}
                {isSelected && <AdminIcon name="check" className="size-4 text-[#E1C380]" />}
              </span>
              <span className="mt-1 block text-xs text-slate-400">
                {locations.length === 0 ? t("noLocations") : locations.map((l) => l.name).join(" · ")}
              </span>
              {missingCoords && locations.length > 0 && <span className="mt-1 block text-xs text-amber-300">{t("missingCoords")}</span>}
            </button>
          );
        })}
      </div>

      {draft.provinces.length > 0 && (
        <div className="space-y-3 rounded-lg border border-white/10 p-3">
          <p className="text-sm font-medium text-slate-200">{t("iconsTitle")}</p>
          {draft.provinces.map((p) => {
            const name = catalog.provinces.find((c) => c.id === p.provinceId)?.name ?? p.provinceId;
            return (
              <ImageUrlField
                key={p.provinceId}
                label={`${name}${p.top ? ` (${t("pinAt", { top: p.top, left: p.left ?? "" })})` : ""}`}
                value={p.icon}
                onChange={(url) => update((d) => ({ ...d, provinces: d.provinces.map((x) => (x.provinceId === p.provinceId ? { ...x, icon: url } : x)) }))}
                kind="location"
                level={draft.groupLevel}
                caseTitle={draft.title}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
