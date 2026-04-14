// services/api.ts — BalancIA
// All fetch logic lives here. Components never call fetch directly.
// Set NEXT_PUBLIC_USE_MOCK=true in .env.local to fall back to mock data.

import type {
  AISupport,
  AuthSession,
  CheckinPayload,
  CheckinResponse,
  EmployeeDashboard,
  LoginFormValues,
  ManagerRecommendation,
  ManagerSummary,
  SimulationResponse,
  InterventionType,
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
    return {
      ...mockLatestCheckinResponse,
      ai_support: personalizeAiSupport({
        mood: payload.mood,
        stress: payload.stress,
        fatigue: payload.fatigue,
        workload: payload.workload,
        behaviorScore: payload.behavioral_metrics?.typing_rhythm_score,
        meetingScore: payload.meeting_metrics?.meeting_hours ? Math.min(100, payload.meeting_metrics.meeting_hours * 20) : undefined,
        currentSupport: mockLatestCheckinResponse.ai_support,
      }),
    };
  }
  const data = await post<CheckinResponse>("/checkin", payload, token);
  return {
    ...data,
    ai_support: personalizeAiSupport({
      mood: payload.mood,
      stress: payload.stress,
      fatigue: payload.fatigue,
      workload: payload.workload,
      behaviorScore: data.risk_breakdown.behavior_score ?? undefined,
      meetingScore: data.risk_breakdown.meeting_score ?? undefined,
      currentSupport: data.ai_support,
    }),
  };
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
  const data = await get<EmployeeDashboard>(`/employee/${userId}/dashboard`, token);
  if (!data.ai_support || !data.latest_checkin) return data;

  return {
    ...data,
    ai_support: personalizeAiSupport({
      mood: data.latest_checkin.mood,
      stress: data.latest_checkin.stress,
      fatigue: data.latest_checkin.fatigue,
      workload: data.latest_checkin.workload,
      behaviorScore: data.latest_score?.behavior_score ?? undefined,
      meetingScore: data.latest_score?.meeting_score ?? undefined,
      currentSupport: data.ai_support,
    }),
  };
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

/**
 * POST /manager/{team_id}/simulate
 * Estimates impact of a selected intervention.
 */
export async function simulateManagerIntervention(
  teamId: string,
  interventionType: InterventionType,
  intensity: number,
  token?: string
): Promise<SimulationResponse> {
  if (USE_MOCK) {
    await delay(450);
    const summary = getMockManagerSummary(teamId);
    if (!summary) throw new Error(`No mock summary for team ${teamId}`);

    const beforeScore = Math.round(summary.team_wellbeing_score);
    const scoreDrop = Math.max(1, Math.round(6 * Math.max(0.1, intensity)));
    const beforeRisk = summary.high_risk_count;
    const riskDrop = intensity >= 0.5 && beforeRisk > 0 ? 1 : 0;

    return {
      intervention_type: interventionType,
      estimated_impact: {
        team_score_before: beforeScore,
        team_score_after: Math.max(0, beforeScore - scoreDrop),
        high_risk_count_before: beforeRisk,
        high_risk_count_after: Math.max(0, beforeRisk - riskDrop),
      },
    };
  }

  return post<SimulationResponse>(
    `/manager/${teamId}/simulate`,
    {
      intervention_type: interventionType,
      intensity,
    },
    token
  );
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

function personalizeAiSupport(args: {
  mood: number;
  stress: number;
  fatigue: number;
  workload: number;
  behaviorScore?: number;
  meetingScore?: number;
  currentSupport: AISupport;
}): AISupport {
  const { mood, stress, fatigue, workload, behaviorScore, meetingScore, currentSupport } = args;
  if (!shouldPersonalize(currentSupport)) return currentSupport;

  const reasons: string[] = [];
  if (stress >= 4) reasons.push(`Stress is high today (${stress}/5).`);
  if (fatigue >= 4) reasons.push(`Fatigue is elevated (${fatigue}/5).`);
  if (workload >= 4) reasons.push(`Workload pressure is high (${workload}/5).`);
  if (mood <= 2) reasons.push(`Mood is lower than baseline (${mood}/5).`);
  if (behaviorScore != null && behaviorScore >= 65) reasons.push(`Behavioral strain is elevated (${Math.round(behaviorScore)}/100).`);
  if (meetingScore != null && meetingScore >= 60) reasons.push(`Meeting load is above normal (${Math.round(meetingScore)}/100).`);

  const actions: string[] = [];
  if (stress >= 4 || workload >= 4) {
    actions.push("Protect one 60-minute focus block by deferring low-priority work.");
  }
  if (fatigue >= 4 || mood <= 2) {
    actions.push("Take a short recovery break away from meetings and screens.");
  }
  if ((meetingScore ?? 0) >= 60) {
    actions.push("Reduce non-essential meetings and keep only decision-critical syncs.");
  }
  if ((behaviorScore ?? 0) >= 65) {
    actions.push("Insert planned breaks between long work sessions to stabilize pace.");
  }
  if (actions.length < 3) {
    actions.push("Prioritize only top-impact tasks and postpone at least one non-urgent item.");
  }

  const message = buildPersonalizedMessage({ mood, stress, fatigue, workload, behaviorScore, meetingScore });

  return {
    message,
    actions: actions.slice(0, 3),
    reasons: (reasons.length ? reasons : currentSupport.reasons ?? []).slice(0, 3),
  };
}

function shouldPersonalize(support: AISupport): boolean {
  const message = support.message?.toLowerCase() ?? "";
  if (!message) return true;
  const genericSnippets = [
    "you're carrying a heavy load today",
    "small, consistent resets can make a real difference",
    "take care of yourself today",
  ];
  return genericSnippets.some((snippet) => message.includes(snippet));
}

function buildPersonalizedMessage(args: {
  mood: number;
  stress: number;
  fatigue: number;
  workload: number;
  behaviorScore?: number;
  meetingScore?: number;
}): string {
  const { mood, stress, fatigue, workload, behaviorScore, meetingScore } = args;

  if ((meetingScore ?? 0) >= 65 && workload >= 4) {
    return "Meeting pressure and workload are both high today. Protect focus time and trim non-critical syncs to avoid further overload.";
  }
  if ((behaviorScore ?? 0) >= 65 && fatigue >= 4) {
    return "Your activity pattern suggests sustained strain and low recovery. A lighter pace today will help stabilize your energy.";
  }
  if (stress >= 4 && mood <= 2) {
    return "Stress is elevated and your mood dropped today. Narrow scope, reduce context switching, and keep goals realistic for this cycle.";
  }
  if (workload >= 4) {
    return "Workload is heavier than healthy range today. Focus on essential outcomes and defer non-urgent tasks where possible.";
  }
  return "Your signals are mixed but manageable. Use small proactive adjustments now to prevent escalation over the next few days.";
}
