import type { EventSummary, EventDetail, SessionDetail, Room, Question, QuestionCreate } from "../types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // server always returns { message: "..." }
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Events ────────────────────────────────────────────
// GET /api/events  →  EventSummary[]
export const getEvents = () =>
  fetcher<EventSummary[]>("/api/events");

// GET /api/events/:id  →  EventDetail (includes sessions with isLive)
export const getEvent = (id: string) =>
  fetcher<EventDetail>(`/api/events/${id}`);

// ── Rooms ─────────────────────────────────────────────
// GET /api/rooms  →  Room[]
export const getRooms = () =>
  fetcher<Room[]>("/api/rooms");

// GET /api/rooms/:id/sessions  →  SessionSummary[]
export const getRoomSessions = (roomId: string) =>
  fetcher<SessionDetail[]>(`/api/rooms/${roomId}/sessions`);

// ── Sessions ──────────────────────────────────────────
// GET /api/sessions/:id  →  SessionDetail (includes isLive)
export const getSession = (id: string) =>
  fetcher<SessionDetail>(`/api/sessions/${id}`);

// ── Questions ─────────────────────────────────────────
// GET /api/sessions/:id/questions  →  Question[]
export const getQuestions = (sessionId: string) =>
  fetcher<Question[]>(`/api/sessions/${sessionId}/questions`);

// POST /api/sessions/:id/questions  →  Question  (body: QuestionCreate)
export const createQuestion = (sessionId: string, data: QuestionCreate) =>
  fetcher<Question>(`/api/sessions/${sessionId}/questions`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// POST /api/questions/:id/upvote  →  Question
export const upvoteQuestion = (questionId: string, userId: string) =>
  fetcher<Question>(`/api/questions/${questionId}/upvote`, { 
    method: "POST",
    body: JSON.stringify({ userId })
  });

// POST /api/questions/:id/unvote  →  Question
export const unvoteQuestion = (questionId: string, userId: string) =>
  fetcher<Question>(`/api/questions/${questionId}/unvote`, { 
    method: "POST",
    body: JSON.stringify({ userId })
  });
