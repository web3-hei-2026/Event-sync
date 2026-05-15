'use client';
import { useEffect, useState } from 'react';
import { getEvents, getEvent } from '@/lib/api';
import Link from 'next/link';

// ─── Live Badge ───────────────────────────────────────────────────────────────
function LiveBadge() {
  return (
    <span className="flex items-center gap-1 bg-[#D403E1]/20 text-[#D403E1] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#D403E1]/40 animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-[#D403E1]" />
      LIVE
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDay   = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit' });
const fmtMonth = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
const fmtTime  = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const isSessionLive = (start: string, end: string) => {
  const now = new Date();
  return now >= new Date(start) && now <= new Date(end);
};

// ─── Favoris localStorage (Contrainte 4.8) ──────────────────────────────────
const FAV_KEY = 'eventsync_favorites';

function getFavs(): string[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
}

function toggleFav(id: string): boolean {
  const favs = getFavs();
  const isFav = favs.includes(id);
  const updated = isFav ? favs.filter(f => f !== id) : [...favs, id];
  localStorage.setItem(FAV_KEY, JSON.stringify(updated));
  return !isFav;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PlanningPage() {
  const [fullEvents, setFullEvents] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [favs, setFavs]             = useState<string[]>([]);

  useEffect(() => { setFavs(getFavs()); }, []);

  const handleToggleFav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowFav = toggleFav(id);
    setFavs(isNowFav ? [...favs, id] : favs.filter(f => f !== id));
  };

  useEffect(() => {
    async function load() {
      try {
        const list     = await getEvents();
        const detailed = await Promise.all(list.map((ev: any) => getEvent(ev.id)));
        setFullEvents(detailed);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-white">
        Chargement...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white py-10 px-4 flex flex-col items-center">

      <header className="w-full max-w-[1200px] mt-8 mb-16 text-center">
        <h1 className="text-4xl md:text-[64px] font-bold tracking-tight font-['Poppins'] leading-tight">
          Planning{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D403E1] to-[#03CCFF]">
            des sessions
          </span>
        </h1>
      </header>

      <main className="w-full max-w-[1200px] space-y-12">
        {fullEvents.map((event) => {
          const grouped: Record<string, any[]> = (event.sessions ?? []).reduce(
            (acc: any, s: any) => {
              const t = fmtTime(s.startTime);
              if (!acc[t]) acc[t] = [];
              acc[t].push(s);
              return acc;
            }, {}
          );

          return (
            <section
              key={event.id}
              className="flex flex-col lg:flex-row bg-[#11111d] rounded-[40px] overflow-hidden border border-white/5 items-stretch shadow-2xl"
            >
              {/* Date & Titre de l'événement */}
              <div className="w-full lg:w-56 flex-shrink-0 bg-gradient-to-b from-[#D403E1] to-[#460071] p-8 flex flex-col items-center justify-center text-center">
                <div className="text-8xl font-black leading-none font-['Poppins']">
                  {fmtDay(event.startDate)}
                </div>
                <span className="text-[18px] font-bold uppercase tracking-[0.5em] mt-2 font-['Poppins']">
                  {fmtMonth(event.startDate)}
                </span>
                {/* RETOUR DU TITRE ICI */}
                <div className="w-full border-t border-white/20 mt-8 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest opacity-90 leading-tight">
                    {event.title}
                  </p>
                </div>
              </div>

              {/* Sessions */}
              <div className="flex-1 bg-[#0a0a1a]/40 divide-y divide-white/5">
                {Object.entries(grouped).map(([time, slots]) => (
                  <div key={time} className="flex flex-col sm:flex-row items-stretch min-h-[180px]">

                    {/* Heure */}
                    <div className="w-full sm:w-36 flex-shrink-0 flex items-start justify-center border-r border-white/5 bg-black/5 pt-10">
                      <span className="text-[#03CCFF] font-bold text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        {time} — {fmtTime(slots[0].endTime)}
                      </span>
                    </div>

                    {/* Grille 4 colonnes */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                      {slots.map((s: any) => {
                        const live  = isSessionLive(s.startTime, s.endTime);
                        const isFav = favs.includes(s.id);

                        return (
                          <Link
                            key={s.id}
                            href={`/sessions/${s.id}`}
                            className="relative bg-white/[0.03] rounded-[28px] hover:bg-white/[0.07] hover:scale-[1.02] transition-all flex flex-col p-5 group border border-white/5"
                          >
                            {/* LIVE Badge */}
                            {live && (
                              <div className="absolute top-3 right-3">
                                <LiveBadge />
                              </div>
                            )}

                            {/* Étoile FAVORIS - Couleur JAUNE si activée */}
                            <button
                              onClick={(e) => handleToggleFav(e, s.id)}
                              className={`
                                absolute bottom-4 right-4
                                w-8 h-8 flex items-center justify-center rounded-full
                                border transition-all duration-300 hover:scale-125 z-10
                                ${isFav
                                  ? 'bg-yellow-400/20 border-yellow-400/60 text-yellow-400' 
                                  : 'bg-white/5 border-white/10 text-white/30 hover:border-yellow-400/40 hover:text-yellow-400/60'
                                }
                              `}
                            >
                              {isFav ? '★' : '☆'}
                            </button>

                            {/* Contenu de la session */}
                            <div className="flex flex-col gap-1.5 pr-10">
                              <h3 className="font-bold text-[16px] leading-tight text-white uppercase font-['Poppins'] group-hover:text-[#03CCFF] transition-colors">
                                {s.title}
                              </h3>
                              <span className="text-[#03CCFF] text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                                <span className="text-[#D403E1]">📍</span>
                                {s.room?.name || 'SALLE'}
                              </span>
                            </div>

                            <div className="mt-auto pt-3">
                              <div className="flex items-start gap-2 text-[12px] text-white/50 italic leading-snug pr-8">
                                <span className="text-white/30 shrink-0">👤</span>
                                <span className="break-words">
                                  {s.speakers?.map((sp: any) => sp.speaker?.fullName ?? sp.fullName).join(', ') || 'Intervenant'}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}