"use client";
import Link from "next/link";
import type { SessionSummary } from "../types";
import { Clock, MapPin, Mic, Star } from "lucide-react";
import { useState } from "react";

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
    live: { bg: 'rgba(255,50,50,0.15)', color: '#ff6060', border: 'rgba(255,50,50,0.3)', label: 'En direct' },
    upcoming: { bg: 'rgba(3,204,255,0.15)', color: '#03CCFF', border: 'rgba(3,204,255,0.3)', label: 'À venir' },
    past: { bg: 'rgba(100,100,100,0.15)', color: '#888', border: 'rgba(100,100,100,0.3)', label: 'Terminée' },
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
  
  // LOGIQUE RÉTABLIE : On initialise selon si la session est déjà en favori
  // Idéalement, cette info devrait venir de session.isFavorite ou de ton context
  const [isFav, setIsFav] = useState(session.isFavorite || false); 

  return (
    <Link
      href={`/sessions/${session.id}`}
      style={{
        display: 'flex', flexDirection: 'column', gap: '1rem',
        padding: '1.25rem', borderRadius: 15, textDecoration: 'none',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${status === 'live' ? 'rgba(255,70,70,0.3)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.3s ease',
        position: 'relative', overflow: 'hidden'
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <h3 style={{
          fontSize: 15, fontWeight: 600, color: '#fff', margin: 0,
          lineHeight: 1.4, flex: 1
        }}>
          {session.title}
        </h3>
        <StatusBadge status={status} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#8888aa', fontSize: 12 }}>
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
        {session.speakers && session.speakers.length > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mic size={14} color="#D403E1" />
            {session.speakers.map((s) => s.fullName).join(", ")}
          </span>
        )}
      </div>

      {/* BOUTON FAVORIS - COULEUR DYNAMIQUE SELON L'ÉTAT RÉEL */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '1rem', 
          right: '1rem', 
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        onClick={(e) => {
            e.preventDefault(); // Empêche le lien de s'ouvrir
            e.stopPropagation(); // Empêche l'événement de monter
            setIsFav(!isFav);
        }}
      >
        <Star 
            size={14} 
            fill={isFav ? "#FACC15" : "none"} // Jaune si fav, vide sinon
            color={isFav ? "#FACC15" : "#8888aa"} // Contour jaune si fav, gris sinon
        />
        <span style={{ 
            fontSize: '10px', 
            fontWeight: 'bold', 
            color: isFav ? '#FACC15' : '#8888aa', // Texte jaune si fav, gris sinon
            fontStyle: 'italic',
            letterSpacing: '0.05em'
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