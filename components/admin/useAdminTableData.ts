"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/hooks/useT";
import { findAdminTable, type AdminTable } from "@/lib/adminTables";
import { AdminApiError, listRows, type AdminRow } from "@/services/adminService";
import { adminTableMessages } from "./AdminTablePage.messages";
import type { ReferenceMap } from "./adminTableUi";

// Registros de una tabla del panel y las opciones de las tablas a las que apunta, con recarga y manejo de sesión
export function useAdminTableData(table: AdminTable) {
  const t = useT(adminTableMessages);
  const router = useRouter();
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [references, setReferences] = useState<ReferenceMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 401: sesión vencida, 403: no es admin
  const handleAuthError = useCallback(
    (err: unknown) => {
      if (err instanceof AdminApiError && err.status === 401) router.replace("/login");
      else if (err instanceof AdminApiError && err.status === 403) router.replace("/principal");
    },
    [router],
  );

  const fetchData = useCallback(async () => {
    const referenced = Array.from(new Set(table.fields.filter((f) => f.reference).map((f) => f.reference!)));
    const [data, ...refData] = await Promise.all([
      listRows(table.controller),
      ...referenced.map((key) => listRows(findAdminTable(key)!.controller)),
    ]);

    const refs: ReferenceMap = {};
    referenced.forEach((key, i) => {
      const refTable = findAdminTable(key)!;
      const options = refData[i]
        .map((r) => ({ value: String(r.id), label: refTable.label(r) }))
        .sort((a, b) => a.label.localeCompare(b.label, "es", { numeric: true }));
      refs[key] = { options, labels: new Map(options.map((o) => [o.value, o.label])) };
    });

    return { data, refs };
  }, [table]);

  const applyResult = useCallback((result: { data: AdminRow[]; refs: ReferenceMap }) => {
    setRows(result.data);
    setReferences(result.refs);
  }, []);

  const applyError = useCallback(
    (err: unknown) => {
      handleAuthError(err);
      setError(err instanceof Error ? err.message : t("loadFailed"));
    },
    [handleAuthError, t],
  );

  // La página recrea el componente por tabla (key), así que el estado arranca limpio
  useEffect(() => {
    let cancelled = false;
    fetchData()
      .then((result) => !cancelled && applyResult(result))
      .catch((err) => !cancelled && applyError(err))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [fetchData, applyResult, applyError]);

  // Recarga después de guardar o borrar
  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      applyResult(await fetchData());
    } catch (err) {
      applyError(err);
    } finally {
      setLoading(false);
    }
  };

  return { rows, references, loading, error, setError, reload, handleAuthError };
}
