"use client";

// hooks/useDashboard.ts — BalencIA
// Fetches employee dashboard data. Use in /dashboard page.

import { useState, useEffect } from "react";
import type { AsyncState, EmployeeDashboard } from "@/types";
import { getEmployeeDashboard } from "@/services/api";

export function useDashboard(userId: string | null) {
  const [state, setState] = useState<AsyncState<EmployeeDashboard>>({
    data:    null,
    loading: false,
    error:   null,
  });

  useEffect(() => {
    if (!userId) return;

    setState({ data: null, loading: true, error: null });

    getEmployeeDashboard(userId)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: Error) =>
        setState({ data: null, loading: false, error: err.message })
      );
  }, [userId]);

  return state;
}
