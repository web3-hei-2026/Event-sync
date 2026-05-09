import React from 'react';
import { mockSpeakers, mockEvent } from '../lib/mock-data';
import { Globe, ArrowLeft, Calendar, Share2, ExternalLink } from 'lucide-react';
import { Link, useParams } from '@tanstack/react-router';
import { Button } from '@blinkdotnew/ui';
import { motion } from 'framer-motion';

export function SpeakerPage() {
  const { speakerId } = useParams({ from: '/speaker/$speakerId' });
  const speaker = mockSpeakers.find(s => s.id === speakerId);

  if (!speaker) return <div>Intervenant non trouvé.</div>;

  const speakerSessions = mockEvent.sessions.filter(s => 
    s.speakers.some(sp => sp.id === speaker.id)
  );

  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'twitter': return <Share2 className="w-5 h-5" />;
      case 'linkedin': return <ExternalLink className="w-5 h-5" />;
      case 'github': return <ExternalLink className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="py-12 px-4 lg:px-8 max-w-4xl mx-auto flex flex-col gap-12">
      <Link to="/event" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm w-fit">
        <ArrowLeft className="w-4 h-4" />
        Retour au planning
      </Link>

      <section className="flex flex-col md:flex-row gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative shrink-0"
        >
          <div className="absolute -inset-1 bg-gradient-to-br from-primary to-accent rounded-3xl blur opacity-30" />
          <img 
            src={speaker.photo} 
            alt={speaker.name} 
            className="w-48 h-48 md:w-64 md:h-64 rounded-3xl object-cover relative border border-white/10" 
          />
        </motion.div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{speaker.name}</h1>
            <div className="flex gap-4">
              {speaker.links.map(link => (
                <a key={link.label} href={link.url} className="p-2 rounded-full bg-secondary hover:text-primary transition-all">
                  {getIcon(link.label)}
                </a>
              ))}
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            {speaker.bio}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" /> Sessions
        </h3>
        
        <div className="grid gap-4">
          {speakerSessions.map(session => (
            <Link key={session.id} to="/session/$sessionId" params={{ sessionId: session.id }} className="p-6 rounded-2xl border bg-card hover:border-primary transition-all flex justify-between items-center group">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-primary font-bold uppercase tracking-widest">{session.startTime} — {session.roomName}</span>
                <h4 className="text-xl font-bold">{session.title}</h4>
              </div>
              <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
