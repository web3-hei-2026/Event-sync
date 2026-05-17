'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useFavorites } from '../../src/hooks/useFavorites';

export default function FavoriteButton({ sessionId }: { sessionId: string }) {
  const { favorites, toggleFavorite } = useFavorites();
  const [isMounted, setIsMounted] = useState(false);

// Évite les bugs d'hydratation Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isFav = favorites.includes(sessionId);

  if (!isMounted) {
    return <Star size={18} color="rgba(255,255,255,0.2)" />;
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); 
        toggleFavorite(sessionId);
      }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
        isFav 
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
          : 'bg-white/3 border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
      }`}
      style={{ cursor: 'pointer' }}
    >
      <Star 
        size={18} 
        fill={isFav ? "#eab308" : "none"} 
        color={isFav ? "#eab308" : "currentColor"} 
      />
      <span className="text-xs font-semibold tracking-wider uppercase">
        {isFav ? 'Favoris' : 'Favoris'}
      </span>
    </button>
  );
}