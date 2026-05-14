'use client';
import { useEffect, useState } from 'react';
import { getEvents, getEvent } from '@/lib/api';

const fmtDay = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit' });
const fmtMonth = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

export default function PlanningPage() {
  const [fullEvents, setFullEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await getEvents();
        const detailed = await Promise.all(list.map((ev: any) => getEvent(ev.id)));
        setFullEvents(detailed);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center font-['Inter']">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white py-10 px-4 flex flex-col items-center font-['Inter']">
      
      {/* HEADER : Style identique à "Tous les événements" (image_954e5e.png) */}
      <header className="w-full max-w-[1200px] mt-2 mb-12 text-center">
        <h1 className="text-xl md:text-5xl font-bold tracking-tight font-['Poppins'] normal-case">
          Planning <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D403E1] to-[#03CCFF]">des sessions</span>
        </h1>
      </header>

      <main className="w-full max-w-[1200px] space-y-12">
        {fullEvents.map((event) => {
          const grouped: Record<string, any[]> = (event.sessions ?? []).reduce((acc: any, s: any) => {
            const t = fmtTime(s.startTime);
            if (!acc[t]) acc[t] = [];
            acc[t].push(s);
            return acc;
          }, {});

          return (
            <section key={event.id} className="flex flex-col lg:flex-row bg-[#11111d] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl items-stretch">
              
              {/* BLOC DATE */}
              <div className="w-full lg:w-56 flex-shrink-0 bg-gradient-to-b from-[#D403E1] to-[#460071] p-8 flex flex-col items-center justify-center text-center">
                <div className="text-8xl font-black leading-none font-['Poppins']">{fmtDay(event.startDate)}</div>
                <span className="text-[18px] font-bold uppercase tracking-[0.5em] mt-2 font-['Poppins']">{fmtMonth(event.startDate)}</span>
                <div className="w-full border-t border-white/20 mt-8 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest opacity-90">{event.title}</p>
                </div>
              </div>

              {/* GRILLE DES SESSIONS : Espacement resserré */}
              <div className="flex-1 bg-[#0a0a1a]/40 divide-y divide-white/5">
                {Object.entries(grouped).map(([time, slots]) => (
                  <div key={time} className="flex flex-col sm:flex-row items-stretch min-h-[180px]">
                    
                    {/* Colonne Heure */}
                    <div className="w-full sm:w-36 flex-shrink-0 flex items-start justify-center border-r border-white/5 bg-black/5 pt-10">
                      <span className="text-[#03CCFF] font-bold text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        {time} — {fmtTime(slots[0].endTime)}
                      </span>
                    </div>

                    {/* Zone des sessions : Padding p-4 pour plus de proximité */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                      {slots.map((s: any) => (
                        <div key={s.id} className="bg-white/[0.03] rounded-[28px] hover:bg-white/[0.05] transition-all flex flex-col p-5 group border border-white/5">
                          
                          <div className="flex flex-col gap-1.5">
                            <h3 className="font-bold text-[16px] leading-tight text-white uppercase font-['Poppins']">
                              {s.title}
                            </h3>
                            <span className="text-[#03CCFF] text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                              <span className="text-[#D403E1]">📍</span> {s.room?.name || 'SALLE'}
                            </span>
                          </div>
                          
                          <div className="mt-3"> 
                            <div className="flex items-start gap-2 text-[12px] text-white/50 italic leading-snug">
                              <span className="text-white/30 shrink-0">👤</span>
                              <span className="break-words">
                                {s.speakers?.map((sp: any) => sp.fullName).join(', ') || 'Intervenant'}
                              </span>
                            </div>
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