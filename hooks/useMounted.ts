"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true en el cliente tras la hidratación; false durante SSR y el primer render hidratado. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
