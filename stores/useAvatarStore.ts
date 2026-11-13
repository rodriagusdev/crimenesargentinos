"use client";

import { API_URL, authHeaders, handleUnauthorized } from "@/lib/api";
import { getUserId } from "@/lib/auth";
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

const AVATAR_ENDPOINT = `${API_URL}/api/Auth/avatar`;

function normalizeAvatar(src: unknown): string | null {
  return typeof src === "string" && AVAILABLE_AVATARS.some((a) => a.src === src) ? src : null;
}

async function readAvatar(response: Response): Promise<string | null> {
  handleUnauthorized(response);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json().catch(() => ({}));
  return normalizeAvatar(data?.avatarUrl);
}

interface AvatarStoreState {
  // El avatar vive en la base (Users.AvatarUrl); acá solo se refleja el del usuario logueado
  currentAvatar: string | null;
  loadedForUser: string | null;
  saving: boolean;
  error: string | null;
  initAvatar: () => Promise<void>;
  setAvatar: (src: string | null) => Promise<void>;
}

export const useAvatarStore = create<AvatarStoreState>()((set, get) => ({
  currentAvatar: null,
  loadedForUser: null,
  saving: false,
  error: null,

  initAvatar: async () => {
    const userId = getUserId();
    if (!userId) {
      set({ currentAvatar: null, loadedForUser: null });
      return;
    }
    // Ya cargado (o cargándose) para este usuario: varios componentes lo piden al montar
    if (get().loadedForUser === userId) return;

    set({ currentAvatar: null, loadedForUser: userId, error: null });
    try {
      const avatar = await readAvatar(await fetch(AVATAR_ENDPOINT, { headers: authHeaders() }));
      if (get().loadedForUser === userId) set({ currentAvatar: avatar });
    } catch (err) {
      console.error("No se pudo cargar el avatar:", err);
      if (get().loadedForUser === userId) set({ loadedForUser: null });
    }
  },

  setAvatar: async (src: string | null) => {
    if (get().saving) return;
    set({ saving: true, error: null });
    try {
      const response = await fetch(AVATAR_ENDPOINT, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ avatarUrl: normalizeAvatar(src) }),
      });
      set({ currentAvatar: await readAvatar(response), loadedForUser: getUserId() });
    } catch (err) {
      console.error("No se pudo guardar el avatar:", err);
      set({ error: "No se pudo guardar el avatar. Probá de nuevo." });
    } finally {
      set({ saving: false });
    }
  },
}));
