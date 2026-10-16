import { API_URL, authHeaders, handleUnauthorized } from "@/lib/api";
import { IAskQuestionResult, IDialogLogEntry, IGameSession, ILeaderboardEntry, ILevelOverview, IPlayerStats } from "@/models/IGameSession";

// Error de la API con el código HTTP, para decidir qué hacer:
// 401 volver al login, 403 caso bloqueado, 404 sin partida, 409 la partida ya terminó, 400 jugada no válida
export class GameSessionApiError extends Error {
  status: number;
  body: Record<string, unknown> | null; // cuerpo JSON de la respuesta (p. ej. el 409 de play trae la partida en curso)

  constructor(status: number, message: string, body: Record<string, unknown> | null = null) {
    super(message);
    this.name = "GameSessionApiError";
    this.status = status;
    this.body = body;
  }
}

// 409 de play: hay una partida en curso de otro nivel que hay que abandonar para rejugar
export interface IPlayConflict {
  sessionId: string;
  level: number;
  message: string;
}

export function playConflictOf(err: unknown): IPlayConflict | null {
  if (!(err instanceof GameSessionApiError) || err.status !== 409 || !err.body) return null;
  const { sessionId, level } = err.body;
  if (typeof sessionId !== "string" || typeof level !== "number") return null;
  return { sessionId, level, message: err.message };
}

async function request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  let headers: HeadersInit;
  try {
    headers = authHeaders();
  } catch {
    throw new GameSessionApiError(401, "No hay una sesión iniciada");
  }

  const response = await fetch(`${API_URL}/api/GameSessions${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  handleUnauthorized(response);
  if (!response.ok) {
    let message = response.statusText;
    let body: Record<string, unknown> | null = null;
    try {
      body = await response.json();
      message = (body?.message as string | undefined) ?? message;
    } catch {
      // respuesta sin cuerpo JSON
    }
    throw new GameSessionApiError(response.status, message, body);
  }

  return response.json();
}

// Nivel, puntos, partidas y mejor puntuación del jugador logueado
export function getPlayerStats(): Promise<IPlayerStats> {
  return request("GET", "/stats");
}

// Ranking de jugadores (TOP 10 por defecto)
export function getLeaderboard(top = 10): Promise<ILeaderboardEntry[]> {
  return request("GET", `/leaderboard?top=${top}`);
}

// Niveles de la pantalla principal: completados, habilitado y bloqueados
export function getLevels(): Promise<ILevelOverview[]> {
  return request("GET", "/levels");
}

// Sin nivel: retoma la partida en curso o sortea el caso del nivel habilitado.
// Con un nivel completado: lo rejuega con un caso ya ganado (409 si hay una partida en curso de otro nivel)
export function playLevel(level?: number): Promise<IGameSession> {
  return request("POST", level === undefined ? "/play" : `/play?level=${level}`);
}

// Partida en curso del caso, sin crear una (404 si no hay)
export function getCurrentSession(caseId: number): Promise<IGameSession> {
  return request("GET", `/current/${caseId}`);
}

// Solo retoma la partida en curso de ese caso (las nuevas se crean con playLevel)
export function startOrResumeSession(caseId: number): Promise<IGameSession> {
  return request("POST", `/start-or-resume?caseId=${caseId}`);
}

export function getSession(sessionId: string): Promise<IGameSession> {
  return request("GET", `/${sessionId}`);
}

export function restartSession(sessionId: string): Promise<IGameSession> {
  return request("POST", `/${sessionId}/restart`);
}

export function abandonSession(sessionId: string): Promise<IGameSession> {
  return request("POST", `/${sessionId}/abandon`);
}

export function markBriefingSeen(sessionId: string): Promise<IGameSession> {
  return request("POST", `/${sessionId}/briefing-seen`);
}

export function travelToProvince(sessionId: string, provinceId: string): Promise<IGameSession> {
  return request("POST", `/${sessionId}/travel-province`, { provinceId });
}

export function travelToLocation(sessionId: string, locationId: string): Promise<IGameSession> {
  return request("POST", `/${sessionId}/travel-location`, { locationId });
}

export function markIntroSeen(sessionId: string, locationId: string): Promise<IGameSession> {
  return request("POST", `/${sessionId}/intro-seen`, { locationId });
}

export function askQuestion(sessionId: string, questionCode: string): Promise<IAskQuestionResult> {
  return request("POST", `/${sessionId}/ask`, { questionCode });
}

// Orden de arresto (definitiva): si ya está en el escondite se resuelve en el acto
export function issueWarrant(sessionId: string, suspectId: string): Promise<IGameSession> {
  return request("POST", `/${sessionId}/warrant`, { suspectId });
}

export function getDialogLog(sessionId: string, locationId: string): Promise<IDialogLogEntry[]> {
  return request("GET", `/${sessionId}/dialog-log/${locationId}`);
}

// Ruta de la pantalla donde quedó el jugador
export function sessionRoute(session: IGameSession): string {
  const { caseId, currentProvinceId, currentLocationId } = session;
  if (currentProvinceId && currentLocationId) return `/level/${caseId}/${currentProvinceId}/${currentLocationId}`;
  if (currentProvinceId) return `/level/${caseId}/${currentProvinceId}`;
  return `/level/${caseId}`;
}
