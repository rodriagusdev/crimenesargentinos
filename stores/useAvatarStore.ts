"use client";

import { API_URL } from "@/lib/api";
import { getTokenClaims, isTokenExpired } from "@/lib/auth";
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
  return null;
}

function buildAuthHeaders(): HeadersInit | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("auth_token");
  const claims = getTokenClaims();

  if (!token || !claims || isTokenExpired(claims)) {
    return null;
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function persistAvatarLocalFallback(src: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (src) {
      sessionStorage.setItem(STORAGE_KEY, src);
      localStorage.setItem(STORAGE_KEY, src);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Modo privado o restricciones de almacenamiento
  }
}

async function fetchAvatarFromServer(): Promise<string | null> {
  if (typeof window === "undefined") return getStoredAvatar();

  const headers = buildAuthHeaders();
  if (!headers) return getStoredAvatar();

  try {
    const response = await fetch(`${API_URL}/api/Auth/avatar`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return getStoredAvatar();
    }

    const data = await response.json().catch(() => ({}));
    const avatarUrl = typeof data?.avatarUrl === "string" ? data.avatarUrl : null;
    if (avatarUrl && AVAILABLE_AVATARS.some((a) => a.src === avatarUrl)) {
      await persistAvatarLocalFallback(avatarUrl);
      return avatarUrl;
    }
  } catch {
    // Ignorar y usar el valor local como respaldo
  }

  return getStoredAvatar();
}

interface AvatarStoreState {
  currentAvatar: string | null;
  setAvatar: (src: string | null) => Promise<void>;
  initAvatar: () => Promise<void>;
}

export const useAvatarStore = create<AvatarStoreState>()((set) => ({
  currentAvatar: null,

  setAvatar: async (src: string | null) => {
    const normalized = src && AVAILABLE_AVATARS.some((a) => a.src === src) ? src : null;

    await persistAvatarLocalFallback(normalized);
    set({ currentAvatar: normalized });

    const headers = buildAuthHeaders();
    if (!headers) return;

    try {
      await fetch(`${API_URL}/api/Auth/avatar`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ avatarUrl: normalized }),
      });
    } catch {
      // El avatar sigue guardado en caché local si la API no responde.
    }
  },

  initAvatar: async () => {
    const stored = await fetchAvatarFromServer();
    set({ currentAvatar: stored });
  },
}));

