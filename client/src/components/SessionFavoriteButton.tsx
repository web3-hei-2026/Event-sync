'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const FAV_KEY = 'event-sync-favs';

export default function SessionFavoriteButton({ sessionId }: { sessionId: string }) {
  const [isFav, setIsFav] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    setIsFav(favs.includes(sessionId));
    setIsLoaded(true);
  }, [sessionId]);

  // Sync si modifié depuis une autre page
  useEffect(() => {
    const handleSync = () => {
      const favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
      setIsFav(favs.includes(sessionId));
    };
    window.addEventListener('favorites-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('favorites-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [sessionId]);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    const newFavs = isFav
      ? favs.filter((id: string) => id !== sessionId)
      : [...favs, sessionId];
    localStorage.setItem(FAV_KEY, JSON.stringify(newFavs));
    setIsFav(!isFav);
    // ✅ Prévient la page favoris que ça a changé
    window.dispatchEvent(new Event('favorites-updated'));
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
        (e.currentTarget as HTMLElement).style.background = isFav
          ? 'rgba(212, 3, 225, 0.25)'
          : 'rgba(255, 255, 255, 0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = isFav
          ? 'rgba(212, 3, 225, 0.15)'
          : 'rgba(255, 255, 255, 0.05)';
      }}
    >
      <Star size={18} fill={isFav ? "#D403E1" : "none"} color={isFav ? "#D403E1" : "#8888aa"} />
    </button>
  );
}