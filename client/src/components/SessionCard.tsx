import Link from "next/link";
import type { SessionSummary } from "../types";
import { Clock, MapPin, Mic } from "lucide-react";
import SessionFavoriteButton from "./SessionFavoriteButton";

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function getStatus(session: SessionSummary, now: number): "live" | "upcoming" | "past" {
  if (session.isLive) return "live";
  const start = new Date(session.startTime).getTime();
  const end = new Date(session.endTime).getTime();
  if (now < start) return "upcoming";
  if (now > end) return "past";
  return "live";
}

function StatusBadge({ status }: { status: "live" | "upcoming" | "past" }) {
  const styles = {
    live:     { bg: 'rgba(255,50,50,0.15)',   color: '#ff6060', border: 'rgba(255,50,50,0.3)',   label: 'En direct' },
    upcoming: { bg: 'rgba(3,204,255,0.15)',   color: '#03CCFF', border: 'rgba(3,204,255,0.3)',   label: 'À venir'   },
    past:     { bg: 'rgba(100,100,100,0.15)', color: '#888',    border: 'rgba(100,100,100,0.3)', label: 'Terminée'  },
  };
  const s = styles[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 12,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: 'uppercase', letterSpacing: '0.02em'
    }}>
      {status === 'live' && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: '#ff4444',
          display: 'inline-block', animation: 'pulse 1.5s infinite'
        }} />
      )}
      {s.label}
    </span>
  );
}

export default function SessionCard({ session, now }: { session: SessionSummary; now: number }) {
  const status = getStatus(session, now);
  const sessionId = session.id;
  const cardClass = status === 'live' ? 'session-card session-card--live' : 'session-card';

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Link href={`/sessions/${sessionId}`} className={cardClass} style={{ paddingBottom: '4rem', height: '100%' }}>
        {status === 'live' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #ff4444, transparent)',
            opacity: 0.5
          }} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.4, flex: 1 }}>
            {session.title}
          </h3>
          <StatusBadge status={status} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#8888aa', fontSize: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={14} color="#03CCFF" />
              {fmtTime(session.startTime)} – {fmtTime(session.endTime)}
            </span>
            {session.room && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} color="#03CCFF" />
                {session.room.name}
              </span>
            )}
          </div>
          {session.speakers && session.speakers.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: '2px' }}>
              <Mic size={14} color="#D403E1" />
              <span style={{ lineHeight: 1.3 }}>
                {session.speakers.map((s: any) => s.speaker?.fullName || s.fullName).filter(Boolean).join(", ")}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 10 }}>
        <SessionFavoriteButton sessionId={sessionId} />
      </div>
    </div>
  );
}