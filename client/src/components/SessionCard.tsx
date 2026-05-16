"use client";
import Link from "next/link";
import type { SessionSummary } from "../types";
import { Clock, MapPin, Mic, Star } from "lucide-react";
import { useState, useEffect } from "react";

// ✅ Clé unifiée — même partout dans le projet
const FAV_KEY = 'event-sync-favs';

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
  const [isFav, setIsFav] = useState<boolean>(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    setIsFav(favs.includes(session.id));
  }, [session.id]);

  useEffect(() => {
    const handleSync = () => {
      const favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
      setIsFav(favs.includes(session.id));
    };
    window.addEventListener('favorites-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('favorites-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [session.id]);

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    const newFavs = isFav
      ? favs.filter((id: string) => id !== session.id)
      : [...favs, session.id];
    localStorage.setItem(FAV_KEY, JSON.stringify(newFavs));
    setIsFav(!isFav);
    window.dispatchEvent(new Event('favorites-updated'));
  };

  return (
    <Link
      href={`/sessions/${session.id}`}
      style={{
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
        padding: '1.25rem 1.25rem 3.5rem 1.25rem',
        borderRadius: 15, textDecoration: 'none',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${status === 'live' ? 'rgba(255,70,70,0.3)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.3s ease',
        position: 'relative', overflow: 'hidden',
        minHeight: '150px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = status === 'live' ? 'rgba(255,70,70,0.5)' : 'rgba(3,204,255,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = status === 'live' ? 'rgba(255,70,70,0.3)' : 'rgba(255,255,255,0.06)';
      }}
    >
      {status === 'live' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, #ff4444, transparent)',
          opacity: 0.5
        }} />
      )}

      {/* Titre + Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.4, flex: 1 }}>
          {session.title}
        </h3>
        <StatusBadge status={status} />
      </div>

      {/* Méta */}
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
              {/* ✅ CORRECTION ICI : On descend chercher le fullName dans l'objet imbriqué speaker */}
              {session.speakers.map((s: any) => s.speaker?.fullName || s.fullName).filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Bouton favoris */}
      <div
        style={{
          position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '20px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
        }}
        onClick={handleToggleFav}
      >
        <Star size={14} fill={isFav ? "#FACC15" : "none"} color={isFav ? "#FACC15" : "#8888aa"} />
        <span style={{
          fontSize: '10px', fontWeight: 'bold',
          color: isFav ? '#FACC15' : '#8888aa',
          fontStyle: 'italic', letterSpacing: '0.05em'
        }}>
          FAVORIS
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
      `}</style>
    </Link>
  );
}