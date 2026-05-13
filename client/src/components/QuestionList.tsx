"use client";
import { useQuestions } from "../hooks/useQuestions";
import QuestionCard from "../components/QuestionCard";
import QuestionForm from "../components/QuestionForm";
import { MessageSquare, Loader2 } from "lucide-react";

interface Props {
  sessionId: string;
  isLive: boolean;
}

export default function QuestionList({ sessionId, isLive }: Props) {
  const { questions, loading, error, votedIds, submit, vote } = useQuestions(sessionId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {isLive && <QuestionForm onSubmit={submit} />}

      {!isLive && (
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            padding: '4rem 2rem', textAlign: 'center', borderRadius: 20,
            background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)'
          }}
        >
          <MessageSquare size={40} color="#333366" style={{ opacity: 0.5 }} />
          <div>
            <h3 style={{ fontSize: 16, color: '#fff', marginBottom: 6 }}>Q&A non disponible</h3>
            <p style={{ fontSize: 13, color: '#8888aa', maxWidth: 300, margin: '0 auto' }}>
              Le module de questions-réponses s'activera automatiquement lorsque la session sera en direct.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem' }}>
          <Loader2 size={32} color="#03CCFF" className="animate-spin" />
          <p style={{ fontSize: 13, color: '#8888aa' }}>Récupération des questions...</p>
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            padding: '1rem 1.5rem', borderRadius: 12, fontSize: 13,
            background: 'rgba(255,50,50,0.1)', color: '#ff6060', border: '1px solid rgba(255,50,50,0.2)'
          }}
        >
          {error}
        </div>
      )}

      {!loading && questions.length === 0 && isLive && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#8888aa' }}>
          <p style={{ fontSize: 14, fontStyle: 'italic' }}>Soyez le premier à poser une question !</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            voted={votedIds.has(q.id)}
            isLive={isLive}
            onVote={vote}
          />
        ))}
      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
