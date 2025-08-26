import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface HighScore {
  id: number;
  playerName: string;
  score: number;
  level: number;
  lines: number;
}

export interface NewScore {
  playerName: string;
  score: number;
  level: number;
  lines: number;
}

const API_BASE = '/api';

export function useHighScores() {
  const queryClient = useQueryClient();

  const { data: scores = [], isLoading, error } = useQuery({
    queryKey: ['highScores'],
    queryFn: async (): Promise<HighScore[]> => {
      const response = await fetch(`${API_BASE}/scores`);
      if (!response.ok) {
        throw new Error('Failed to fetch high scores');
      }
      return response.json();
    },
  });

  const submitScoreMutation = useMutation({
    mutationFn: async (newScore: NewScore): Promise<HighScore> => {
      const response = await fetch(`${API_BASE}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newScore),
      });
      if (!response.ok) {
        throw new Error('Failed to submit score');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highScores'] });
    },
  });

  const submitScore = (newScore: NewScore) => {
    submitScoreMutation.mutate(newScore);
  };

  const isNewHighScore = (score: number): boolean => {
    if (scores.length === 0) return true;
    return score > scores[scores.length - 1]?.score;
  };

  const getRank = (score: number): number => {
    const index = scores.findIndex(s => s.score < score);
    return index === -1 ? scores.length + 1 : index + 1;
  };

  return {
    scores,
    isLoading,
    error,
    submitScore,
    isNewHighScore,
    getRank,
    isSubmitting: submitScoreMutation.isPending,
  };
}
