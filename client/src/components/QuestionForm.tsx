"use client";
import { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  onSubmit: (content: string, authorName?: string) => Promise<void>;
}

export default function QuestionForm({ onSubmit }: Props) {
  const [content, setContent]       = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(content.trim(), authorName.trim() || undefined);
      setContent("");
      setAuthorName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  const inputBaseStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#fff",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        padding: '1.5rem', borderRadius: 20,
        background: 'rgba(3,204,255,0.03)',
        border: '1px solid rgba(3,204,255,0.15)',
        display: 'flex', flexDirection: 'column', gap: '1rem'
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#03CCFF', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Poser une question
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Votre question..."
          rows={3}
          maxLength={500}
          style={{ ...inputBaseStyle, resize: "none" }}
          onFocus={(e) => { 
            e.target.style.borderColor = "#03CCFF"; 
            e.target.style.background = "rgba(255,255,255,0.08)";
          }}
          onBlur={(e) => { 
            e.target.style.borderColor = "rgba(255,255,255,0.1)"; 
            e.target.style.background = "rgba(255,255,255,0.05)";
          }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Votre nom (optionnel)"
            maxLength={50}
            style={{ ...inputBaseStyle, flex: 1 }}
            onFocus={(e) => { 
              e.target.style.borderColor = "#03CCFF"; 
              e.target.style.background = "rgba(255,255,255,0.08)";
            }}
            onBlur={(e) => { 
              e.target.style.borderColor = "rgba(255,255,255,0.1)"; 
              e.target.style.background = "rgba(255,255,255,0.05)";
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '0 24px', height: '44px', borderRadius: 12, border: 'none',
              background: loading || !content.trim() 
                ? 'rgba(255,255,255,0.05)' 
                : 'linear-gradient(135deg,#D403E1,#460071)',
              color: loading || !content.trim() ? '#666' : '#fff',
              fontSize: 14, fontWeight: 600,
              cursor: loading || !content.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              if (loading || !content.trim()) return;
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              if (loading || !content.trim()) return;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            {loading ? (
              <span className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : (
              <Send size={16} />
            )}
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </div>

        {error && (
          <p style={{ fontSize: 12, color: '#ff6060', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>⚠️</span> {error}
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
