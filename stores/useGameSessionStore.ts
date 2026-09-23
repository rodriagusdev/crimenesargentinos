import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { gameData } from "@/data/gameData";
import { ICost } from "@/models/IGameData";

interface GameSessionState {
  levelId: number | null;
  currentTime: number;
  currentPI: number;
  initialTime: number;
  initialPI: number;
  isGameOver: boolean;
  gameOverReason: "time" | "pi" | null;
  discoveredClues: string[];
  askedQuestions: string[];

  // Métodos
  initSession: (levelId: number) => void;
  addClue: (clue: string) => boolean;
  hasClue: (clue: string) => boolean;
  isQuestionAsked: (questionId: string) => boolean;
  markQuestionAsked: (questionId: string) => void;
  consumeCost: (cost: ICost) => boolean;
  consumeTravelProvince: (levelId: number) => boolean;
  consumeTravelLocation: (levelId: number) => boolean;
  consumeAskQuestion: (levelId: number) => boolean;
  resetSession: () => void;
  restartLevel: (levelId: number) => void;
}

export const useGameSessionStore = create<GameSessionState>()(
  persist(
    (set, get) => ({
      levelId: null,
      currentTime: 0,
      currentPI: 0,
      initialTime: 0,
      initialPI: 0,
      isGameOver: false,
      gameOverReason: null,
      discoveredClues: [],
      askedQuestions: [],

      initSession: (levelId: number) => {
        const state = get();
        // Si ya está iniciada la sesión para este nivel y tiene recursos activos, no sobreescribir
        if (state.levelId === levelId && (state.currentTime > 0 || state.currentPI > 0)) {
          return;
        }

        const data = gameData.find((g) => g.levelId === levelId) ?? gameData[0];
        set({
          levelId,
          currentTime: data?.initialTime ?? 0,
          currentPI: data?.initialPI ?? 0,
          initialTime: data?.initialTime ?? 0,
          initialPI: data?.initialPI ?? 0,
          isGameOver: false,
          gameOverReason: null,
          discoveredClues: [],
          askedQuestions: [],
        });
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

      restartLevel: (levelId: number) => {
        const data = gameData.find((g) => g.levelId === levelId) ?? gameData[0];
        set({
          levelId,
          currentTime: data?.initialTime ?? 0,
          currentPI: data?.initialPI ?? 0,
          initialTime: data?.initialTime ?? 0,
          initialPI: data?.initialPI ?? 0,
          isGameOver: false,
          gameOverReason: null,
          discoveredClues: [],
          askedQuestions: [],
        });
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

      consumeTravelProvince: (levelId: number) => {
        const data = gameData.find((g) => g.levelId === levelId);
        const cost = data?.costs.travelProvince ?? { time: 4, pi: 15 };
        return get().consumeCost(cost);
      },

      consumeTravelLocation: (levelId: number) => {
        const data = gameData.find((g) => g.levelId === levelId);
        const cost = data?.costs.travelLocation ?? { time: 2, pi: 10 };
        return get().consumeCost(cost);
      },

      consumeAskQuestion: (levelId: number) => {
        const data = gameData.find((g) => g.levelId === levelId);
        const cost = data?.costs.askQuestion ?? { time: 1, pi: 5 };
        return get().consumeCost(cost);
      },

      resetSession: () => {
        set({
          levelId: null,
          currentTime: 0,
          currentPI: 0,
          initialTime: 0,
          initialPI: 0,
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
