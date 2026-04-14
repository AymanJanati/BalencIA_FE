"use client";

// hooks/useManagerSummary.ts — BalencIA
// Fetches manager summary + recommendations. Use in /manager page.

import { useState, useEffect } from "react";
import type { AsyncState, ManagerRecommendation, ManagerSummary } from "@/types";
import { getManagerRecommendations, getManagerSummary } from "@/services/api";

interface ManagerData {
  summary:         ManagerSummary;
  recommendations: ManagerRecommendation;
}

export function useManagerSummary(teamId: string | null) {
  const [state, setState] = useState<AsyncState<ManagerData>>({
    data:    null,
    loading: false,
    error:   null,
  });

  useEffect(() => {
    if (!teamId) return;

    setState({ data: null, loading: true, error: null });

    Promise.all([
      getManagerSummary(teamId),
      getManagerRecommendations(teamId),
    ])
      .then(([summary, recommendations]) =>
        setState({ data: { summary, recommendations }, loading: false, error: null })
      )
      .catch((err: Error) =>
        setState({ data: null, loading: false, error: err.message })
      );
  }, [teamId]);

  return state;
}
