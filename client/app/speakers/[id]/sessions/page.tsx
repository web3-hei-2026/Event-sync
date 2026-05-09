import React from 'react';
import { mockSpeakers, mockEvent } from '../lib/mock-data';
import { User, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@blinkdotnew/ui';
import { motion } from 'framer-motion';

export function SpeakersPage() {
  return (
    <div className="py-12 px-4 lg:px-8 max-w-7xl mx-auto flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Intervenants</h1>
        <p className="text-muted-foreground">Découvrez les experts qui partagent leur savoir à EventSync Conf.</p>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockSpeakers.map((speaker, index) => {
          const sessionsCount = mockEvent.sessions.filter(s => 
            s.speakers.some(sp => sp.id === speaker.id)
          ).length;

          return (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl border bg-card hover:border-primary transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
              
              <img 
                src={speaker.photo} 
                alt={speaker.name} 
                className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-muted group-hover:border-primary transition-colors" 
              />
              
              <h3 className="text-2xl font-bold mb-2">{speaker.name}</h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                {speaker.bio}
              </p>

              <div className="flex flex-col gap-4 mt-auto w-full">
                <div className="text-xs font-bold text-primary uppercase tracking-widest">
                  {sessionsCount} session{sessionsCount > 1 ? 's' : ''}
                </div>
                <Link to="/speaker/$speakerId" params={{ speakerId: speaker.id }}>
                  <Button variant="outline" className="w-full">
                    Voir le profil
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
