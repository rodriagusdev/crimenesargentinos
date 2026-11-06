"use client";

import { create } from "zustand";

export interface AvatarOption {
  id: string;
  name: string;
  src: string;
}

export const AVAILABLE_AVATARS: AvatarOption[] = [
  { id: "avatar1", name: "Agente 1", src: "/images/avatars/avatar1.webp" },
  { id: "avatar2", name: "Agente 2", src: "/images/avatars/avatar2.webp" },
];

const STORAGE_KEY = "crimenes_player_avatar";

function getStoredAvatar(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (saved && AVAILABLE_AVATARS.some((a) => a.src === saved)) {
      return saved;
    }
  } catch {
    // Modo privado o restricciones de almacenamiento
  }
  return null; // Comienza vacío por defecto
}

interface AvatarStoreState {
  currentAvatar: string | null;
  setAvatar: (src: string | null) => void;
  initAvatar: () => void;
}

export const useAvatarStore = create<AvatarStoreState>()((set) => ({
  currentAvatar: null, // Comienza con avatar vacío

  setAvatar: (src: string | null) => {
    try {
      if (src) {
        sessionStorage.setItem(STORAGE_KEY, src);
        localStorage.setItem(STORAGE_KEY, src);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
    set({ currentAvatar: src });
  },

  initAvatar: () => {
    const stored = getStoredAvatar();
    set({ currentAvatar: stored });
  },
}));

