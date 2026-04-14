"use client";

// hooks/useManagerSummary.ts — BalancIA
// Fetches manager summary + recommendations. Passes auth token to the real API.

import { useState, useEffect } from "react";
import type { AsyncState, ManagerRecommendation, ManagerSummary } from "@/types";
import { getManagerRecommendations, getManagerSummary } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface ManagerData {
  summary:         ManagerSummary;
  recommendations: ManagerRecommendation;
}

export function useManagerSummary(teamId: string | null) {
  const { session } = useAuth();
  const [state, setState] = useState<AsyncState<ManagerData>>({
    data:    null,
    loading: false,
    error:   null,
  });

  useEffect(() => {
    if (!teamId) return;

    setState({ data: null, loading: true, error: null });

    Promise.all([
      getManagerSummary(teamId, session?.token),
      getManagerRecommendations(teamId, session?.token),
    ])
      .then(([summary, recommendations]) =>
        setState({ data: { summary, recommendations }, loading: false, error: null })
      )
      .catch((err: Error) =>
        setState({ data: null, loading: false, error: err.message })
      );
  }, [teamId, session?.token]);

  return state;
}
