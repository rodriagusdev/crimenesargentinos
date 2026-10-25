import { create } from "zustand";

export type SuspectBoardStatus = "neutral" | "suspect" | "discarded";

interface InvestigationBoardState {
  // Map of suspectId -> array of trait indices manually marked by the player
  markedTraits: Record<string, number[]>;
  // Map of suspectId -> visual suspect board status (neutral, suspect, discarded)
  suspectStatuses: Record<string, SuspectBoardStatus>;

  toggleTrait: (suspectId: string, traitIdx: number) => void;
  toggleSuspectStatus: (suspectId: string) => void;
  setSpecificStatus: (suspectId: string, targetStatus: "suspect" | "discarded") => void;
  resetBoard: () => void;
}

export const useInvestigationBoardStore = create<InvestigationBoardState>()((set) => ({
  markedTraits: {},
  suspectStatuses: {},

  toggleTrait: (suspectId, traitIdx) =>
    set((state) => {
      const currentList = state.markedTraits[suspectId] || [];
      const exists = currentList.includes(traitIdx);
      const updated = exists
        ? currentList.filter((idx) => idx !== traitIdx)
        : [...currentList, traitIdx];

      return {
        markedTraits: {
          ...state.markedTraits,
          [suspectId]: updated,
        },
      };
    }),

  toggleSuspectStatus: (suspectId) =>
    set((state) => {
      const current = state.suspectStatuses[suspectId] || "neutral";
      const next: SuspectBoardStatus =
        current === "neutral" ? "suspect" : current === "suspect" ? "discarded" : "neutral";

      return {
        suspectStatuses: {
          ...state.suspectStatuses,
          [suspectId]: next,
        },
      };
    }),

  setSpecificStatus: (suspectId, targetStatus) =>
    set((state) => {
      const current = state.suspectStatuses[suspectId] || "neutral";
      const next: SuspectBoardStatus = current === targetStatus ? "neutral" : targetStatus;

      return {
        suspectStatuses: {
          ...state.suspectStatuses,
          [suspectId]: next,
        },
      };
    }),

  resetBoard: () => set({ markedTraits: {}, suspectStatuses: {} }),
}));
