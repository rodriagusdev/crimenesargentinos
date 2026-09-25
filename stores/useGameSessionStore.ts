import { create } from "zustand";
import { getGameData } from "@/services/levelService";
import {
  askQuestion as askQuestionApi,
  GameSessionApiError,
  getSession,
  markIntroSeen as markIntroSeenApi,
  restartSession,
  sessionRoute,
  startOrResumeSession,
  travelToLocation,
  travelToProvince,
} from "@/services/gameSessionService";
import { IGameCosts } from "@/models/IGameData";
import { IAskQuestionResult, IGameSession } from "@/models/IGameSession";

// El progreso lo guarda el backend (/api/GameSessions): este store es solo la copia del último estado recibido
interface GameSessionState {
  levelId: number | null;
  session: IGameSession | null;
  costs: IGameCosts | null; // de game-data, para mostrar el precio antes de confirmar

  // Atajos al estado de la partida
  currentTime: number;
  currentPI: number;
  initialTime: number;
  initialPI: number;
  isGameOver: boolean;
  gameOverReason: IGameSession["gameOverReason"];
  discoveredClues: string[];
  askedQuestions: string[];
  flags: string[];
  initialRoute: string | null; // pantalla donde quedó el jugador

  // Métodos
  initSession: (levelId: number) => Promise<IGameSession>;
  travelProvince: (provinceId: string) => Promise<IGameSession>;
  travelLocation: (locationId: string) => Promise<IGameSession>;
  markIntroSeen: (locationId: string) => Promise<IGameSession>;
  askQuestion: (questionCode: string) => Promise<IAskQuestionResult>;
  restartLevel: (levelId: number) => Promise<void>;
  resetSession: () => void;
}

const emptySession = {
  levelId: null,
  session: null,
  costs: null,
  currentTime: 0,
  currentPI: 0,
  initialTime: 0,
  initialPI: 0,
  isGameOver: false,
  gameOverReason: null,
  discoveredClues: [],
  askedQuestions: [],
  flags: [],
  initialRoute: null,
};

const fromSession = (session: IGameSession) => ({
  levelId: session.caseId,
  session,
  currentTime: session.currentTime,
  currentPI: session.currentPI,
  initialTime: session.initialTime,
  initialPI: session.initialPI,
  isGameOver: session.isGameOver,
  gameOverReason: session.gameOverReason,
  discoveredClues: session.discoveredClues,
  askedQuestions: session.askedQuestions,
  flags: session.flags,
  initialRoute: sessionRoute(session),
});

// Varios componentes de la misma pantalla inician la partida a la vez: se comparte la misma request
let pendingInit: { levelId: number; promise: Promise<IGameSession> } | null = null;

export const useGameSessionStore = create<GameSessionState>()((set, get) => {
  const applySession = (session: IGameSession) => set(fromSession(session));

  // Ejecuta una acción sobre la partida y guarda el estado que devuelve el servidor
  const act = async <T>(call: (sessionId: string) => Promise<T>, stateOf: (result: T) => IGameSession): Promise<T> => {
    const { session } = get();
    if (!session) throw new Error("No hay una partida iniciada");

    try {
      const result = await call(session.sessionId);
      applySession(stateOf(result));
      return result;
    } catch (err) {
      // 409: la partida ya terminó; se trae el estado para que se muestre el resultado
      if (err instanceof GameSessionApiError && err.status === 409) {
        applySession(await getSession(session.sessionId));
      }
      throw err;
    }
  };

  return {
    ...emptySession,

    initSession: (levelId: number) => {
      const { session, costs } = get();
      if (session && costs && session.caseId === levelId) {
        return Promise.resolve(session);
      }

      if (pendingInit?.levelId === levelId) {
        return pendingInit.promise;
      }

      // La partida va primero: si falla (401, 403) ese es el error que se reporta
      const promise = Promise.all([startOrResumeSession(levelId), getGameData(levelId)])
        .then(([newSession, gameData]) => {
          set({ ...fromSession(newSession), costs: gameData.costs });
          return newSession;
        })
        .finally(() => {
          if (pendingInit?.promise === promise) pendingInit = null;
        });

      pendingInit = { levelId, promise };
      return promise;
    },

    travelProvince: (provinceId: string) =>
      act((sessionId) => travelToProvince(sessionId, provinceId), (session) => session),

    travelLocation: (locationId: string) =>
      act((sessionId) => travelToLocation(sessionId, locationId), (session) => session),

    markIntroSeen: (locationId: string) =>
      act((sessionId) => markIntroSeenApi(sessionId, locationId), (session) => session),

    askQuestion: (questionCode: string) =>
      act((sessionId) => askQuestionApi(sessionId, questionCode), (result) => result.state),

    restartLevel: async (levelId: number) => {
      const { session } = get();
      if (session && session.caseId === levelId && session.status === "InProgress") {
        await act((sessionId) => restartSession(sessionId), (newSession) => newSession);
        return;
      }

      // La partida ya terminó: se empieza una nueva
      const newSession = await startOrResumeSession(levelId);
      applySession(newSession);
    },

    // Solo limpia la copia local: la partida sigue guardada en el servidor para continuarla
    resetSession: () => {
      pendingInit = null;
      set(emptySession);
    },
  };
});
