'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents } from '@/lib/api';
import EventCard from '@/components/ui/EventCard';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', position: 'relative' }}>
      
      {/* RETOUR VERS LA PAGE ACCUEIL */}
      <Link href="/" style={{ 
        position: 'absolute',
        top: '24px', 
        left: '24px',
        zIndex: 10,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '40px', 
        height: '40px', 
        borderRadius: '50%',
        border: '1px solid rgba(3,204,255,0.3)',
        background: 'rgba(3,204,255,0.05)',
        color: '#03CCFF', 
        textDecoration: 'none',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(3,204,255,0.15)';
        e.currentTarget.style.borderColor = '#03CCFF';
        e.currentTarget.style.boxShadow = '0 0 15px rgba(3,204,255,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(3,204,255,0.05)';
        e.currentTarget.style.borderColor = 'rgba(3,204,255,0.3)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </Link>

      {/* Header Section */}
      <section style={{
        padding: '3rem 2rem 2rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid rgba(3,204,255,0.1)',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(3,204,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(3,204,255,0.04) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
          zIndex: 0,
        }} />

        {/* Orbs */}
        <div style={{ position: 'absolute', width: 200, height: 200, background: '#D403E1', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, top: -50, right: '10%', zIndex: 0 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, background: '#03CCFF', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, bottom: -50, left: '10%', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 32, fontWeight: 700, marginBottom: '0.5rem' }}>
            Tous les <span style={{ background: 'linear-gradient(135deg,#D403E1,#03CCFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Événements</span>
          </h1>
          <p style={{ fontSize: 14, color: '#8888aa', maxWidth: 500, margin: '0 auto 1.5rem' }}>
            Explorez tous les événements passés, présents et futurs de la plateforme EventSync.
          </p>

          {/* Search Bar */}
          <div style={{ 
            position: 'relative', display: 'flex', maxWidth: 500, width: '100%', 
            margin: '0 auto', background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(9,251,255,0.2)', borderRadius: 30, 
            overflow: 'hidden', padding: '4px 4px 4px 16px' 
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a5a7a" strokeWidth="2" style={{ flexShrink: 0, marginRight: 8, alignSelf: 'center' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par titre, lieu ou description..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, fontFamily: 'var(--font-body)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', color: '#5a5a7a', cursor: 'pointer', padding: '0 8px', fontSize: 16 }}>✕</button>
            )}
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section style={{ padding: '3rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ 
              width: 40, height: 40, border: '3px solid rgba(3,204,255,0.1)', 
              borderTopColor: '#03CCFF', borderRadius: '50%', 
              margin: '0 auto 1rem', animation: 'spin 1s linear infinite' 
            }} />
            <p style={{ color: '#8888aa', fontSize: 14 }}>Chargement des événements...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#6666aa' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#333366" strokeWidth="1" style={{ marginBottom: '1rem' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <h3 style={{ fontSize: 18, color: '#fff', marginBottom: '0.5rem' }}>Aucun résultat</h3>
            <p style={{ fontSize: 14 }}>Nous n'avons trouvé aucun événement correspondant à "{search}".</p>
            <button 
              onClick={() => setSearch('')}
              style={{ 
                marginTop: '1.5rem', background: 'transparent', 
                border: '1px solid rgba(3,204,255,0.3)', color: '#03CCFF', 
                padding: '8px 20px', borderRadius: 20, cursor: 'pointer' 
              }}
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}