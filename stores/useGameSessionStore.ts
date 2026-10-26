import { create } from "zustand";
import { getGameData } from "@/services/levelService";
import {
  askQuestion as askQuestionApi,
  GameSessionApiError,
  getSession,
  issueWarrant,
  markIntroSeen as markIntroSeenApi,
  playLevel,
  sessionRoute,
  startOrResumeSession,
  travelToLocation,
  travelToProvince,
} from "@/services/gameSessionService";
import { IGameCosts } from "@/models/IGameData";
import { ISuspect } from "@/models/ISuspect";
import { IAskQuestionResult, IGameSession } from "@/models/IGameSession";
import {
  preloadCasePackage,
  preloadProvincePackage,
  preloadLocationPackage,
} from "@/lib/assetPreloader";
import { useInvestigationBoardStore } from "./useInvestigationBoardStore";

// El progreso lo guarda el backend (/api/GameSessions): este store es solo la copia del último estado recibido
interface GameSessionState {
  levelId: number | null;
  session: IGameSession | null;
  costs: IGameCosts | null; // de game-data, para mostrar el precio antes de confirmar
  videoUrl: string | null; // video de intro del caso en juego
  suspects: ISuspect[]; // de game-data; el culpable no viene marcado
  briefing: string | null; // informe inicial del caso
  initialClues: string[]; // pistas del informe inicial

  // Atajos al estado de la partida
  currentTime: number;
  currentPI: number;
  initialTime: number;
  initialPI: number;
  isGameOver: boolean;
  gameOverReason: IGameSession["gameOverReason"];
  isVictory: boolean;
  discoveredClues: string[];
  askedQuestions: string[];
  flags: string[];
  initialRoute: string | null; // pantalla donde quedó el jugador
  isInvestigationMenuOpen: boolean;

  // Métodos
  initSession: (levelId: number) => Promise<IGameSession>;
  play: (level?: number) => Promise<IGameSession>; // retoma o sortea el caso del nivel habilitado; con nivel, rejuega uno completado
  travelProvince: (provinceId: string) => Promise<IGameSession>;
  travelLocation: (locationId: string) => Promise<IGameSession>;
  markIntroSeen: (locationId: string) => Promise<IGameSession>;
  askQuestion: (questionCode: string) => Promise<IAskQuestionResult>;
  issueArrestWarrant: (suspectId: string) => Promise<IGameSession>;
  restartLevel: (levelId: number) => Promise<void>;
  resetSession: () => void;
  setInvestigationMenuOpen: (open: boolean) => void;
  closeInvestigationMenu: () => void;
}

const emptySession = {
  levelId: null,
  session: null,
  costs: null,
  videoUrl: null,
  suspects: [],
  briefing: null,
  initialClues: [],
  currentTime: 0,
  currentPI: 0,
  initialTime: 0,
  initialPI: 0,
  isGameOver: false,
  gameOverReason: null,
  isVictory: false,
  discoveredClues: [],
  askedQuestions: [],
  flags: [],
  initialRoute: null,
  isInvestigationMenuOpen: false,
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
  isVictory: session.status === "Won",
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
          set({
            ...fromSession(newSession),
            costs: gameData.costs,
            videoUrl: gameData.videoUrl ?? null,
            suspects: gameData.suspects,
            briefing: gameData.info ?? null,
            initialClues: gameData.initialClues ?? [],
          });

          // Preload automático en background fuera del ciclo de vida de React
          preloadCasePackage(newSession.caseId, gameData.suspects);
          if (newSession.currentProvinceId) {
            preloadProvincePackage(newSession.currentProvinceId);
            if (newSession.currentLocationId) {
              preloadLocationPackage(newSession.caseId, newSession.currentProvinceId, newSession.currentLocationId);
            }
          }

          return newSession;
        })
        .finally(() => {
          if (pendingInit?.promise === promise) pendingInit = null;
        });

      pendingInit = { levelId, promise };
      return promise;
    },

    travelProvince: (provinceId: string) => {
      // Disparar precarga del paquete de provincia antes de que termine el viaje
      preloadProvincePackage(provinceId);
      return act((sessionId) => travelToProvince(sessionId, provinceId), (session) => session);
    },

    travelLocation: (locationId: string) => {
      const { session } = get();
      if (session?.currentProvinceId) {
        // Disparar precarga del diálogo y fondo de la locación
        preloadLocationPackage(session.caseId, session.currentProvinceId, locationId);
      }
      return act((sessionId) => travelToLocation(sessionId, locationId), (session) => session);
    },

    markIntroSeen: (locationId: string) =>
      act((sessionId) => markIntroSeenApi(sessionId, locationId), (session) => session),

    askQuestion: (questionCode: string) =>
      act((sessionId) => askQuestionApi(sessionId, questionCode), (result) => result.state),

    // El backend valida las pistas y, si el jugador ya está en el escondite, resuelve si ganó o perdió
    issueArrestWarrant: (suspectId: string) =>
      act((sessionId) => issueWarrant(sessionId, suspectId), (session) => session),

    play: async (level?: number) => {
      const newSession = await playLevel(level);
      const gameData = await getGameData(newSession.caseId);

      pendingInit = null;
      set({
        ...fromSession(newSession),
        costs: gameData.costs,
        videoUrl: gameData.videoUrl ?? null,
        suspects: gameData.suspects,
        briefing: gameData.info ?? null,
        initialClues: gameData.initialClues ?? [],
      });

      // Preload automático
      preloadCasePackage(newSession.caseId, gameData.suspects);
      if (newSession.currentProvinceId) {
        preloadProvincePackage(newSession.currentProvinceId);
      }

      return newSession;
    },

    // Después de perder se juega otra partida del mismo nivel: el caso se vuelve a sortear
    restartLevel: async () => {
      await get().play(get().session?.level);
    },

    // Solo limpia la copia local: la partida sigue guardada en el servidor para continuarla
    resetSession: () => {
      pendingInit = null;
      useInvestigationBoardStore.getState().resetBoard();
      set(emptySession);
    },

    setInvestigationMenuOpen: (open: boolean) => set({ isInvestigationMenuOpen: open }),
    closeInvestigationMenu: () => set({ isInvestigationMenuOpen: false }),
  };
});
