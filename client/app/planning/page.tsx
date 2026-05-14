'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEvents, getEvent } from '@/lib/api';
import type { EventSummary, SessionSummary } from '../../src/types';

// ─── Types ────────────────────────────────────────────────────────────────────
type Event = EventSummary;
type Session = SessionSummary;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit' });

const fmtMonth = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();

const fmtFullDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

// Grouper sessions par date YYYY-MM-DD
function groupByDate(sessions: Session[]): Record<string, Session[]> {
  const groups: Record<string, Session[]> = {};
  for (const s of sessions) {
    const key = new Date(s.startTime).toISOString().split('T')[0];
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }
  for (const key in groups) {
    groups[key].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }
  return groups;
}

// ─── SessionRow ───────────────────────────────────────────────────────────────
function SessionRow({ session, isFirst }: { session: Session; isFirst: boolean }) {
  const speakers = session.speakers
    ?.map(s => s.fullName)
    .filter(Boolean)
    .join(', ');

  const status = session.isLive ? 'live' : new Date().getTime() < new Date(session.startTime).getTime() ? 'upcoming' : 'past';

  const statusClasses = {
    live: 'bg-red-500/15 text-red-300 border-red-500/20',
    upcoming: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    past: 'bg-slate-600/15 text-slate-400 border-slate-500/20',
  };

  return (
    <Link
      href={`/sessions/${session.id}`}
      className={`group grid grid-cols-[100px_1fr_auto] gap-0 px-4 py-4 transition-colors duration-200 rounded-2xl bg-white/5 border ${isFirst ? 'border-white/10' : 'border-t border-cyan-900/20'} hover:bg-white/10 hover:border-cyan-400/30`}
    >
      {/* Heure */}
      <div className="text-sm text-cyan-300 pt-0.5">
        {fmtTime(session.startTime)}
        <br />
        <span className="text-[11px] text-slate-500">– {fmtTime(session.endTime)}</span>
      </div>

      {/* Titre + speaker */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-sm text-white leading-snug">{session.title}</span>
          {session.isLive && (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-red-300">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        {speakers && (
          <p className="text-[11px] text-slate-500">👤 {speakers}</p>
        )}
      </div>

      {/* Salle */}
      <div className="pl-3 flex items-start pt-0.5">
        <span className={`text-xs font-semibold rounded-full border px-3 py-1 whitespace-nowrap ${statusClasses[status]}`}>
          {session.room?.name || 'Salle non définie'}
        </span>
      </div>
    </Link>
  );
}

// ─── DayBlock ─────────────────────────────────────────────────────────────────
function DayBlock({ dateKey, sessions }: { dateKey: string; sessions: Session[] }) {
  const hasLive = sessions.some(s => s.isLive);

  return (
    <div className={`grid grid-cols-[72px_1fr] rounded-2xl overflow-hidden mb-4 border transition-shadow duration-300 ${hasLive ? 'border-purple-500/40 shadow-[0_0_24px_rgba(212,3,225,0.12)]' : 'border-cyan-900/25'} bg-[#140a28]/70`}>

      {/* Date gauche */}
      <div className={`
        flex flex-col items-center justify-center py-5 px-2
        border-r
        ${hasLive
          ? 'bg-gradient-to-b from-purple-900/40 to-purple-950/50 border-purple-500/30'
          : 'bg-cyan-900/10 border-cyan-900/20'
        }
      `}>
        <span className={`
          font-bold text-[34px] leading-none
          ${hasLive ? 'text-purple-400' : 'text-cyan-400'}
        `}>
          {fmtDay(dateKey)}
        </span>
        <span className="text-[11px] text-slate-400 mt-1 tracking-widest uppercase">
          {fmtMonth(dateKey)}
        </span>
      </div>

      {/* Sessions droite */}
      <div>
        {/* Header */}
        <div className="grid grid-cols-[100px_1fr_auto] gap-0 px-4 py-2 bg-cyan-900/5 border-b border-cyan-900/15">
          <span className="text-[11px] text-slate-500">Heure</span>
          <span className="text-[11px] text-slate-500">Session</span>
          <span className="text-[11px] text-slate-500">Salle</span>
        </div>

        {/* Lignes */}
        {sessions.map((s, i) => (
          <SessionRow key={s.id} session={s} isFirst={i === 0} />
        ))}
      </div>
    </div>
  );
}

// ─── EventSelector ────────────────────────────────────────────────────────────
function EventSelector({
  events,
  selectedId,
  onSelect,
}: {
  events: Event[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {events.map(ev => (
        <button
          key={ev.id}
          onClick={() => onSelect(ev.id)}
          className={`
            px-5 py-2 rounded-full text-sm transition-all duration-200
            ${selectedId === ev.id
              ? 'bg-gradient-to-r from-purple-600 to-purple-900 text-white border border-purple-500'
              : 'bg-cyan-900/10 text-cyan-300 border border-cyan-800/30 hover:border-cyan-600/50'
            }
          `}
        >
          {ev.title}
        </button>
      ))}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
// → à placer dans : client/app/planning/page.tsx
export default function PlanningPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les événements au montage
  useEffect(() => {
    getEvents()
      .then(evs => {
        setEvents(evs);
        if (evs.length > 0) setSelectedId(evs[0].id);
      })
      .catch(() => setError('Impossible de charger les événements.'))
      .finally(() => setLoading(false));
  }, []);

  // Charger les sessions quand l'event change
  useEffect(() => {
    if (!selectedId) return;
    setLoadingSessions(true);
    getEvent(selectedId)
      .then((event) => setSessions(event.sessions))
      .catch(() => setError('Impossible de charger les sessions.'))
      .finally(() => setLoadingSessions(false));
  }, [selectedId]);

  const selectedEvent = events.find(e => e.id === selectedId);
  const grouped = groupByDate(sessions);
  const dateKeys = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white px-6 py-8">

      {/* En-tête style PIPZE */}
      <div className="mb-8">
        <h1 className="font-bold text-4xl text-white leading-tight">
          PLANNING
        </h1>
        <h2 className="text-2xl text-cyan-200 font-light mb-2">
          des Sessions
        </h2>
        {selectedEvent && (
          <p className="text-sm text-cyan-400 font-semibold tracking-wide uppercase">
            {fmtFullDate(selectedEvent.startDate)}
            {selectedEvent.location && ` · ${selectedEvent.location}`}
          </p>
        )}
      </div>

      {/* Loading global */}
      {loading && (
        <p className="text-center text-cyan-300 py-16">Chargement...</p>
      )}

      {/* Erreur */}
      {error && (
        <p className="text-center text-purple-400 py-16">{error}</p>
      )}

      {/* Sélecteur événement si plusieurs */}
      {!loading && events.length > 1 && (
        <EventSelector events={events} selectedId={selectedId} onSelect={setSelectedId} />
      )}

      {/* Loading sessions */}
      {loadingSessions && (
        <p className="text-center text-cyan-300 py-8">Chargement des sessions...</p>
      )}

      {/* Blocs par jour */}
      {!loading && !loadingSessions && !error && (
        dateKeys.length === 0 ? (
          <p className="text-center text-slate-500 py-16">
            Aucune session disponible.
          </p>
        ) : (
          dateKeys.map(dk => (
            <DayBlock key={dk} dateKey={dk} sessions={grouped[dk]} />
          ))
        )
      )}
    </div>
  );
}