import { create } from "zustand";
import { getGameData, prefetchCaseLocations } from "@/services/levelService";
import {
  askQuestion as askQuestionApi,
  GameSessionApiError,
  getDialogLog,
  getSession,
  issueWarrant,
  markBriefingSeen as markBriefingSeenApi,
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
import { defineMessages, translate } from "@/lib/i18n/messages";
import { readLocaleCookie } from "@/lib/i18n/localeStorage";

const messages = defineMessages({
  es: { noGame: "No hay una partida iniciada" },
  en: { noGame: "No game in progress" },
});

// El progreso lo guarda el backend (/api/GameSessions): este store es solo la copia del último estado recibido
// Una línea del chat de una locación (pregunta del jugador y respuesta del testigo)
export interface IDialogLogLine {
  question: string;
  answer: string;
}

// Clave del chat guardado de una locación en una partida
export const dialogLogKey = (sessionId: string, locationId: string) => `${sessionId}:${locationId}`;

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
  // Chat de cada locación (clave dialogLogKey): lo guardado en el servidor más lo preguntado en esta visita
  dialogLogs: Record<string, IDialogLogLine[]>;

  // Métodos
  initSession: (levelId: number) => Promise<IGameSession>;
  // Retoma o sortea el caso del nivel habilitado; con nivel, rejuega uno completado.
  // caseIdHint: caso en curso que ya conoce la tarjeta, para pedir sus datos en paralelo con play
  play: (level?: number, caseIdHint?: number | null) => Promise<IGameSession>;
  travelProvince: (provinceId: string) => Promise<IGameSession>;
  travelLocation: (locationId: string) => Promise<IGameSession>;
  markIntroSeen: (locationId: string) => Promise<IGameSession>;
  markBriefingSeen: () => Promise<IGameSession | null>;
  // log: si se pasa, la respuesta se agrega al chat guardado de esa locación
  askQuestion: (questionCode: string, log?: { locationId: string; question: string }) => Promise<IAskQuestionResult>;
  // Pide (una sola vez por partida, locación e idioma) el chat guardado de una locación
  loadDialogLog: (locationId: string) => Promise<void>;
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
  dialogLogs: {},
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

// Chats ya traídos del servidor (o en camino) por clave dialogLogKey, y en qué idioma
const loadedDialogLogs = new Set<string>();
const inFlightDialogLogs = new Map<string, Promise<void>>();
let dialogLogLocale = readLocaleCookie();

// Idioma en que llegaron informe, pistas iniciales y sospechosos: si el jugador lo cambia, se vuelven a pedir
let contentLocale = readLocaleCookie();

export const useGameSessionStore = create<GameSessionState>()((set, get) => {
  const applySession = (session: IGameSession) => set(fromSession(session));

  // Las marcas del tablero son de una partida: si llega otra (reinicio, caso nuevo) se borran
  const resetBoardIfNewSession = (next: IGameSession) => {
    if (get().session?.sessionId !== next.sessionId) useInvestigationBoardStore.getState().resetBoard();
  };

  // Ejecuta una acción sobre la partida y guarda el estado que devuelve el servidor
  const act = async <T>(call: (sessionId: string) => Promise<T>, stateOf: (result: T) => IGameSession): Promise<T> => {
    const { session } = get();
    if (!session) throw new Error(translate(messages, "noGame"));

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
      if (session && costs && session.caseId === levelId && contentLocale === readLocaleCookie()) {
        return Promise.resolve(session);
      }

      if (pendingInit?.levelId === levelId) {
        return pendingInit.promise;
      }

      // La partida va primero: si falla (401, 403) ese es el error que se reporta
      contentLocale = readLocaleCookie();
      const promise = Promise.all([startOrResumeSession(levelId), getGameData(levelId)])
        .then(([newSession, gameData]) => {
          resetBoardIfNewSession(newSession);
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
            preloadProvincePackage(newSession.caseId, newSession.currentProvinceId);
            if (newSession.currentLocationId) {
              const locationId = newSession.currentLocationId;
              preloadLocationPackage(newSession.caseId, newSession.currentProvinceId, locationId, {
                introSeen: newSession.visitedLocations.some((l) => l.locationId === locationId && l.introSeen),
              });
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
      const caseId = get().session?.caseId;
      if (caseId != null) preloadProvincePackage(caseId, provinceId);
      return act((sessionId) => travelToProvince(sessionId, provinceId), (session) => session).then((session) => {
        // Con la provincia confirmada por el servidor, los datos de su pantalla quedan pedidos (o ya en caché)
        if (session.currentProvinceId) prefetchCaseLocations(session.caseId, session.currentProvinceId);
        return session;
      });
    },

    travelLocation: (locationId: string) => {
      const { session } = get();
      if (session?.currentProvinceId) {
        // Disparar precarga del diálogo y fondo de la locación
        preloadLocationPackage(session.caseId, session.currentProvinceId, locationId, {
          introSeen: session.visitedLocations.some((l) => l.locationId === locationId && l.introSeen),
        });
      }
      return act((sessionId) => travelToLocation(sessionId, locationId), (session) => session);
    },

    markIntroSeen: (locationId: string) =>
      act((sessionId) => markIntroSeenApi(sessionId, locationId), (session) => session),

    markBriefingSeen: () => {
      const session = get().session;
      if (!session || session.briefingSeen) return Promise.resolve(session);
      return act((sessionId) => markBriefingSeenApi(sessionId), (session) => session);
    },

    askQuestion: async (questionCode: string, log?: { locationId: string; question: string }) => {
      const sessionId = get().session?.sessionId;
      const result = await act((id) => askQuestionApi(id, questionCode), (result) => result.state);
      if (log && sessionId) {
        const key = dialogLogKey(sessionId, log.locationId);
        const line = { question: log.question, answer: result.answer };
        set((state) => ({ dialogLogs: { ...state.dialogLogs, [key]: [...(state.dialogLogs[key] ?? []), line] } }));
      }
      return result;
    },

    loadDialogLog: (locationId: string) => {
      const sessionId = get().session?.sessionId;
      if (!sessionId) return Promise.resolve();

      // Las preguntas y respuestas llegan en el idioma del jugador: si lo cambia se vuelven a pedir
      const locale = readLocaleCookie();
      if (locale !== dialogLogLocale) {
        dialogLogLocale = locale;
        loadedDialogLogs.clear();
        inFlightDialogLogs.clear();
        set({ dialogLogs: {} });
      }

      const key = dialogLogKey(sessionId, locationId);
      if (loadedDialogLogs.has(key)) return Promise.resolve();
      const inFlight = inFlightDialogLogs.get(key);
      if (inFlight) return inFlight;

      const promise = getDialogLog(sessionId, locationId)
        .then((entries) => {
          if (inFlightDialogLogs.get(key) !== promise) return; // se reinició la sesión o cambió el idioma
          loadedDialogLogs.add(key);
          const saved = entries.map((entry) => ({ question: entry.question, answer: entry.answer }));
          // Lo preguntado mientras llegaba la respuesta va después de lo guardado (sin repetir lo que ya trae el servidor)
          set((state) => {
            const pending = (state.dialogLogs[key] ?? []).filter((line) => !saved.some((s) => s.question === line.question));
            return { dialogLogs: { ...state.dialogLogs, [key]: [...saved, ...pending] } };
          });
        })
        .catch((err) => console.error("No se pudo cargar la conversación guardada:", err))
        .finally(() => {
          if (inFlightDialogLogs.get(key) === promise) inFlightDialogLogs.delete(key);
        });

      inFlightDialogLogs.set(key, promise);
      return promise;
    },

    // El backend valida las pistas y, si el jugador ya está en el escondite, resuelve si ganó o perdió
    issueArrestWarrant: (suspectId: string) =>
      act((sessionId) => issueWarrant(sessionId, suspectId), (session) => session),

    play: async (level?: number, caseIdHint?: number | null) => {
      contentLocale = readLocaleCookie();
      // game-data depende del caso que devuelve play; si la tarjeta ya lo conoce (partida en curso)
      // se pide a la vez y el getGameData de abajo reusa la misma request (caché de levelService)
      if (caseIdHint != null) getGameData(caseIdHint).catch(() => {});
      const newSession = await playLevel(level);
      const gameData = await getGameData(newSession.caseId);

      pendingInit = null;
      resetBoardIfNewSession(newSession);
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
        preloadProvincePackage(newSession.caseId, newSession.currentProvinceId);
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
      loadedDialogLogs.clear();
      inFlightDialogLogs.clear();
      useInvestigationBoardStore.getState().resetBoard();
      set(emptySession);
    },

    setInvestigationMenuOpen: (open: boolean) => set({ isInvestigationMenuOpen: open }),
    closeInvestigationMenu: () => set({ isInvestigationMenuOpen: false }),
  };
});
