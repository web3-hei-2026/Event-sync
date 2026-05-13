"use client";

import { useEffect, useState } from "react";
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

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] =
    useState<Speaker | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpeakers() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/speakers"
        );

        const data = await response.json();

        setSpeakers(data);
      } catch (error) {
        console.error("Erreur chargement speakers :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpeakers();
  }, []);

  const closeModal = () => {
    setSelectedSpeaker(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "twitter":
        return <Share2 className="w-5 h-5" />;

      case "linkedin":
        return <ExternalLink className="w-5 h-5" />;

      case "github":
        return <ExternalLink className="w-5 h-5" />;

      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          Chargement...
        </h1>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 lg:px-8 max-w-7xl mx-auto flex flex-col gap-12">

      {/* HEADER */}

      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Intervenants
        </h1>

        <p className="text-gray-500">
          Découvrez les experts qui partagent leur savoir à EventSync Conf.
        </p>
      </header>

      {/* SPEAKERS GRID */}

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {speakers.map((speaker, index) => (

          <motion.div
            key={speaker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col items-center text-center p-8 rounded-3xl border bg-white hover:border-blue-600 transition-all overflow-hidden shadow-sm"
          >

            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 blur-3xl -z-10 border-2 border-blue-700 " />

              <img
               src={`http://localhost:5000${speaker.photoUrl}`}
                alt={speaker.fullName}
                className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-gray-200 group-hover:border-blue-600 transition-colors"
              />

              <h3 className="text-2xl font-bold mb-2">
                {speaker.fullName}
              </h3>

              <p className=" text-sm line-clamp-3 mb-6">
                {speaker.biography}
              </p>

              <button
                onClick={() => setSelectedSpeaker(speaker)}
                className="w-full border rounded-xl py-3 px-4 hover:bg-[#D403E1] hover:text-white transition-all flex items-center justify-center font-medium"
              >

                Voir le profil

                <ArrowRight className="ml-2 w-4 h-4" />

              </button>

            </motion.div>
        ))}

      </section>

      {/* MODAL */}

      <AnimatePresence>

        {selectedSpeaker && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
            >

              {/* CLOSE BUTTON */}

              <button
                onClick={closeModal}
                className="absolute top-5 right-5 z-10 p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6" />
              </button>

              {/* CONTENT */}

              <div className="p-8 md:p-12 flex flex-col gap-12">

                {/* TOP SECTION */}

                <section className="flex flex-col md:flex-row gap-12 items-start">

                  {/* IMAGE */}

                  <div className="relative shrink-0">

                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl blur opacity-30" />

                    <img
                      src={selectedSpeaker.photo}
                      alt={selectedSpeaker.fullName}
                      className="w-48 h-48 md:w-64 md:h-64 rounded-3xl object-cover relative border border-white/10"
                    />

                  </div>

                  {/* INFO */}

                  <div className="flex flex-col gap-6">

                    <div className="flex flex-col gap-4">

                      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {selectedSpeaker.fullName}
                      </h1>

                      {/* SOCIAL LINKS */}

                      <div className="flex gap-4">

                        {selectedSpeaker.twitter && (
                          <a
                            href={selectedSpeaker.twitter}
                            target="_blank"
                            className="p-3 rounded-full bg-gray-100 hover:text-blue-600 transition-all"
                          >
                            {getIcon("twitter")}
                          </a>
                        )}

                        {selectedSpeaker.linkedin && (
                          <a
                            href={selectedSpeaker.linkedin}
                            target="_blank"
                            className="p-3 rounded-full bg-gray-100 hover:text-blue-600 transition-all"
                          >
                            {getIcon("linkedin")}
                          </a>
                        )}

                        {selectedSpeaker.github && (
                          <a
                            href={selectedSpeaker.github}
                            target="_blank"
                            className="p-3 rounded-full bg-gray-100 hover:text-blue-600 transition-all"
                          >
                            {getIcon("github")}
                          </a>
                        )}

                      </div>

                    </div>

                    {/* BIO */}

                    <p className="text-lg text-gray-600 leading-relaxed">
                      {selectedSpeaker.biography}
                    </p>

                  </div>

                </section>

                {/* SESSIONS */}

                <section className="flex flex-col gap-8">

                  <h3 className="text-2xl font-bold flex items-center gap-3">

                    <Calendar className="w-6 h-6 text-blue-600" />

                    Sessions

                  </h3>

                  <div className="grid gap-4">

                    <div className="p-6 rounded-2xl border hover:border-blue-600 transition-all flex justify-between items-center">

                      <div className="flex flex-col gap-1">

                        <span className="text-xs text-blue-600 font-bold uppercase tracking-widest">
                          09:00 — Salle A
                        </span>

                        <h4 className="text-xl font-bold">
                          Introduction à Next.js
                        </h4>

                      </div>

                    </div>

                    <div className="p-6 rounded-2xl border hover:border-blue-600 transition-all flex justify-between items-center">

                      <div className="flex flex-col gap-1">

                        <span className="text-xs text-blue-600 font-bold uppercase tracking-widest">
                          14:00 — Salle B
                        </span>

                        <h4 className="text-xl font-bold">
                          Architecture Frontend Moderne
                        </h4>

                      </div>

                    </div>

                  </div>

                </section>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}