import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getGameData } from "@/services/levelService";
import { useFlagStore } from "@/stores/useFlagStore";
import { ICost, IGameCosts, IGameData } from "@/models/IGameData";

interface GameSessionState {
  levelId: number | null;
  currentTime: number;
  currentPI: number;
  initialTime: number;
  initialPI: number;
  costs: IGameCosts | null;
  initialRoute: string | null;
  isGameOver: boolean;
  gameOverReason: "time" | "pi" | null;
  discoveredClues: string[];
  askedQuestions: string[];

  // Métodos
  initSession: (levelId: number) => Promise<void>;
  addClue: (clue: string) => boolean;
  hasClue: (clue: string) => boolean;
  isQuestionAsked: (questionId: string) => boolean;
  markQuestionAsked: (questionId: string) => void;
  consumeCost: (cost: ICost) => boolean;
  consumeTravelProvince: () => boolean;
  consumeTravelLocation: () => boolean;
  consumeAskQuestion: () => boolean;
  resetSession: () => void;
  restartLevel: (levelId: number) => Promise<void>;
}

// Estado inicial de una partida a partir de la configuración del nivel
const freshSession = (levelId: number, data: IGameData) => ({
  levelId,
  currentTime: data.initialTime,
  currentPI: data.initialPI,
  initialTime: data.initialTime,
  initialPI: data.initialPI,
  costs: data.costs,
  initialRoute: data.initialRoute,
  isGameOver: false,
  gameOverReason: null,
  discoveredClues: [],
  askedQuestions: [],
});

export const useGameSessionStore = create<GameSessionState>()(
  persist(
    (set, get) => ({
      levelId: null,
      currentTime: 0,
      currentPI: 0,
      initialTime: 0,
      initialPI: 0,
      costs: null,
      initialRoute: null,
      isGameOver: false,
      gameOverReason: null,
      discoveredClues: [],
      askedQuestions: [],

      initSession: async (levelId: number) => {
        const state = get();
        const sameLevelInProgress =
          state.levelId === levelId && (state.currentTime > 0 || state.currentPI > 0);

        // Si ya está iniciada la sesión para este nivel y tiene recursos activos, no sobreescribir
        if (sameLevelInProgress && state.costs) {
          return;
        }

        const data = await getGameData(levelId);

        // Sesión en curso guardada sin costos: solo completar la configuración
        if (sameLevelInProgress) {
          set({ costs: data.costs, initialRoute: data.initialRoute });
          return;
        }

        // Los flags son del nivel anterior
        if (state.levelId !== levelId) {
          useFlagStore.getState().clearFlags();
        }

        set(freshSession(levelId, data));
      },

      addClue: (clue: string) => {
        const current = get().discoveredClues;
        if (!current.includes(clue)) {
          set({ discoveredClues: [...current, clue] });
          return true;
        }
        return false;
      },

      hasClue: (clue: string) => {
        return get().discoveredClues.includes(clue);
      },

      isQuestionAsked: (questionId: string) => {
        return get().askedQuestions.includes(questionId);
      },

      markQuestionAsked: (questionId: string) => {
        const current = get().askedQuestions;
        if (!current.includes(questionId)) {
          set({ askedQuestions: [...current, questionId] });
        }
      },

      restartLevel: async (levelId: number) => {
        const data = await getGameData(levelId);
        set(freshSession(levelId, data));
      },

      consumeCost: (cost: ICost) => {
        const { currentTime, currentPI, isGameOver } = get();
        if (isGameOver) return false;

        const newTime = Math.max(0, currentTime - cost.time);
        const newPI = Math.max(0, currentPI - cost.pi);

        let gameOver = false;
        let reason: "time" | "pi" | null = null;

        if (newTime <= 0) {
          gameOver = true;
          reason = "time";
        } else if (newPI <= 0) {
          gameOver = true;
          reason = "pi";
        }

        set({
          currentTime: newTime,
          currentPI: newPI,
          isGameOver: gameOver,
          gameOverReason: reason,
        });

        return true;
      },

      consumeTravelProvince: () => {
        const cost = get().costs?.travelProvince;
        return cost ? get().consumeCost(cost) : false;
      },

      consumeTravelLocation: () => {
        const cost = get().costs?.travelLocation;
        return cost ? get().consumeCost(cost) : false;
      },

      consumeAskQuestion: () => {
        const cost = get().costs?.askQuestion;
        return cost ? get().consumeCost(cost) : false;
      },

      resetSession: () => {
        set({
          levelId: null,
          currentTime: 0,
          currentPI: 0,
          initialTime: 0,
          initialPI: 0,
          costs: null,
          initialRoute: null,
          isGameOver: false,
          gameOverReason: null,
          discoveredClues: [],
          askedQuestions: [],
        });
      },
    }),
    {
      name: "game_session_storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
