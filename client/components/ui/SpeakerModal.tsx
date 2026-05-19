"use client";
import Link from 'next/link';
import { X, FaLinkedin } from "lucide-react";
import { getSpeakerSessions } from '@/lib/api';
interface Speaker {
  id: number;
  fullName: string;
  biography: string;
  photoUrl?: string;
}
interface SpeakerSession{

}
import { ExternalLink, Calendar, ArrowLeft } from 'lucide-react';
interface SpeakerModalProps {
  speaker: Speaker | null;
  isOpen: boolean;
  onClose: () => void;
  speakerSessions: any[];
}

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().replace('T', ' ').slice(0, 16);
};
export default function SpeakerModal({
  speaker,
  isOpen,
  onClose,
  speakerSessions,
}: SpeakerModalProps) {

  if (!isOpen || !speaker) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111",
          padding: "2rem",
          borderRadius: "15px",
          width: "700px",
          color: "white",
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: "right",
            cursor: "pointer",
          }}
        >
          <X size={24} />
        </button>
         <div style = {{ display:"flex" , gap:"2rem", marginBottom: '1rem'}}>
           <img
            src={`http://localhost:5000${speaker.photoUrl}`}
            alt={speaker.fullName}
            style={{
              width: 192,
              height: 192,
              borderRadius: "24px",
              objectFit: "cover",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />

          <div>
            <h2 style={{  fontSize: 32, fontWeight: 700 }}>{speaker.fullName}</h2>

            <p>{speaker.biography}</p>
              <Link href={speaker.externalLinks} style={{ display:'flex', justifyContent:'center' , alignItems: 'center' , gap: '5px', color: '#09FBFF', textDecoration:'underline 1px'}}>
                <ExternalLink className="w-5 h-5" />
                {speaker.externalLinks}
              </Link>
          </div>
         </div>
        <div style={{}}>
            <h3 className="text-2xl font-bold flex items-center gap-3 mb-5">
              <Calendar style={{ color: '#D403E1'}}/> Sessions
            </h3>
            <div className="grid gap-4">
              {speakerSessions.length === 0 ? (
                <p>Aucune session.</p>
            ) : (
              speakerSessions.map((session:any) => (
                  <div key={session.id}
                    style={{
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    border: `1px solid #d203e141`,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                    justifyContent: 'space-between',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  >
                     <div>
                        <p style={{ color:'#D403E1', fontFamily: 'var(--font-title)', fontSize:14}}>
                          {formatDateTime(session.startTime)}
                        </p>
                        <h4 style= {{ fontFamily: 'var(--font-title)', fontSize: 25}}>{session.title}</h4>
                     </div>
                     <Link href="/events">
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                     </Link>
                  </div>
            ))
          )}
      </div>
</div>
      </div>
    </div>
  );
}