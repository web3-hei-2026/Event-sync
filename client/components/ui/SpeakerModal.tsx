"use client";
import Link from 'next/link';
import { X, ExternalLink, Calendar, ArrowLeft } from "lucide-react";

interface Speaker {
  id: number;
  fullName: string;
  biography: string;
  photoUrl?: string;
  externalLinks?: Record<string, string> | null;
}

interface SpeakerModalProps {
  speaker: Speaker | null;
  isOpen: boolean;
  onClose: () => void;
  speakerSessions: any[];
}

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toISOString().replace('T', ' ').slice(0, 16);
};

export default function SpeakerModal({
  speaker,
  isOpen,
  onClose,
  speakerSessions,
}: SpeakerModalProps) {

  if (!isOpen || !speaker) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex", justifyContent: "center",
        alignItems: "center", zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111", padding: "2rem",
          borderRadius: "15px", width: "700px", color: "white",
        }}
      >
        <button onClick={onClose} style={{ float: "right", cursor: "pointer", background: 'none', border: 'none', color: '#fff' }}>
          <X size={24} />
        </button>

        <div style={{ display: "flex", gap: "2rem", marginBottom: '1rem' }}>
          <img
            src={`http://localhost:5000${speaker.photoUrl}`}
            alt={speaker.fullName}
            style={{
              width: 192, height: 192, borderRadius: "24px",
              objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)",
            }}
          />

          <div>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: '0.5rem' }}>
              {speaker.fullName}
            </h2>
            <p style={{ color: '#aaa', marginBottom: '1rem' }}>{speaker.biography}</p>

            {/* Fix externalLinks — c'est un objet JSON */}
            {speaker.externalLinks && typeof speaker.externalLinks === 'object' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {Object.entries(speaker.externalLinks).map(([key, url]) => (
                  url ? (
                    <Link
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#09FBFF', textDecoration: 'underline' }}
                    >
                      <ExternalLink size={14} />
                      {key}
                    </Link>
                  ) : null
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Calendar style={{ color: '#D403E1' }} /> Sessions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {speakerSessions.length === 0 ? (
              <p style={{ color: '#aaa' }}>Aucune session.</p>
            ) : (
              speakerSessions.map((session: any) => (
                <div
                  key={session.id}
                  style={{
                    padding: '1.5rem', borderRadius: '1rem',
                    border: '1px solid rgba(210,3,225,0.25)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p style={{ color: '#D403E1', fontFamily: 'var(--font-title)', fontSize: 14 }}>
                      {formatDateTime(session.startTime)}
                    </p>
                    <h4 style={{ fontFamily: 'var(--font-title)', fontSize: 20 }}>
                      {session.title}
                    </h4>
                  </div>
                  <Link href={`/events/${session.eventId}`}>
                    <ArrowLeft size={20} style={{ transform: 'rotate(180deg)', color: '#09FBFF' }} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}