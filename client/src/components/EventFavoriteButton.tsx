'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function EventFavoriteButton({ eventId }: { eventId: string }) {
  const [isFav, setIsFav] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('eventsync_favorites') || '[]');
    setIsFav(favs.includes(eventId));
    setIsLoaded(true);
  }, [eventId]);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('eventsync_favorites') || '[]');
    let newFavs;
    
    if (isFav) {
      newFavs = favs.filter((id: string) => id !== eventId);
    } else {
      newFavs = [...favs, eventId];
    }
    
    localStorage.setItem('eventsync_favorites', JSON.stringify(newFavs));
    setIsFav(!isFav);
  };

  if (!isLoaded) return null;

  return (
    <button 
      onClick={toggleFav}
      title={isFav ? "Retirer de l'itinéraire" : "Ajouter à l'itinéraire"}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '8px', borderRadius: '8px',
        background: isFav ? 'rgba(212, 3, 225, 0.15)' : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${isFav ? '#D403E1' : 'rgba(255, 255, 255, 0.1)'}`,
        cursor: 'pointer', transition: 'all 0.2s', width: 36, height: 36
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = isFav ? 'rgba(212, 3, 225, 0.25)' : 'rgba(255, 255, 255, 0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = isFav ? 'rgba(212, 3, 225, 0.15)' : 'rgba(255, 255, 255, 0.05)';
      }}
    >
      <Star size={18} fill={isFav ? "#D403E1" : "none"} color={isFav ? "#D403E1" : "#8888aa"} />
    </button>
  );
}
