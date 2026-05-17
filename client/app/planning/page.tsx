'use client';

import { useEffect, useState } from 'react';
import { getEvents, getEvent } from '@/lib/api';
import Link from 'next/link';
import { Star, MapPin, User, Clock } from 'lucide-react';

// ─── BADGES D'ÉTATS DYNAMIQUES ──────────────────────────────────────────────
function StatusBadge({ startTime, endTime }: { startTime: string; endTime: string }) {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now >= start && now <= end) {
    return (
      <span className="flex items-center gap-1 bg-red-500/10 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-red-500/20 uppercase tracking-wider animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Live
      </span>
    );
  }

  if (now > end) {
    return (
      <span className="flex items-center bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-wider">
        Terminée
      </span>
    );
  }

  return (
    <span className="flex items-center bg-[#03CCFF]/10 text-[#03CCFF] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#03CCFF]/20 uppercase tracking-wider">
      À venir
    </span>
  );
}

// ─── HELPERS FORMATAGE ──────────────────────────────────────────────────────
const fmtDay      = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit' });
const fmtMonth    = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
const fmtTime     = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
const fmtLocalDate = (iso: string) => new Date(iso).toISOString().split('T')[0];

const FAV_KEY = 'event-sync-favs';

function getFavs(): string[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
}

function toggleFav(id: string): boolean {
  const favs = getFavs();
  const isFav = favs.includes(id);
  const updated = isFav ? favs.filter(f => f !== id) : [...favs, id];
  localStorage.setItem(FAV_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('favorites-updated'));
  return !isFav;
}

