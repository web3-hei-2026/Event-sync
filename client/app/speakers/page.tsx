"use client";

import { useState, useEffect } from 'react';
import SpeakerCard from "@/components/ui/SpeakerCard";
import SpeakerModal from "@/components/ui/SpeakerModal";
import { getSpeakers, getSpeakerSessions } from '@/lib/api';

export default function SpeakersPage() {

  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [open, setOpen] = useState(false);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [speakerSessions, setSpeakerSessions] = useState<any[]>([]);

  useEffect(() => {
    getSpeakers().then(setSpeakers).catch(() => setSpeakers([]));
  }, []);
 const openModal = async (speaker:any) => {
    setSelectedSpeaker(speaker);
    try {
        const sessions =
            await getSpeakerSessions(
                speaker.id.toString()
            );
        setSpeakerSessions(sessions);
    } catch(error){
        console.error(error);
    }
    setOpen(true);
};
  return (
    <>
    {/* Speakers */}
      <section style={{ padding: '2.5rem 2rem', background: 'rgba(70,0,113,0.08)', borderTop: '1px solid rgba(3,204,255,0.08)', borderBottom: '1px solid rgba(3,204,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', textAlign: 'center'}}>
          <div style={{ width : '100vw'}}>
            <h2 style={{ background: 'linear-gradient(135deg,#D403E1,#03CCFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-title)', fontSize: 32, fontWeight: 700, marginBottom: '0.5rem' }}>Intervenants</h2>
            <p>Découvrez les experts qui partagent leur savoir à EventSync Conf.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {speakers.map((speaker,index) => (
            <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                index={index}
                onOpen={openModal}
            />
          ))}
          <SpeakerModal
              speaker={selectedSpeaker}
              isOpen={open}
              onClose={() => setOpen(false)}
              speakerSessions={speakerSessions}
          />
        </div>
      </section>
    </>
  );
}