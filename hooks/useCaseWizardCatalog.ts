"use client";

import { useEffect, useState } from "react";
import { listRows, type AdminRow } from "@/services/adminService";

export interface CatalogProvince {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

export interface CatalogLocation {
  id: string;
  provinceId: string;
  name: string;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface CatalogSuspect {
  id: string;
  name: string;
  imageUrl: string | null;
  traits: string[];
}

export interface CatalogCase {
  id: number;
  title: string;
  groupLevel: number;
}

export interface CaseWizardCatalog {
  provinces: CatalogProvince[];
  locations: CatalogLocation[];
  suspects: CatalogSuspect[];
  cases: CatalogCase[];
}

export type CatalogState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; catalog: CaseWizardCatalog };

const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const num = (v: unknown) => (v === null || v === undefined || v === "" ? null : Number(v));

// Provincias, locaciones, sospechosos (con rasgos) y casos existentes, para armar un caso nuevo
export function useCaseWizardCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    Promise.all([listRows("Province"), listRows("Location"), listRows("Suspects"), listRows("SuspectTrait"), listRows("Cases")])
      .then(([provinces, locations, suspects, traits, cases]) => {
        if (cancelled) return;
        const traitsBySuspect = new Map<string, AdminRow[]>();
        for (const t of traits) {
          const list = traitsBySuspect.get(str(t.suspectId)) ?? [];
          list.push(t);
          traitsBySuspect.set(str(t.suspectId), list);
        }

        setState({
          kind: "ready",
          catalog: {
            provinces: provinces
              .map((p) => ({ id: str(p.id), name: str(p.name), latitude: num(p.latitude), longitude: num(p.longitude) }))
              .sort((a, b) => a.name.localeCompare(b.name)),
            locations: locations
              .map((l) => ({
                id: str(l.id), provinceId: str(l.provinceId), name: str(l.name),
                imageUrl: l.imageUrl ? str(l.imageUrl) : null, latitude: num(l.latitude), longitude: num(l.longitude),
              }))
              .sort((a, b) => a.name.localeCompare(b.name)),
            suspects: suspects
              .map((s) => ({
                id: str(s.id), name: str(s.name), imageUrl: s.imageUrl ? str(s.imageUrl) : null,
                traits: (traitsBySuspect.get(str(s.id)) ?? [])
                  .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
                  .map((t) => str(t.text)),
              }))
              .sort((a, b) => a.name.localeCompare(b.name)),
            cases: cases.map((c) => ({ id: Number(c.id), title: str(c.title), groupLevel: Number(c.groupLevel) })),
          },
        });
      })
      .catch((err) => {
        if (!cancelled) setState({ kind: "error", message: err instanceof Error ? err.message : "No se pudieron cargar los datos." });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
