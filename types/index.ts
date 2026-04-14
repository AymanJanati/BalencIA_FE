// types/index.ts — BalancIA
// Updated to match the upgraded backend schemas.

export type UserRole = "employee" | "manager";
export type RiskLevel = "low" | "medium" | "high";
export type MoodValue = 1 | 2 | 3 | 4 | 5;
export type ScaleValue = 1 | 2 | 3 | 4 | 5;

// ─── User ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team_id?: string;
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface AuthSession {
  user: UserProfile;
  token?: string;
}

// ─── Check-in ───────────────────────────────────────────────────────────────

export interface CheckinPayload {
  user_id: string;
  mood: MoodValue;
  stress: ScaleValue;
  fatigue: ScaleValue;
  workload: ScaleValue;
  note?: string;
  behavioral_metrics?: BehavioralMetrics;
  meeting_metrics?: MeetingMetrics;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  mood: MoodValue;
  stress: ScaleValue;
  fatigue: ScaleValue;
  workload: ScaleValue;
  note?: string;
  created_at: string;
}

// ─── Risk & Scoring ─────────────────────────────────────────────────────────

/**
 * Full multi-source risk breakdown from the upgraded backend.
 * All numeric scores are 0–100 (higher = more risk).
 */
export interface RiskBreakdown {
  self_report_score: number;
  behavior_score?: number | null;
  meeting_score?: number | null;
  trend_score: number;
  global_score: number;
  risk_level: RiskLevel;
}

/**
 * Legacy simple score type — kept for backward UI compat.
 * Maps global_score (0-100) and risk_level from RiskBreakdown.
 */
export interface BurnoutScore {
  score: number;    // 0–100
  risk_level: RiskLevel;
}

// ─── AI Support ─────────────────────────────────────────────────────────────

export interface AISupport {
  message: string;
  actions: string[];
  reasons?: string[];     // upgraded: grounded explanation factors
}

// ─── Check-in response ──────────────────────────────────────────────────────

export interface CheckinResponse {
  success: boolean;
  checkin_id: string;
  risk_breakdown: RiskBreakdown;   // upgraded (was burnout_score)
  ai_support: AISupport;
}

// ─── Trend ──────────────────────────────────────────────────────────────────

export interface TrendPoint {
  date: string;
  score?: number;           // employee trend: global_score (0-100)
  team_score?: number;      // manager trend: averaged global_score (0-100)
  // legacy fields (kept for mock-data compat)
  stress?: number;
  fatigue?: number;
  workload?: number;
  wellbeing_score?: number;
}

// ─── Behavioral / Meeting metrics ───────────────────────────────────────────

export interface BehavioralMetrics {
  typing_rhythm_score: number;
  inactivity_bursts: number;
  session_duration_minutes: number;
  break_count: number;
  tab_switch_rate: number;
  late_activity_flag: boolean;
}

export interface MeetingMetrics {
  meetings_count: number;
  meeting_hours: number;
  back_to_back_count: number;
  no_break_blocks: number;
}

// ─── Employee dashboard ─────────────────────────────────────────────────────

export interface EmployeeDashboard {
  user: UserProfile;
  latest_checkin: DailyCheckin | null;
  latest_score: RiskBreakdown | null;   // upgraded (was BurnoutScore)
  ai_support: AISupport | null;
  trend: TrendPoint[];
  behavioral_metrics?: BehavioralMetrics | null;
  meeting_metrics?: MeetingMetrics | null;
  checkin_history?: DailyCheckin[];     // not returned by BE, kept for mock compat
}

// ─── Manager / Team ─────────────────────────────────────────────────────────

export interface TeamEmployee {
  id: string;
  name: string;
  role?: UserRole;
  risk_level: RiskLevel | string;
  score?: number | null;            // global_score 0-100 (was latest_score float 1-5)
  latest_score?: number;            // legacy name, kept for mock compat
  stress?: number | null;
  fatigue?: number | null;
  behavior_score?: number | null;
  meeting_score?: number | null;
  latest_checkin_at?: string;
}

export interface ManagerSummary {
  team_id: string;
  team_name: string;
  team_wellbeing_score: number;     // 0-100 in upgraded BE
  average_stress: number;
  average_fatigue: number;
  high_risk_count: number;
  behavioral_strain_avg?: number | null;
  meeting_load_avg?: number | null;
  top_risk_drivers?: string[];
  employees: TeamEmployee[];
  trend: TrendPoint[];
}

export interface ManagerRecommendation {
  summary: string;
  actions: string[];
  reasons?: string[];               // upgraded: grounded drivers
}

export type InterventionType =
  | "reduce_meetings"
  | "redistribute_workload"
  | "add_recovery_time"
  | "reduce_task_pressure";

export interface SimulationRequest {
  intervention_type: InterventionType;
  intensity: number;
}

export interface SimulationImpact {
  team_score_before: number;
  team_score_after: number;
  high_risk_count_before: number;
  high_risk_count_after: number;
}

export interface SimulationResponse {
  intervention_type: string;
  estimated_impact: SimulationImpact;
}

// ─── API errors ─────────────────────────────────────────────────────────────

export interface ApiError {
  code: "INVALID_INPUT" | "NOT_FOUND" | "UNAUTHORIZED" | "INTERNAL_ERROR";
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

// ─── Generic async state ────────────────────────────────────────────────────

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
