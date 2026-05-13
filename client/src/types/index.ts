// Shapes returned by GET /api/events
export interface EventSummary {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  location?: string | null;
}

// Shape returned by GET /api/events/:id
export interface EventDetail extends EventSummary {
  sessions: SessionSummary[];
}

// Shape used in EventDetail.sessions and GET /api/rooms/:id/sessions
export interface SessionSummary {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isLive: boolean;            // computed server-side
  room: Room;
  speakers: SpeakerSummary[];
}

// Shape returned by GET /api/sessions/:id
export interface SessionDetail extends SessionSummary {
  description?: string | null;
  capacity?: number | null;
  eventId: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface SpeakerSummary {
  id: string;
  fullName: string;
  photoUrl?: string | null;
}

// Shape returned by GET /api/sessions/:id/questions
export interface Question {
  id: string;
  content: string;
  authorName?: string | null;
  upvotes: number;
  sessionId: string;
  createdAt: string;
}

// Body for POST /api/sessions/:id/questions
export interface QuestionCreate {
  content: string;
  authorName?: string;
}

// All server error responses use { message: string }
export interface ApiError {
  message: string;
}
