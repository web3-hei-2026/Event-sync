"use client";
import type { Question } from "../types";
import { ThumbsUp } from "lucide-react";

interface Props {
  question: Question;
  voted: boolean;
  isLive: boolean;
  onVote: (id: string) => void;
}

export default function QuestionCard({ question, voted, isLive, onVote }: Props) {
  return (
    <div
      style={{
        display: 'flex', gap: '1.25rem', padding: '1.25rem', borderRadius: 15,
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${voted ? 'rgba(3,204,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Upvote Button */}
      <button
        onClick={() => isLive && onVote(question.id)}
        disabled={!isLive}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          padding: '8px 12px', borderRadius: 10, border: 'none',
          background: voted ? 'rgba(3,204,255,0.15)' : 'rgba(255,255,255,0.05)',
          color: voted ? '#03CCFF' : '#6666aa',
          cursor: isLive ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          height: 'fit-content'
        }}
        onMouseEnter={(e) => {
          if (!isLive) return;
          e.currentTarget.style.background = 'rgba(3,204,255,0.2)';
          e.currentTarget.style.color = '#03CCFF';
        }}
        onMouseLeave={(e) => {
          if (!isLive) return;
          e.currentTarget.style.background = voted ? 'rgba(3,204,255,0.15)' : 'rgba(255,255,255,0.05)';
          e.currentTarget.style.color = voted ? '#03CCFF' : '#6666aa';
        }}
      >
        <ThumbsUp
          size={16}
          style={{ fill: voted ? "currentColor" : "none" }}
        />
        <span style={{ fontSize: 13, fontWeight: 700 }}>{question.upvotes}</span>
      </button>

      {/* Content Area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ 
          fontSize: 14, color: '#fff', margin: 0, lineHeight: 1.5,
          wordBreak: 'break-word'
        }}>
          {question.content}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#8888aa' }}>
          <span style={{ 
            fontWeight: 600, color: '#D403E1', 
            background: 'rgba(212,3,225,0.1)', padding: '2px 8px', borderRadius: 6 
          }}>
            {question.authorName || "Anonyme"}
          </span>
          <span>•</span>
          <span>
            {new Date(question.createdAt).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
