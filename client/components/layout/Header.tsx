'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Star, Menu, X, Calendar, LayoutGrid, Users, LogIn } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const normalizedPathname = pathname?.replace(/\/$/, '') ?? '';
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/events', label: 'Événements', icon: <Calendar size={16} /> },
    { href: '/planning', label: 'Planning', icon: <LayoutGrid size={16} /> },
    { href: '/speakers', label: 'Intervenants', icon: <Users size={16} /> },
    { href: '/favorites', label: 'Mon Itinéraire', icon: <Star size={16} /> },
  ];

  return (
    <>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem', background: 'rgba(10,10,26,0.95)',
        borderBottom: '1px solid rgba(3,204,255,0.15)',
        position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 18, color: '#09FBFF', textDecoration: 'none' }}>
          EventSync
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {links.map((link) => {
            const isActive = normalizedPathname === link.href || normalizedPathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive ? '#09FBFF' : '#a0a0c0',
                  fontSize: 14, textDecoration: 'none',
                  borderBottom: isActive ? '1px solid #09FBFF' : 'none',
                  paddingBottom: 2, display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Button */}
        <button
          className="desktop-btn"
          style={{
            background: 'linear-gradient(135deg, #D403E1, #460071)',
            border: 'none', color: '#fff', padding: '8px 18px',
            borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
          onClick={() => window.open('http://localhost:3002/#/login', '_blank')}
        >
          <LogIn size={14} />
          Connexion Admin
        </button>

        {/* Mobile — Icons only nav */}
        <nav className="mobile-nav" style={{ display: 'none', gap: '1rem', alignItems: 'center' }}>
          {links.map((link) => {
            const isActive = normalizedPathname === link.href || normalizedPathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                style={{
                  color: isActive ? '#09FBFF' : '#a0a0c0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: 10,
                  background: isActive ? 'rgba(9,251,255,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(9,251,255,0.3)' : '1px solid transparent',
                  textDecoration: 'none',
                }}
              >
                {link.icon}
              </Link>
            );
          })}
          <button
            title="Connexion Admin"
            style={{
              background: 'linear-gradient(135deg, #D403E1, #460071)',
              border: 'none', color: '#fff', width: 36, height: 36,
              borderRadius: 10, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <LogIn size={14} />
          </button>
        </nav>
      </header>

      {/* CSS responsive */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-btn { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}