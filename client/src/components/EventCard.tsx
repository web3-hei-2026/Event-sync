"use client";
import Link from "next/link";
import type { EventSummary } from "../types";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// `now` est calculé dans le Server Component parent et passé en prop
export default function EventCard({ event, now }: { event: EventSummary; now: number }) {
  const active = now >= new Date(event.startDate).getTime() && now <= new Date(event.endDate).getTime();

  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative flex flex-col gap-4 rounded-2xl border p-6 transition-all overflow-hidden"
      style={{
        background: "hsl(222 47% 11%)",
        borderColor: "hsl(217 33% 17%)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "hsl(239 84% 67% / 0.5)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "hsl(217 33% 17%)";
      }}
    >
      {/* Glow blob */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "hsl(239 84% 67% / 0.07)", filter: "blur(40px)" }}
      />

      <div className="flex items-start justify-between gap-3">
        <h2
          className="text-base font-semibold leading-snug transition-colors group-hover:text-[hsl(239_84%_67%)]"
          style={{ color: "hsl(213 31% 91%)" }}
        >
          {event.title}
        </h2>
        {active ? (
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ background: "hsl(142 70% 45% / 0.15)", color: "hsl(142 70% 55%)" }}
          >
            En cours
          </span>
        ) : null}
      </div>

      {event.description && (
        <p className="line-clamp-2 text-sm leading-relaxed" style={{ color: "hsl(215 20% 65%)" }}>
          {event.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-4 text-xs" style={{ color: "hsl(215 20% 65%)" }}>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" style={{ color: "hsl(239 84% 67%)" }} />
          {fmt(event.startDate)} → {fmt(event.endDate)}
        </span>
        {event.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={{ color: "hsl(239 84% 67%)" }} />
            {event.location}
          </span>
        )}
      </div>

      <div
        className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "hsl(239 84% 67%)" }}
      >
        Voir le programme <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
