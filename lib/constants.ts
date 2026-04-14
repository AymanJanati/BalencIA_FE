// lib/constants.ts — BalencIA
// Single source of truth for all hardcoded values.
// Never write route paths, labels, or config inline in components.

import type { RiskLevel } from "@/types";

// ─── Routes ────────────────────────────────────────────────────────────────

export const ROUTES = {
  login: "/login",
  checkin: "/checkin",
  dashboard: "/dashboard",
  manager: "/manager",
} as const;

// ─── Risk levels ───────────────────────────────────────────────────────────

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Moderate risk",
  high: "High risk",
};

export const RISK_BADGE_STYLES: Record<RiskLevel, string> = {
  low: "bg-risk-low-bg text-risk-low-text",
  medium: "bg-risk-medium-bg text-risk-medium-text",
  high: "bg-risk-high-bg text-risk-high-text",
};

// ─── Mood selector ─────────────────────────────────────────────────────────

export const MOOD_OPTIONS = [
  { value: 1, label: "Very bad", emoji: "😔" },
  { value: 2, label: "Bad", emoji: "😕" },
  { value: 3, label: "Okay", emoji: "😐" },
  { value: 4, label: "Good", emoji: "🙂" },
  { value: 5, label: "Very good", emoji: "😄" },
] as const;

// ─── Slider fields ─────────────────────────────────────────────────────────

export const SLIDER_FIELDS = [
  {
    key: "stress",
    label: "Stress level",
    min: 1,
    max: 5,
    hint: "1 = calm, 5 = overwhelmed",
  },
  {
    key: "fatigue",
    label: "Fatigue level",
    min: 1,
    max: 5,
    hint: "1 = energized, 5 = exhausted",
  },
  {
    key: "workload",
    label: "Workload pressure",
    min: 1,
    max: 5,
    hint: "1 = light, 5 = overloaded",
  },
] as const;

// ─── Score display ─────────────────────────────────────────────────────────

export const SCORE_MIN = 1;
export const SCORE_MAX = 5;

export function scoreToPercent(score: number): number {
  return Math.round(((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100);
}

// ─── Navigation items ──────────────────────────────────────────────────────

export const EMPLOYEE_NAV = [
  { label: "Check-in", href: ROUTES.checkin },
  { label: "Dashboard", href: ROUTES.dashboard },
] as const;

export const MANAGER_NAV = [
  { label: "Team overview", href: ROUTES.manager },
] as const;

// ─── Date formatting ───────────────────────────────────────────────────────

export function formatCheckinDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ─── Team defaults ─────────────────────────────────────────────────────────

// Used when team_id is not available from session
export const DEFAULT_TEAM_ID = "team_001";
