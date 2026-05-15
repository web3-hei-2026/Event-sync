'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function FavoriteButton({ sessionId }: { sessionId: string }) {
  const [isFav, setIsFav] = useState(false);

  // Vérifie si la session est déjà en favoris au chargement
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('eventsync_favorites') || '[]');
    setIsFav(favs.includes(sessionId));
  }, [sessionId]);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche de naviguer si on clique sur le bouton
    const favs = JSON.parse(localStorage.getItem('eventsync_favorites') || '[]');
    let newFavs;
    
    if (isFav) {
      newFavs = favs.filter((id: string) => id !== sessionId);
    } else {
      newFavs = [...favs, sessionId];
    }
    
    localStorage.setItem('eventsync_favorites', JSON.stringify(newFavs));
    setIsFav(!isFav);
  };

  return (
    <button 
      onClick={toggleFav}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '6px 14px', borderRadius: '20px',
        background: isFav ? 'rgba(212, 3, 225, 0.15)' : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${isFav ? '#D403E1' : 'rgba(255, 255, 255, 0.1)'}`,
        color: isFav ? '#D403E1' : '#8888aa',
        fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
      }}
    >
      <Star size={14} fill={isFav ? "#D403E1" : "none"} color={isFav ? "#D403E1" : "#8888aa"} />
      {isFav ? "DANS L'ITINÉRAIRE" : "AJOUTER AUX FAVORIS"}
    </button>
  );
}