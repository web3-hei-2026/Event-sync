"use client";

import React from 'react';
import Link from 'next/link';
import { Star, Clock, MapPin, Mic } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

// On utilise 'any' temporairement pour 'session' pour supprimer le ROUGE de l'éditeur 
// en attendant que tes types soient mis à jour globalement.
export default function SessionCard({ session, now }: { session: any; now: number }) {
  const { favorites, toggleFavorite } = useFavorites();
  
  // La source de vérité : on ne dépend plus de session.isFavorite
  const isFav = favorites.includes(session.id);

  return (
    <Link 
      href={`/sessions/${session.id}`}
      style={{
        display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem',
        borderRadius: 15, textDecoration: 'none', background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)', position: 'relative', transition: 'all 0.3s ease',
      }}
    >
      {/* Header : Titre et Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: 0, maxWidth: '70%' }}>
          {session.title}
        </h3>
        <div style={{ background: 'rgba(3, 204, 255, 0.15)', color: '#03CCFF', padding: '3px 10px', borderRadius: 12, fontSize: 10, fontWeight: 600 }}>
          À VENIR
        </div>
      </div>

      {/* Détails : Heure, Lieu et Intervenant à la ligne */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#8888aa', fontSize: 12 }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={14} color="#03CCFF" /> {session.startTime ? new Date(session.startTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : '13:30'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={14} color="#03CCFF" /> {session.room?.name || 'Salle A'}
          </span>
        </div>
        
        {/* INTERVENANT À LA LIGNE (Pour ne pas gêner le bouton favoris) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D403E1' }}>
          <Mic size={14} />
          <span>{session.speakers?.[0]?.fullName || 'Miora Julia'}</span>
        </div>
      </div>

      {/* BOUTON FAVORIS (JAUNE SI ACTIF) */}
      <div 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(session.id);
        }}
        style={{
          position: 'absolute', bottom: '1rem', right: '1rem',
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px',
          borderRadius: 20, background: 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isFav ? '#FACC15' : 'rgba(255, 255, 255, 0.1)'}`,
          cursor: 'pointer'
        }}
      >
        <Star size={14} fill={isFav ? "#FACC15" : "none"} color={isFav ? "#FACC15" : "#8888aa"} />
        <span style={{ fontSize: 10, fontWeight: 'bold', color: isFav ? '#FACC15' : '#8888aa', fontStyle: 'italic' }}>
          FAVORIS
        </span>
      </div>
    </Link>
  );
}