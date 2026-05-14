'use client';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SessionCardProps {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  roomName?: string;
  speakers?: string[];
  isLive?: boolean;
  capacity?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (iso: string) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

// ─── SessionCard ──────────────────────────────────────────────────────────────
export default function SessionCard({
  id,
  title,
  startTime,
  endTime,
  roomName,
  speakers = [],
  isLive = false,
  capacity,
}: SessionCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/sessions/${id}`)}
      className={`
        group relative overflow-hidden rounded-xl p-4 cursor-pointer
        border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
        ${isLive
          ? 'border-purple-500 bg-purple-950/40 hover:shadow-purple-500/20'
          : 'border-white/10 bg-[#0a0a0a] hover:border-yellow-500/40 hover:shadow-yellow-500/10'
        }
      `}
    >
      {/* Trait gauche décoratif */}
      {isLive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-purple-800 rounded-l-xl" />
      )}

      {/* Badges */}
      <div className={`flex items-center gap-2 mb-3 ${isLive ? 'pl-2' : ''}`}>
        {isLive && (
          <span className="bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
            ● LIVE
          </span>
        )}
        {roomName && (
          <span className="bg-white/5 text-white/70 text-[10px] px-2 py-0.5 rounded-full border border-white/10 group-hover:border-yellow-500/30">
            {roomName}
          </span>
        )}
      </div>

      {/* Titre - Adapté à ta charte graphique Gold/White */}
      <h3 className={`font-bold text-[15px] text-white leading-snug mb-2 group-hover:text-yellow-500 transition-colors ${isLive ? 'pl-2' : ''}`}>
        {title}
      </h3>

      {/* Heure */}
      <p className={`text-xs text-white/60 mb-2 ${isLive ? 'pl-2' : ''}`}>
        <span className="mr-1">🕐</span> {fmt(startTime)} – {fmt(endTime)}
      </p>

      {/* Speakers */}
      {speakers.length > 0 && (
        <p className={`text-[11px] text-white/40 ${isLive ? 'pl-2' : ''}`}>
          <span className="mr-1">👤</span> {speakers.join(', ')}
        </p>
      )}

      {/* Capacité */}
      {capacity && (
        <p className={`text-[10px] text-white/30 mt-1 ${isLive ? 'pl-2' : ''}`}>
          {capacity} seats available
        </p>
      )}

      {/* Flèche subtile en Gold au hover */}
      <span className="absolute bottom-3 right-4 text-yellow-500 text-base opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
        →
      </span>
    </div>
  );
}