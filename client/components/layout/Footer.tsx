import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#050510', borderTop: '1px solid rgba(3,204,255,0.1)',
      padding: '2rem', textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 20, color: '#09FBFF', marginBottom: 8 }}>
        EventSync
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: 12 }}>
        <Link href="/events" style={{ color: '#6666aa', fontSize: 13, textDecoration: 'none' }}>Événements</Link>
        <Link href="/planning" style={{ color: '#6666aa', fontSize: 13, textDecoration: 'none' }}>Planning</Link>
        <Link href="/speakers" style={{ color: '#6666aa', fontSize: 13, textDecoration: 'none' }}>Intervenants</Link>
      </div>
      <div style={{ fontSize: 12, color: '#444466' }}>
        © 2026 EventSync — Plateforme de gestion d'événements en temps réel · HEI Web3
      </div>
    </footer>
  );
}