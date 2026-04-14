// services/api.ts — BalencIA
// All fetch logic lives here. Components never call fetch directly.
// Toggle USE_MOCK to switch between mock data and real backend.

import type {
  CheckinPayload,
  CheckinResponse,
  EmployeeDashboard,
  ManagerRecommendation,
  ManagerSummary,
} from "@/types";

import {
  getMockEmployeeDashboard,
  getMockManagerRecommendations,
  getMockManagerSummary,
  mockLatestCheckinResponse,
} from "@/mock-data";

// ─── Config ────────────────────────────────────────────────────────────────

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Internal helpers ──────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── Employee endpoints ────────────────────────────────────────────────────

/**
 * POST /checkin
 * Submit employee daily check-in. Returns burnout score + AI support.
 */
export async function submitCheckin(
  payload: CheckinPayload
): Promise<CheckinResponse> {
  if (USE_MOCK) {
    await delay(800);
    return mockLatestCheckinResponse;
  }
  return post<CheckinResponse>("/checkin", payload);
}

/**
 * GET /employee/{user_id}/dashboard
 * Returns full employee dashboard: score, trend, AI support, history.
 */
export async function getEmployeeDashboard(
  userId: string
): Promise<EmployeeDashboard> {
  if (USE_MOCK) {
    await delay(600);
    const data = getMockEmployeeDashboard(userId);
    if (!data) throw new Error(`No mock dashboard for user ${userId}`);
    return data;
  }
  return get<EmployeeDashboard>(`/employee/${userId}/dashboard`);
}

// ─── Manager endpoints ─────────────────────────────────────────────────────

/**
 * GET /manager/{team_id}/summary
 * Returns team wellbeing summary: KPIs, employee list, trend.
 */
export async function getManagerSummary(
  teamId: string
): Promise<ManagerSummary> {
  if (USE_MOCK) {
    await delay(600);
    const data = getMockManagerSummary(teamId);
    if (!data) throw new Error(`No mock summary for team ${teamId}`);
    return data;
  }
  return get<ManagerSummary>(`/manager/${teamId}/summary`);
}

/**
 * GET /manager/{team_id}/recommendations
 * Returns AI-generated team-level recommendation block.
 */
export async function getManagerRecommendations(
  teamId: string
): Promise<ManagerRecommendation> {
  if (USE_MOCK) {
    await delay(500);
    const data = getMockManagerRecommendations(teamId);
    if (!data) throw new Error(`No mock recommendations for team ${teamId}`);
    return data;
  }
  return get<ManagerRecommendation>(`/manager/${teamId}/recommendations`);
}

// ─── Health check ──────────────────────────────────────────────────────────

export async function healthCheck(): Promise<boolean> {
  if (USE_MOCK) return true;
  try {
    await get("/health");
    return true;
  } catch {
    return false;
  }
}

// ─── Utility ───────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
