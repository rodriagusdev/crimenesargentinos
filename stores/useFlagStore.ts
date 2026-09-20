import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FlagState {
  flags: string[];
  addFlag: (flag: string | string[]) => void;
  removeFlag: (flag: string) => void;
  hasFlag: (flag: string) => boolean;
  hasAllFlags: (flags: string[]) => boolean;
  clearFlags: () => void;
}

export const useFlagStore = create<FlagState>()(
  persist(
    (set, get) => ({
      flags: [],

      addFlag: (flag: string | string[]) => {
        const toAdd = Array.isArray(flag) ? flag : [flag];
        const currentFlags = get().flags;
        const newFlags = toAdd.filter((f) => !currentFlags.includes(f));
        if (newFlags.length > 0) {
          set((state) => ({ flags: [...state.flags, ...newFlags] }));
        }
      },

      removeFlag: (flag: string) => {
        set((state) => ({
          flags: state.flags.filter((f) => f !== flag),
        }));
      },

      hasFlag: (flag: string) => {
        return get().flags.includes(flag);
      },

      hasAllFlags: (flags: string[]) => {
        const currentFlags = get().flags;
        return flags.every((f) => currentFlags.includes(f));
      },

      clearFlags: () => {
        set({ flags: [] });
      },
    }),
    {
      name: "game_flags_storage",
      storage: createJSONStorage(() => sessionStorage), // Persiste durante la sesión de juego
    }
  )
);
