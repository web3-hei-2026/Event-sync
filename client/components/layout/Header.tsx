'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: '/events', label: 'Événements' },
    { href: '/planning', label: 'Planning' },
    { href: '/speakers', label: 'Intervenants' },
  ];

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 2rem', background: 'rgba(10,10,26,0.95)',
      borderBottom: '1px solid rgba(3,204,255,0.15)',
      position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)',
    }}>
      <Link href="/" style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 18, color: '#09FBFF', textDecoration: 'none' }}>
        EventSync
      </Link>

      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: pathname === link.href ? '#09FBFF' : '#a0a0c0',
              fontSize: 14, textDecoration: 'none',
              borderBottom: pathname === link.href ? '1px solid #09FBFF' : 'none',
              paddingBottom: 2,
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button style={{
        background: 'linear-gradient(135deg, #D403E1, #460071)',
        border: 'none', color: '#fff', padding: '8px 18px',
        borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer',
      }}>
        Connexion Admin
      </button>
    </header>
  );
}