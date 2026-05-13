const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getEvents() {
  const res = await fetch(`${API_URL}/events`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function getEvent(id: string) {
  const res = await fetch(`${API_URL}/events/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch event');
  return res.json();
}

export async function getEventSessions(id: string) {
  const res = await fetch(`${API_URL}/events/${id}/sessions`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function getEventSchedule(id: string) {
  const res = await fetch(`${API_URL}/events/${id}/schedule`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch schedule');
  return res.json();
}

export async function getRooms() {
  const res = await fetch(`${API_URL}/rooms`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
}

export async function getRoomSessions(id: string) {
  const res = await fetch(`${API_URL}/rooms/${id}/sessions`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch room sessions');
  return res.json();
}

export async function getSpeakers() {
  const res = await fetch(`${API_URL}/speakers`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch speakers');
  return res.json();
}

export async function getSpeaker(id: string) {
  const res = await fetch(`${API_URL}/speakers/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch speaker');
  return res.json();
}

export async function getSession(id: string) {
  const res = await fetch(`${API_URL}/sessions/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
}

export async function getSessionQuestions(id: string) {
  const res = await fetch(`${API_URL}/sessions/${id}/questions`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

export async function submitQuestion(sessionId: string, data: { content: string; authorName?: string }) {
  const res = await fetch(`${API_URL}/sessions/${sessionId}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit question');
  return res.json();
}

export async function upvoteQuestion(questionId: string, userId: string) {
  const res = await fetch(`${API_URL}/questions/${questionId}/upvote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error('Failed to upvote');
  return res.json();
}