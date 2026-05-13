"use client";

import { useState, useEffect, useCallback } from "react";
import type { Question } from "../types";
import { getQuestions, createQuestion, upvoteQuestion, unvoteQuestion } from "../lib/api";

export function useQuestions(sessionId: string) {
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [votedIds, setVotedIds]     = useState<Set<string>>(new Set());
  const [userId, setUserId]         = useState<string>("");

  useEffect(() => {
    let id = localStorage.getItem("event_sync_user_id");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("event_sync_user_id", id);
    }
    setUserId(id);
  }, []);

  const fetchQuestions = useCallback(async () => {
    try {
      const data = await getQuestions(sessionId);
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Initial fetch + polling every 10 s while session is live
  useEffect(() => {
    fetchQuestions();
    const interval = setInterval(fetchQuestions, 10_000);
    return () => clearInterval(interval);
  }, [fetchQuestions]);

  const submit = async (content: string, authorName?: string) => {
    const question = await createQuestion(sessionId, { content, authorName });
    setQuestions((prev) => [question, ...prev]);
  };

  const vote = async (questionId: string) => {
    const alreadyVoted = votedIds.has(questionId);

    // Optimistic update
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, upvotes: q.upvotes + (alreadyVoted ? -1 : 1) }
          : q
      )
    );
    setVotedIds((prev) => {
      const next = new Set(prev);
      alreadyVoted ? next.delete(questionId) : next.add(questionId);
      return next;
    });

    try {
      const updated = alreadyVoted
        ? await unvoteQuestion(questionId, userId)
        : await upvoteQuestion(questionId, userId);

      // Reconcile with server value and re-sort
      setQuestions((prev) =>
        [...prev.map((q) => (q.id === questionId ? updated : q))].sort(
          (a, b) => b.upvotes - a.upvotes
        )
      );
    } catch (err) {
      // Roll back optimistic update on failure
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, upvotes: q.upvotes + (alreadyVoted ? 1 : -1) }
            : q
        )
      );
      setVotedIds((prev) => {
        const next = new Set(prev);
        alreadyVoted ? next.add(questionId) : next.delete(questionId);
        return next;
      });
      throw err;
    }
  };

  return { questions, loading, error, votedIds, submit, vote, refresh: fetchQuestions };
}
