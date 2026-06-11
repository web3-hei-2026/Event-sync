import Link from 'next/link';
import {
  ArrowRight,
  X,
  Globe,
  Calendar,
  Share2,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Speaker {
  id: number;
  fullName: string;
  biography: string;
  photoUrl: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}
interface SpeakerCardProps {
  speaker: {
    id: string;
    fullName: string;
    biography?: string;
    photoUrl?: string;
  };
  index?: number;
  onOpen: (speaker: any) => void;
}

const gradients = [
  'linear-gradient(135deg,#D403E1,#03CCFF)',
  'linear-gradient(135deg,#03CCFF,#09FBFF)',
  'linear-gradient(135deg,#460071,#D403E1)',
  'linear-gradient(135deg,#8006C7,#03CCFF)',
];

export default function SpeakerCard({ speaker, index = 0 ,  onOpen }: SpeakerCardProps) {
  const initials = speaker.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    // <Link href={`/speakers/${speaker.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
        borderRadius: 12, padding: '1.25rem', textAlign: 'center', cursor: 'pointer',
      }}>
        <div 
         style={{
          width: 60, height: 60, borderRadius: '50%',
          background: gradients[index % gradients.length],
          margin: '0 auto 10px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700, color: '#fff',
          overflow: 'hidden',
        }}>
          {speaker.photoUrl
            ? <img src={`http://localhost:5000${speaker.photoUrl}`} alt={speaker.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials
          }
        </div>
        <div style={{ fontFamily: 'var(--font-title)', fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>
          {speaker.fullName}
        </div>
        {speaker.biography && (
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {speaker.biography}
          </div>
        )}
        {/* <span style={{ fontSize: 11, color: '#09FBFF' }} >Voir le profil →</span> */}
        <span
          onClick={() => onOpen(speaker)}
          style={{
            fontSize: 11,
            color: '#09FBFF',
            cursor: 'pointer'
          }}
        >
          Voir le profil →
        </span>
      </div>
    // </Link>


  );
}