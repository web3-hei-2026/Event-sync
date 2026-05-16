'use client';
import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('event-sync-favs');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur de lecture des favoris", e);
      }
    }

    const handleSync = () => {
      const updated = localStorage.getItem('event-sync-favs');
      if (updated) {
        setFavorites(JSON.parse(updated));
      } else {
        setFavorites([]);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('favorites-updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('favorites-updated', handleSync);
    };
  }, []);

  const toggleFavorite = (id: string) => {
    const saved = localStorage.getItem('event-sync-favs');
    let currentFavs: string[] = [];
    if (saved) {
      try { currentFavs = JSON.parse(saved); } catch (e) {}
    }

    const newFavs = currentFavs.includes(id)
      ? currentFavs.filter(favId => favId !== id)
      : [...currentFavs, id];
    
    setFavorites(newFavs);
    localStorage.setItem('event-sync-favs', JSON.stringify(newFavs));

    window.dispatchEvent(new Event('favorites-updated'));
  };

  return { favorites, toggleFavorite };
}