export default function PlanningPage() {
  const [fullEvents, setFullEvents] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [favs, setFavs]             = useState<string[]>([]);

  useEffect(() => { setFavs(getFavs()); }, []);

  useEffect(() => {
    const handleSync = () => setFavs(getFavs());
    window.addEventListener('favorites-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('favorites-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

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

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-white italic font-['Poppins']">
      Chargement de ton planning...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white py-10 px-4 flex flex-col items-center">
      <header className="w-full max-w-[1200px] mt-8 mb-16 text-center">
        <h1 className="text-4xl md:text-[64px] font-bold tracking-tight font-['Poppins'] leading-tight">
          Planning <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D403E1] to-[#03CCFF]">des sessions</span>
        </h1>
      </header>

      <main className="w-full max-w-[1400px] space-y-16">
        {fullEvents.map((event) => {
          
          // Double regroupement : Par Jour, puis par Créneau Horaire
          const groupedByDay: Record<string, Record<string, any[]>> = {};

          (event.sessions ?? []).forEach((s: any) => {
            const dayKey = fmtLocalDate(s.startTime);
            const timeSlot = `${fmtTime(s.startTime)} — ${fmtTime(s.endTime)}`;

            if (!groupedByDay[dayKey]) groupedByDay[dayKey] = {};
            if (!groupedByDay[dayKey][timeSlot]) groupedByDay[dayKey][timeSlot] = [];
            
            groupedByDay[dayKey][timeSlot].push(s);
          });

          const sortedDays = Object.entries(groupedByDay).sort(([a], [b]) => a.localeCompare(b));

          return (
            <section key={event.id} className="bg-[#11111d] rounded-[40px] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
              
              {/* ── BANDEAU DE L'ÉVÉNEMENT (Lien cliquable sur tout le bloc du titre) ── */}
              <Link 
                href={`/events/${event.id}`}
                className="w-full bg-gradient-to-r from-[#D403E1] to-[#460071] p-6 md:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:brightness-110 transition-all duration-300 group/title"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase font-['Poppins'] tracking-tight group-hover/title:text-[#03CCFF] transition-colors">
                    {event.title}
                  </h2>
                  <p className="text-sm opacity-80 font-medium mt-1">
                    {new Date(event.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })} — {new Date(event.endDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} · {event.location}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="bg-black/30 border border-white/10 text-white text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap">
                    {sortedDays.length} jours • {event.sessions?.length || 0} sessions
                  </span>
                </div>
              </Link>

              {/* ── LISTE DES JOURS MULTI-JOURS ── */}
              <div className="divide-y divide-white/5">
                {sortedDays.map(([dayIso, timeSlots]) => (
                  <div key={dayIso} className="flex flex-col lg:flex-row items-stretch">
                    
                    {/* Colonne latérale du Jour (Lien cliquable sur la date) */}
                    <Link
                      href={`/events/${event.id}`}
                      className="w-full lg:w-44 flex-shrink-0 bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-white/5 p-6 flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-0 text-center min-w-[150px] hover:bg-white/[0.04] transition-all duration-300 group/date"
                    >
                      <div className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 font-['Poppins'] group-hover/date:scale-105 transition-transform">
                        {fmtDay(dayIso)}
                      </div>
                      <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#D403E1] font-['Poppins']">
                        {fmtMonth(dayIso)}
                      </span>
                    </Link>

                    {/* Conteneur des Créneaux Horaires de cette journée */}
                    <div className="flex-1 divide-y divide-white/[0.03]">
                      {Object.entries(timeSlots).map(([timeRange, slots]) => (
                        <div key={timeRange} className="flex flex-col md:flex-row items-stretch p-4 gap-4 min-h-[140px]">
                          
                          {/* Pilule Horaire */}
                          <div className="w-full md:w-44 flex-shrink-0 flex items-center md:justify-center">
                            <span className="text-[#03CCFF] font-bold text-xs bg-[#03CCFF]/5 px-4 py-2 rounded-xl border border-[#03CCFF]/10 flex items-center gap-2 whitespace-nowrap">
                              <Clock size={12} />
                              {timeRange}
                            </span>
                          </div>

                          {/* Grille fixe de 4 colonnes */}
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {slots.map((s: any) => {
                              const isFav = favs.includes(s.id);
                              
                              // Compilation propre de la liste des intervenants
                              const speakersList = s.speakers?.map((sp: any) => sp.speaker?.fullName ?? sp.fullName).join(', ') || 'Intervenant';

                              return (
                                <Link
                                  key={s.id}
                                  href={`/sessions/${s.id}`}
                                  className="relative bg-white/[0.02] rounded-[24px] hover:bg-white/[0.06] hover:scale-[1.02] transition-all flex flex-col p-5 group border border-white/5 justify-between min-h-[160px]"
                                >
                                  <div>
                                    {/* En-tête de carte avec le Badge */}
                                    <div className="flex justify-between items-start gap-4 mb-3">
                                      <h3 className="font-bold text-[14px] leading-tight text-white uppercase font-['Poppins'] group-hover:text-[#03CCFF] transition-colors line-clamp-2">
                                        {s.title}
                                      </h3>
                                      <div className="flex-shrink-0">
                                        <StatusBadge startTime={s.startTime} endTime={s.endTime} />
                                      </div>
                                    </div>

                                    {/* Description */}
                                    {s.description && (
                                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                                        {s.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* Informations du bas de carte */}
                                  <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/5 w-full">
                                    {/* Conteneur infos de gauche bridé en largeur maximale pour éviter que l'étoile bouge */}
                                    <div className="flex flex-col gap-1.5 max-w-[calc(100%-40px)] w-full">
                                      <span className="text-[#03CCFF] text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                                        <MapPin size={10} className="text-[#D403E1]" />
                                        {s.room?.name || 'SALLE'}
                                      </span>
                                      
                                      {/* Zone Intervenants Sécurisée contre le débordement */}
                                      <div 
                                        className="flex items-center gap-1.5 text-[11px] text-slate-400 italic w-full"
                                        title={speakersList} // Info-bulle magique au survol de la souris !
                                      >
                                        <User size={10} className="shrink-0 text-white/30" />
                                        <span className="truncate block w-full">
                                          {speakersList}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Étoile de favori */}
                                    <button
                                      onClick={(e) => handleToggleFav(e, s.id)}
                                      className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 ${
                                        isFav
                                          ? 'bg-yellow-400/20 border-yellow-400/60 text-[#FACC15]'
                                          : 'bg-white/5 border-white/10 text-white/20 hover:text-white/60'
                                      }`}
                                    >
                                      <Star
                                        size={14}
                                        fill={isFav ? "#FACC15" : "none"}
                                        stroke={isFav ? "#FACC15" : "currentColor"}
                                      />
                                    </button>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                        </div>
                      ))}
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