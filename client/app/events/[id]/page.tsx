import type { Metadata } from "next";
import Link from "next/link";
import { getEvent } from "../../../lib/api";
import SessionCard from "../../../src/components/SessionCard";
import { Calendar, MapPin, ChevronLeft } from "lucide-react";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const event = await getEvent(id);
    return { title: event.title };
  } catch {
    return { title: "Événement" };
  }
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function fmtDayHeader(isoString: string) {
  return new Date(isoString).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long"
  });
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const now = Date.now();

  let event;
  try {
    event = await getEvent(id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Événement introuvable.";
    return (
      <div style={{ padding: '5rem 2rem', textAlign: 'center', background: '#0a0a1a', color: '#8888aa', minHeight: '100vh' }}>
        <p style={{ marginBottom: '1.5rem' }}>{msg}</p>
        <Link href="/" style={{ color: '#03CCFF', textDecoration: 'none', border: '1px solid rgba(3,204,255,0.3)', padding: '8px 20px', borderRadius: 20 }}>
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  // Regroupement des sessions par date
  const groupedSessions: Record<string, any[]> = {};

  (event.sessions ?? []).forEach((session: any) => {
    const dateKey = new Date(session.startTime).toISOString().split('T')[0];
    if (!groupedSessions[dateKey]) {
      groupedSessions[dateKey] = [];
    }
    groupedSessions[dateKey].push(session);
  });

  // Tri chronologique des journées
  const sortedDays = Object.keys(groupedSessions).sort((a, b) => a.localeCompare(b));

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', padding: '2rem' }}>
      <Link
        href="/events"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#8888aa', textDecoration: 'none', fontSize: 13,
          marginBottom: '2rem', transition: 'color 0.2s'
        }}
      >
        <ChevronLeft size={16} />
        Tous les événements
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Hero Section */}
        <div style={{ 
          position: 'relative', padding: '3rem', borderRadius: 32, 
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', width: 150, height: 150, background: '#D403E1', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.08, top: -40, left: -40 }} />
          <div style={{ position: 'absolute', width: 150, height: 150, background: '#03CCFF', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.08, bottom: -40, right: -40 }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 32, fontWeight: 700, marginBottom: '1rem' }}>
              {event.title}
            </h1>
            
            {event.description && (
              <p style={{ fontSize: 15, color: '#8888aa', maxWidth: 600, lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {event.description}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: 13, color: '#03CCFF', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 <Calendar size={16} style={{ color: '#D403E1' }} />
                 {fmt(event.startDate)} → {fmt(event.endDate)}
              </span>
              
              {event.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} style={{ color: '#03CCFF' }} />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Liste des sessions par jour */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700 }}>
              Sessions 
            </h2>
            <span style={{ fontSize: 12, fontWeight: 'bold', background: 'rgba(212,3,225,0.1)', color: '#D403E1', padding: '2px 10px', borderRadius: 10 }}>
              {event.sessions?.length || 0}
            </span>
          </div>
          
          {event.sessions?.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: 24, border: '1px dashed rgba(255,255,255,0.1)' }}>
              <p style={{ color: '#6666aa', fontSize: 14 }}>Aucune session planifiée pour cet événement.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {sortedDays.map((dayKey) => {
                const sessionsOfDay = groupedSessions[dayKey];
                
                return (
                  <div key={dayKey} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* En-tête du groupe de jour */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      borderBottom: '1px solid rgba(255,255,255,0.05)', 
                      paddingBottom: '8px'
                    }}>
                      <span style={{ 
                        textTransform: 'capitalize', 
                        fontSize: '15px', 
                        fontWeight: '700', 
                        color: '#D403E1',
                        letterSpacing: '0.05em'
                      }}>
                        {fmtDayHeader(sessionsOfDay[0].startTime)}
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        color: '#8888aa', 
                        background: 'rgba(255,255,255,0.05)', 
                        padding: '2px 8px', 
                        borderRadius: '8px' 
                      }}>
                        {sessionsOfDay.length} {sessionsOfDay.length > 1 ? 'sessions' : 'session'}
                      </span>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gap: '1.5rem', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' 
                    }}>
                      {sessionsOfDay.map((session: any) => (
                        <SessionCard key={session.id} session={session} now={now} />
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}