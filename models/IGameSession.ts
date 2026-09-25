import { ICost } from "./IGameData";

export type GameSessionStatus = "InProgress" | "Won" | "Lost" | "Abandoned";

export interface IVisitedLocation {
  locationId: string; // guid
  introSeen: boolean;
}

// Estado de la partida tal como lo devuelve /api/GameSessions
export interface IGameSession {
  sessionId: string; // guid
  caseId: number;
  level: number; // nivel (etapa) en el que se juega
  status: GameSessionStatus;
  currentTime: number;
  currentPI: number;
  initialTime: number;
  initialPI: number;
  currentProvinceId: string | null;
  currentLocationId: string | null;
  briefingSeen: boolean;
  isGameOver: boolean; // solo cuando se perdió
  gameOverReason: "time" | "pi" | "arrest" | null;
  score: number | null;
  discoveredClues: string[]; // sin las iniciales (vienen en game-data)
  askedQuestions: string[]; // códigos
  flags: string[]; // códigos
  visitedLocations: IVisitedLocation[];
}

export interface IAskQuestionResult {
  answer: string;
  costCharged: boolean; // solo la primera vez que se hace la pregunta
  cost: ICost | null;
  newClue: string | null;
  newFlags: string[];
  state: IGameSession;
}

// Valores del panel de jugador (/principal), calculados a partir del progreso guardado
export interface IPlayerStats {
  level: number; // caso habilitado más alto
  points: number; // suma de puntajes de las partidas
  gamesPlayed: number; // partidas empezadas
  highScore: number; // mejor puntaje
}

// Una fila del ranking: mayor puntaje primero y, con empate, el que jugó menos partidas
export interface ILeaderboardEntry {
  position: number;
  username: string;
  points: number;
  gamesPlayed: number;
}

// Una tarjeta de nivel de la pantalla principal
export interface ILevelOverview {
  level: number;
  status: "completed" | "current" | "locked";
  // Caso ganado (completed) o en curso (current); null si todavía no se sorteó o está bloqueado
  caseId: number | null;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
}

// Una línea del chat guardado de una locación
export interface IDialogLogEntry {
  id: string; // código de la pregunta
  question: string;
  answer: string;
}
