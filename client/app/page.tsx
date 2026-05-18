'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents, getSpeakers } from '@/lib/api';
import EventCard from '@/components/ui/EventCard';
import SpeakerCard from '@/components/ui/SpeakerCard';

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getEvents().then(setEvents).catch(() => setEvents([]));
    getSpeakers().then(setSpeakers).catch(() => setSpeakers([]));
  }, []);

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(3,204,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(3,204,255,0.04) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Orbs */}
        <div style={{ position: 'absolute', width: 300, height: 300, background: '#D403E1', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.12, top: -80, left: -60 }} />
        <div style={{ position: 'absolute', width: 250, height: 250, background: '#03CCFF', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.12, bottom: -60, right: -40 }} />
        <div style={{ position: 'absolute', width: 180, height: 180, background: '#460071', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.15, top: '40%', left: '40%' }} />

        {/* Constellation */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <circle cx="100" cy="80" r="3" fill="#09FBFF"/>
          <circle cx="200" cy="40" r="2" fill="#D403E1"/>
          <circle cx="350" cy="100" r="3" fill="#03CCFF"/>
          <circle cx="500" cy="50" r="2" fill="#09FBFF"/>
          <circle cx="650" cy="90" r="3" fill="#D403E1"/>
          <circle cx="750" cy="30" r="2" fill="#03CCFF"/>
          <circle cx="150" cy="200" r="2" fill="#D403E1"/>
          <circle cx="400" cy="180" r="3" fill="#09FBFF"/>
          <circle cx="600" cy="220" r="2" fill="#03CCFF"/>
          <line x1="100" y1="80" x2="200" y2="40" stroke="#09FBFF" strokeWidth="0.5" opacity="0.5"/>
          <line x1="200" y1="40" x2="350" y2="100" stroke="#03CCFF" strokeWidth="0.5" opacity="0.5"/>
          <line x1="350" y1="100" x2="500" y2="50" stroke="#D403E1" strokeWidth="0.5" opacity="0.5"/>
          <line x1="500" y1="50" x2="650" y2="90" stroke="#09FBFF" strokeWidth="0.5" opacity="0.5"/>
          <line x1="650" y1="90" x2="750" y2="30" stroke="#03CCFF" strokeWidth="0.5" opacity="0.5"/>
          <line x1="150" y1="200" x2="400" y2="180" stroke="#D403E1" strokeWidth="0.5" opacity="0.5"/>
          <line x1="400" y1="180" x2="600" y2="220" stroke="#09FBFF" strokeWidth="0.5" opacity="0.5"/>
        </svg>

        {/* Content */}
        <span style={{ position: 'relative', zIndex: 1, display: 'inline-block', background: 'rgba(9,251,255,0.08)', border: '1px solid rgba(9,251,255,0.25)', color: '#09FBFF', fontSize: 11, padding: '4px 14px', borderRadius: 20, marginBottom: '1rem', letterSpacing: '0.05em' }}>
          ✦ Plateforme événementielle en temps réel
        </span>
        <h1 className="hero-title">
          Discover & Promote<br />
          <span style={{ background: 'linear-gradient(135deg,#D403E1,#03CCFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Upcoming Events
          </span>
        </h1>
        <p className="hero-desc">
          EventSync transforme vos conférences en expériences interactives. Planning dynamique, Q&A en direct.
        </p>

        {/* Search */}
        <div className="search-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a5a7a" strokeWidth="2" style={{ flexShrink: 0, marginRight: 8, alignSelf: 'center' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un événement..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, fontFamily: 'var(--font-body)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', color: '#5a5a7a', cursor: 'pointer', padding: '0 8px', fontSize: 16 }}>✕</button>
          )}
          <button style={{ background: 'linear-gradient(135deg,#D403E1,#460071)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 25, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            Rechercher
          </button>
        </div>
      </section>

      {/* Featured Events */}
      <section style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: 11, color: '#D403E1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Upcoming Events</div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700 }}>Featured Events</h2>
          </div>
          <Link href="/events" style={{ color: '#09FBFF', fontSize: 12, textDecoration: 'none', border: '1px solid rgba(9,251,255,0.25)', padding: '5px 14px', borderRadius: 20 }}>
            See more →
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6666aa' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6666aa" strokeWidth="1.5" style={{ marginBottom: 12 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p style={{ fontSize: 14 }}>Aucun événement trouvé{search ? ` pour "${search}"` : ''}</p>
          </div>
        ) : (
          <div className="events-grid">
            {filtered.slice(0, 6).map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Speakers */}
      <section style={{ padding: '2.5rem 2rem', background: 'rgba(70,0,113,0.08)', borderTop: '1px solid rgba(3,204,255,0.08)', borderBottom: '1px solid rgba(3,204,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: 11, color: '#D403E1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Today's Performers</div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700 }}>Intervenants</h2>
          </div>
          <Link href="/speakers" style={{ color: '#09FBFF', fontSize: 12, textDecoration: 'none', border: '1px solid rgba(9,251,255,0.25)', padding: '5px 14px', borderRadius: 20 }}>
            See more →
          </Link>
        </div>
        <div className="speakers-grid">
          {speakers.slice(0, 4).map((speaker, i) => (
            <SpeakerCard key={speaker.id} speaker={speaker} index={i} />
          ))}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .hero-section {
          padding: 4rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: #0a0a1a;
          min-height: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .hero-title {
          position: relative;
          z-index: 1;
          font-family: var(--font-title);
          font-size: 38px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .hero-desc {
          position: relative;
          z-index: 1;
          font-size: 14px;
          color: #8888aa;
          max-width: 440px;
          margin: 0 auto 1.5rem;
          line-height: 1.7;
        }

        .search-bar {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(9,251,255,0.2);
          border-radius: 30px;
          overflow: hidden;
          padding: 4px 4px 4px 16px;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .speakers-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        @media (max-width: 1024px) {
          .events-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .speakers-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 3rem 1.25rem;
            min-height: 280px;
          }
          .hero-title {
            font-size: 26px;
          }
          .hero-desc {
            font-size: 13px;
          }
          .search-bar {
            max-width: 100%;
          }
          .events-grid {
            grid-template-columns: 1fr;
          }
          .speakers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 22px;
          }
          .speakers-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </>
  );
}