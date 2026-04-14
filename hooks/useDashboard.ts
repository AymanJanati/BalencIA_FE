"use client";

// hooks/useDashboard.ts — BalancIA
// Fetches employee dashboard data. Passes auth token to the real API.

import { useState, useEffect } from "react";
import type { AsyncState, EmployeeDashboard } from "@/types";
import { getEmployeeDashboard } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export function useDashboard(userId: string | null) {
  const { session } = useAuth();
  const [state, setState] = useState<AsyncState<EmployeeDashboard>>({
    data:    null,
    loading: false,
    error:   null,
  });

  useEffect(() => {
    if (!userId) return;

    setState({ data: null, loading: true, error: null });

    getEmployeeDashboard(userId, session?.token)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: Error) =>
        setState({ data: null, loading: false, error: err.message })
      );
  }, [userId, session?.token]);

  return state;
}
