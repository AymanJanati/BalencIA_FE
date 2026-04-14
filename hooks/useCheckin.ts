"use client";

// hooks/useCheckin.ts — BalencIA
// Handles check-in form submission. Use in /checkin page.

import { useState } from "react";
import type { AsyncState, CheckinPayload, CheckinResponse } from "@/types";
import { submitCheckin } from "@/services/api";

export function useCheckin() {
  const [state, setState] = useState<AsyncState<CheckinResponse>>({
    data:    null,
    loading: false,
    error:   null,
  });

  async function submit(payload: CheckinPayload) {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await submitCheckin(payload);
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
