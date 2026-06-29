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
    <div className="group relative w-64 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-purple-500/10">
      
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:from-cyan-500/5 group-hover:to-purple-500/10 group-hover:opacity-100" />

      <div className="flex flex-col items-center text-center">

        <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-purple-500/30 p-1 transition-transform duration-300 group-hover:scale-105 group-hover:border-purple-500">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-800">
            
             {speaker.photoUrl
            ? <img 
                  src={`http://localhost:5000${speaker.photoUrl}`} 
                  alt={speaker.fullName}  
                  className="object-cover"
                  sizes="(max-width: 96px) 100vw, 96px"
            />
            : initials
            }
          </div>
        </div>

        <h3 className="text-lg font-bold text-white transition-colors duration-200 group-hover:text-purple-400">
           {speaker.fullName}
        </h3>
        {speaker.biography && (
        <p className="mt-1 text-sm font-medium text-slate-400">
          {speaker.biography}
        </p>
        
        )}
        
        {/* Bouton d'action */}
         <span
          onClick={() => onOpen(speaker)}
          className="mt-6 flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20 transition-all duration-200 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          Voir le profil →
        </span>
        
      </div>
    </div>
  );
}