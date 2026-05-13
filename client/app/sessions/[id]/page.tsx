import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "../../../lib/api";
import QuestionList from "../../../src/components/QuestionList";
import { ArrowLeft, Clock, MapPin, Users, Mic, MessageSquare } from "lucide-react";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const session = await getSession(id);
    return { title: session.title };
  } catch {
    return { title: "Session" };
  }
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default async function SessionPage({ params }: Props) {
  const { id } = await params;

  let session;
  try {
    session = await getSession(id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Session introuvable.";
    return (
      <div style={{ padding: '5rem 2rem', textAlign: 'center', background: '#0a0a1a', color: '#8888aa', minHeight: '100vh' }}>
        <p style={{ marginBottom: '1.5rem' }}>{msg}</p>
        <Link href="/" style={{ color: '#03CCFF', textDecoration: 'none', border: '1px solid rgba(3,204,255,0.3)', padding: '8px 20px', borderRadius: 20 }}>
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', padding: '2rem' }}>
      {/* Back Link */}
      <Link
        href={`/events/${session.eventId}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#8888aa', textDecoration: 'none', fontSize: 13,
          marginBottom: '2rem', transition: 'color 0.2s'
        }}
      >
        <ArrowLeft size={16} />
        Retour à l'événement
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 1000, margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ 
          position: 'relative', padding: '2.5rem', borderRadius: 20, 
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(3,204,255,0.1)',
          overflow: 'hidden'
        }}>
          {/* Orbs */}
          <div style={{ position: 'absolute', width: 200, height: 200, background: '#D403E1', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, top: -50, right: -50 }} />
          <div style={{ position: 'absolute', width: 150, height: 150, background: '#03CCFF', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.1, bottom: -40, left: -40 }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 32, fontWeight: 700, margin: 0 }}>
                {session.title}
              </h1>
              {session.isLive ? (
                <span style={{ 
                  display: 'flex', alignItems: 'center', gap: 6, 
                  fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 12,
                  background: 'rgba(255,50,50,0.15)', color: '#ff6060', border: '1px solid rgba(255,50,50,0.3)',
                  textTransform: 'uppercase', letterSpacing: '0.02em'
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                  En direct
                </span>
              ) : (
                <span style={{ 
                  fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 12,
                  background: 'rgba(100,100,100,0.15)', color: '#888', border: '1px solid rgba(100,100,100,0.3)',
                  textTransform: 'uppercase'
                }}>
                  {Date.now() < new Date(session.startTime).getTime() ? "À venir" : "Terminée"}
                </span>
              )}
            </div>

            {session.description && (
              <p style={{ fontSize: 15, color: '#8888aa', maxWidth: 700, lineHeight: 1.6, marginBottom: '2rem' }}>
                {session.description}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: 13, color: '#8888aa' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} color="#03CCFF" />
                {fmtTime(session.startTime)} – {fmtTime(session.endTime)}
              </span>
              {session.room && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} color="#03CCFF" />
                  {session.room.name}
                </span>
              )}
              {session.capacity && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={16} color="#03CCFF" />
                  {session.capacity} places
                </span>
              )}
              {session.speakers && session.speakers.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mic size={16} color="#D403E1" />
                  {session.speakers.map((s: any) => s.fullName).join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Q&A Section */}
        <div style={{ 
          background: 'rgba(255,255,255,0.01)', borderRadius: 20, 
          padding: '2rem', border: '1px solid rgba(255,255,255,0.03)' 
        }}>
          <h2 style={{ 
            fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700, 
            marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 12 
          }}>
            <MessageSquare size={20} color="#03CCFF" />
            Questions & Réponses
          </h2>
          <QuestionList sessionId={session.id} isLive={session.isLive} />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
