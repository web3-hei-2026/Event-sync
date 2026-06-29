import Link from 'next/link';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
    sessions?: any[];
  };
  index?: number;
}

function CalendarIcon() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
}
function MapIcon() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function ClockIcon() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
}

function getEventStatus(event: any) {
  const now = new Date();
  
  const startDay = new Date(event.startDate);
  startDay.setHours(0, 0, 0, 0);
  
  const endDay = new Date(event.endDate);
  endDay.setHours(23, 59, 59, 999);

  const isLive = event.sessions?.some((s: any) =>
    new Date(s.startTime) <= now && new Date(s.endTime) >= now
  );
  if (isLive) return 'live';
  
  if (now >= startDay && now <= endDay) return 'ongoing';
  
  if (endDay < now) return 'past';
  return 'upcoming';
}

function getDaysUntil(dateStr: string) {
  const eventDate = new Date(dateStr);
  const now = new Date();
  
  eventDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diff = eventDate.getTime() - now.getTime();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Demain";
  if (days < 0) return "En cours";
  return `Dans ${days} jours`;
}

const coverGradients = {
  live: 'linear-gradient(135deg,#3a0000,#8b0000)',
  ongoing: 'linear-gradient(135deg,#3a1c00,#8b4500)',
  upcoming: 'linear-gradient(135deg,#001a3a,#003a8b)',
  past: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)',
};

const borderColors = {
  live: 'rgba(255,70,70,0.4)',
  ongoing: 'rgba(255,150,50,0.4)',
  upcoming: 'rgba(3,204,255,0.2)',
  past: 'rgba(255,255,255,0.06)',
};

const CoverIcons = {
  live: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,100,100,0.5)" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  ongoing: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,150,50,0.5)" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  upcoming: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(3,204,255,0.5)" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  past: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(100,100,100,0.5)" strokeWidth="1.5">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, any> = {
    live: { bg: 'rgba(255,50,50,0.2)', color: '#ff6060', border: 'rgba(255,50,50,0.4)' },
    ongoing: { bg: 'rgba(255,150,50,0.2)', color: '#ffa500', border: 'rgba(255,150,50,0.4)' },
    upcoming: { bg: 'rgba(3,204,255,0.15)', color: '#03CCFF', border: 'rgba(3,204,255,0.3)' },
    past: { bg: 'rgba(100,100,100,0.2)', color: '#888', border: 'rgba(100,100,100,0.3)' },
  };
  const s = styles[status] || styles.upcoming;
  const labels: Record<string, string> = { live: 'En direct', ongoing: "Aujourd'hui", upcoming: 'À venir', past: 'Terminé' };

  return (
    <div style={{
      position: 'absolute', top: 8, left: 8,
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 9, fontWeight: 600, padding: '3px 8px', borderRadius: 10,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {status === 'live' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />}
      {status === 'ongoing' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ffa500', display: 'inline-block' }} />}
      {labels[status]}
    </div>
  );
};

export default function EventCard({ event, index = 0 }: EventCardProps & { index?: number }) {
  const status = getEventStatus(event);
  const date = new Date(event.startDate);

  return (
    <Link href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${borderColors[status as keyof typeof borderColors]}`,
        borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
        opacity: status === 'past' ? 0.65 : 1,
        transition: 'transform 0.2s',
      }}>
        {/* Cover */}
        <div style={{
          height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: coverGradients[status as keyof typeof coverGradients],
          position: 'relative',
        }}>
          {CoverIcons[status as keyof typeof CoverIcons]}
          <StatusBadge status={status} />
        </div>

        {/* Body */}
        <div style={{ padding: 10 }}>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>
            {event.title}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 10, color: '#6666aa', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CalendarIcon /> {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {event.location && (
              <span style={{ fontSize: 10, color: '#6666aa', display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapIcon /> {event.location}
              </span>
            )}
            <span style={{ fontSize: 10, color: '#6666aa', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ClockIcon /> {event.sessions?.length || 0} session(s)
            </span>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {status === 'live' && <span style={{ fontSize: 10, color: '#ff6060', fontWeight: 600 }}>● Session en cours</span>}
            {status === 'ongoing' && <span style={{ fontSize: 10, color: '#ffa500', fontWeight: 600 }}>Événement en cours</span>}
            {status === 'upcoming' && <span style={{ fontSize: 10, color: '#03CCFF', fontWeight: 600 }}>{getDaysUntil(event.startDate)}</span>}
            {status === 'past' && <span style={{ fontSize: 10, color: '#666', fontWeight: 600 }}>Terminé</span>}

            <span style={{
              background: status === 'live'
                ? 'linear-gradient(135deg,#ff4444,#8b0000)'
                : status === 'ongoing'
                ? 'linear-gradient(135deg,#ffa500,#8b4500)'
                : status === 'upcoming'
                ? 'linear-gradient(135deg,#D403E1,#460071)'
                : 'rgba(100,100,100,0.3)',
              color: status === 'past' ? '#888' : '#fff',
              padding: '4px 10px', borderRadius: 10, fontSize: 10,
            }}>
              {status === 'live' ? 'Rejoindre →' : status === 'ongoing' ? 'Voir →' : status === 'upcoming' ? 'Voir →' : 'Archivé'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}