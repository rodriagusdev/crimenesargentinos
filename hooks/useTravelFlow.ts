"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export type TravelState<T> =
  | { status: "idle" }
  | { status: "confirming"; target: T }
  | { status: "traveling"; from: T | null; to: T }
  | { status: "error"; message: string };

export interface UseTravelFlowOptions<T extends { id: string }> {
  current?: T | null;
  currentId?: string | null;
  onTravel: (target: T) => Promise<unknown>;
  onPreload?: (target: T) => void | Promise<unknown>;
  getRoute: (target: T) => string;
  durationMs?: number;
  errorMessageFallback?: string;
  onBeforeSelect?: (target: T) => void;
}

export function useTravelFlow<T extends { id: string }>({
  current,
  currentId,
  onTravel,
  onPreload,
  getRoute,
  durationMs = 1400,
  errorMessageFallback = "No se pudo realizar el viaje",
  onBeforeSelect,
}: UseTravelFlowOptions<T>) {
  const router = useRouter();
  const [state, setState] = useState<TravelState<T>>({ status: "idle" });

  const isTraveling = state.status === "traveling";
  const selected = state.status === "confirming" ? state.target : null;
  const travelingTo = state.status === "traveling" ? state.to : null;
  const travelFrom = state.status === "traveling" ? state.from : null;
  const error = state.status === "error" ? state.message : null;

  const select = useCallback(
    (target: T) => {
      if (state.status === "traveling") return;
      onBeforeSelect?.(target);

      // Si ya está en este destino, navega directo sin costo ni confirmación
      const activeId = current?.id ?? currentId;
      if (activeId && target.id === activeId) {
        router.push(getRoute(target));
        return;
      }

      setState({ status: "confirming", target });
    },
    [state.status, current?.id, currentId, onBeforeSelect, router, getRoute]
  );

  const confirm = useCallback(async () => {
    if (state.status !== "confirming") return;
    const target = state.target;
    const from = current ?? null;

    setState({ status: "traveling", from, to: target });

    try {
      const route = getRoute(target);
      router.prefetch(route);

      await Promise.all([
        onTravel(target),
        onPreload ? onPreload(target) : Promise.resolve(),
        new Promise((resolve) => setTimeout(resolve, durationMs)),
      ]);

      router.push(route);
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : errorMessageFallback,
      });
    }
  }, [state, current, getRoute, onTravel, onPreload, durationMs, errorMessageFallback, router]);

  const cancel = useCallback(() => {
    if (state.status === "traveling") return;
    setState({ status: "idle" });
  }, [state.status]);

  const clearError = useCallback(() => {
    setState((prev) => (prev.status === "error" ? { status: "idle" } : prev));
  }, []);

  return {
    state,
    isTraveling,
    selected,
    travelingTo,
    travelFrom,
    error,
    select,
    confirm,
    cancel,
    clearError,
  };
}
