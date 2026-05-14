'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
// → utilisé dans : app/planning/page.tsx
// → redirige vers : /sessions/[id]
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
        relative overflow-hidden rounded-xl p-4 cursor-pointer
        border transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        ${isLive
          ? 'border-purple-500 bg-purple-950/40 hover:shadow-purple-500/20'
          : 'border-cyan-900/40 bg-[#14082e]/80 hover:border-purple-500/40 hover:shadow-purple-500/10'
        }
      `}
    >
      {/* Trait gauche si LIVE */}
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
          <span className="bg-cyan-900/30 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full border border-cyan-700/30">
            {roomName}
          </span>
        )}
      </div>

      {/* Titre */}
      <h3 className={`font-bold text-[15px] text-white leading-snug mb-2 ${isLive ? 'pl-2' : ''}`}>
        {title}
      </h3>

      {/* Heure */}
      <p className={`text-xs text-cyan-300 mb-2 ${isLive ? 'pl-2' : ''}`}>
        🕐 {fmt(startTime)} – {fmt(endTime)}
      </p>

      {/* Speakers */}
      {speakers.length > 0 && (
        <p className={`text-[11px] text-slate-400 ${isLive ? 'pl-2' : ''}`}>
          👤 {speakers.join(', ')}
        </p>
      )}

      {/* Capacité */}
      {capacity && (
        <p className={`text-[10px] text-slate-500 mt-1 ${isLive ? 'pl-2' : ''}`}>
          {capacity} places
        </p>
      )}

      {/* Flèche */}
      <span className="absolute bottom-3 right-4 text-purple-500 text-base opacity-0 group-hover:opacity-100 transition-opacity">
        →
      </span>
    </div>
  );
}