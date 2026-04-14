"use client";

// hooks/useCheckin.ts — BalancIA
// Handles check-in form submission. Passes auth token to the real API.

import { useState } from "react";
import type { AsyncState, CheckinPayload, CheckinResponse } from "@/types";
import { submitCheckin } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export function useCheckin() {
  const { session } = useAuth();
  const [state, setState] = useState<AsyncState<CheckinResponse>>({
    data:    null,
    loading: false,
    error:   null,
  });

  async function submit(payload: CheckinPayload) {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await submitCheckin(payload, session?.token);
      setState({ data, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Submission failed";
      setState({ data: null, loading: false, error: message });
    }
  }

  function reset() {
    setState({ data: null, loading: false, error: null });
  }

  return { ...state, submit, reset };
}
