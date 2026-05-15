'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/api';
import { Star, X, MapPin, Mic, Clock } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Session {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room?: { name: string };
  // Structure précise selon ton interface
  speakers?: { speaker: { fullName: string } }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const FAV_KEY = 'eventsync_favorites';

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });

const isCurrentlyLive = (start: string, end: string) => {
  const now = new Date();
  return now >= new Date(start) && now <= new Date(end);
};

export default function FavoritesPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const stored = localStorage.getItem(FAV_KEY);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      setFavIds(ids);

      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.all(ids.map(id => getSession(id)));
        results.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        setSessions(results);
      } catch (err) {
        console.error('Erreur chargement favoris', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const removeFav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const updated = favIds.filter(f => f !== id);
    localStorage.setItem(FAV_KEY, JSON.stringify(updated));
    setFavIds(updated);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white py-12 px-4 selection:bg-[#03CCFF]/30">
      <main className="max-w-[900px] mx-auto">
        
        <header className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight font-['Poppins'] mb-2">
            Mon <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D403E1] to-[#03CCFF]">Itinéraire</span>
          </h1>
          <p className="text-slate-400">
            {favIds.length} session{favIds.length > 1 ? 's' : ''} enregistrée{favIds.length > 1 ? 's' : ''}.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-8 h-8 border-2 border-[#03CCFF] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 text-sm italic">Chargement de votre itinéraire...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-24 rounded-[40px] border border-white/5 bg-white/[0.02]">
            <Star size={48} className="mx-auto mb-6 text-white/10" />
            <p className="text-slate-400 mb-8">Aucune session dans vos favoris.</p>
            <Link href="/planning" className="px-8 py-3 rounded-full bg-gradient-to-r from-[#D403E1] to-[#460071] font-bold hover:scale-105 transition-transform inline-block">
              Voir le programme
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => {
              const live = isCurrentlyLive(session.startTime, session.endTime);
              
              // Extraction correcte des noms des intervenants
              const speakerNames = session.speakers
                ?.map(s => s.speaker?.fullName)
                .filter(Boolean)
                .join(', ');

              return (
                <div key={session.id} className="relative group">
                  <Link href={`/sessions/${session.id}`} className={`
                    flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[32px] border transition-all duration-300
                    ${live ? 'border-[#D403E1]/50 bg-[#D403E1]/5' : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10'}
                  `}>
                    
                    {/* Colonne Temps */}
                    <div className="md:w-32 flex-shrink-0">
                      <div className={`text-lg font-bold ${live ? 'text-[#D403E1]' : 'text-[#03CCFF]'}`}>
                        {fmtTime(session.startTime)}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                        {fmtDate(session.startTime)}
                      </div>
                    </div>

                    {/* Colonne Contenu */}
                    <div className="flex-1">
                      <h3 className="font-bold text-xl group-hover:text-[#03CCFF] transition-colors mb-2">
                        {session.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                        {/* Salle */}
                        <span className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#03CCFF]" /> 
                          {session.room?.name || 'Salle à définir'}
                        </span>

                        {/* Intervenants (Alignés à la salle) */}
                        {speakerNames && (
                          <span className="flex items-center gap-2 text-[#D403E1] font-medium">
                             <Mic size={14} /> 
                             {speakerNames}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Supprimer */}
                    <button
                      onClick={(e) => removeFav(e, session.id)}
                      className="absolute top-6 right-6 md:static w-10 h-10 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}