// services/api.ts — BalancIA
// All fetch logic lives here. Components never call fetch directly.
// Set NEXT_PUBLIC_USE_MOCK=true in .env.local to fall back to mock data.

import type {
  AuthSession,
  CheckinPayload,
  CheckinResponse,
  EmployeeDashboard,
  LoginFormValues,
  ManagerRecommendation,
  ManagerSummary,
  UserProfile,
} from "@/types";

import {
  getMockEmployeeDashboard,
  getMockManagerRecommendations,
  getMockManagerSummary,
  mockLatestCheckinResponse,
  getMockSessionByEmail,
} from "@/mock-data";

// ─── Config ────────────────────────────────────────────────────────────────

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Internal helpers ──────────────────────────────────────────────────────

async function get<T>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.error?.message ?? `GET ${path} failed: ${res.status}`;
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const msg = errBody?.error?.message ?? `POST ${path} failed: ${res.status}`;
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Authenticate with email+password. Returns AuthSession on success.
 */
export async function loginWithCredentials(
  credentials: LoginFormValues
): Promise<AuthSession> {
  if (USE_MOCK) {
    await delay(700);
    const session = getMockSessionByEmail(credentials.email);
    if (!session) throw new Error("No demo account found for that email.");
    return session;
  }

  const data = await post<{ success: boolean; token: string; user: UserProfile }>(
    "/auth/login",
    { email: credentials.email, password: credentials.password }
  );
  return { user: data.user, token: data.token };
}

// ─── Employee endpoints ────────────────────────────────────────────────────

/**
 * POST /checkin
 * Submit employee daily check-in. Returns risk breakdown + AI support.
 */
export async function submitCheckin(
  payload: CheckinPayload,
  token?: string
): Promise<CheckinResponse> {
  if (USE_MOCK) {
    await delay(800);
    return mockLatestCheckinResponse;
  }
  return post<CheckinResponse>("/checkin", payload, token);
}

/**
 * GET /employee/{user_id}/dashboard
 * Returns full employee dashboard: risk breakdown, trend, AI support.
 */
export async function getEmployeeDashboard(
  userId: string,
  token?: string
): Promise<EmployeeDashboard> {
  if (USE_MOCK) {
    await delay(600);
    const data = getMockEmployeeDashboard(userId);
    if (!data) throw new Error(`No mock dashboard for user ${userId}`);
    return data;
  }
  return get<EmployeeDashboard>(`/employee/${userId}/dashboard`, token);
}

// ─── Manager endpoints ─────────────────────────────────────────────────────

/**
 * GET /manager/{team_id}/summary
 * Returns team wellbeing summary: KPIs, employee list, trend.
 */
export async function getManagerSummary(
  teamId: string,
  token?: string
): Promise<ManagerSummary> {
  if (USE_MOCK) {
    await delay(600);
    const data = getMockManagerSummary(teamId);
    if (!data) throw new Error(`No mock summary for team ${teamId}`);
    return data;
  }
  return get<ManagerSummary>(`/manager/${teamId}/summary`, token);
}

/**
 * GET /manager/{team_id}/recommendations
 * Returns AI-generated team-level recommendation block.
 */
export async function getManagerRecommendations(
  teamId: string,
  token?: string
): Promise<ManagerRecommendation> {
  if (USE_MOCK) {
    await delay(500);
    const data = getMockManagerRecommendations(teamId);
    if (!data) throw new Error(`No mock recommendations for team ${teamId}`);
    return data;
  }
  return get<ManagerRecommendation>(`/manager/${teamId}/recommendations`, token);
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
