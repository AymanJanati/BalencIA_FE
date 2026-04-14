// types/index.ts — re-export from types.ts (shared with backend)

export type UserRole = "employee" | "manager";

export type RiskLevel = "low" | "medium" | "high";

export type MoodValue = 1 | 2 | 3 | 4 | 5;
export type ScaleValue = 1 | 2 | 3 | 4 | 5;

/**
 * Common user profile
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team_id?: string;
}

/**
 * Employee daily check-in request
 */
export interface CheckinPayload {
  user_id: string;
  mood: MoodValue;
  stress: ScaleValue;
  fatigue: ScaleValue;
  workload: ScaleValue;
  note?: string;
}

/**
 * Stored / returned check-in object
 */
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

/**
 * Burnout scoring output
 */
export interface BurnoutScore {
  score: number;
  risk_level: RiskLevel;
}

/**
 * Employee-facing AI support response
 */
export interface AISupport {
  message: string;
  actions: string[];
}

/**
 * Check-in API response
 */
export interface CheckinResponse {
  success: boolean;
  checkin_id: string;
  burnout_score: BurnoutScore;
  ai_support: AISupport;
}

/**
 * Trend point for charts
 */
export interface TrendPoint {
  date: string;
  score?: number;
  stress?: number;
  fatigue?: number;
  workload?: number;
  wellbeing_score?: number;
}

/**
 * Employee dashboard response
 */
export interface EmployeeDashboard {
  user: UserProfile;
  latest_checkin: DailyCheckin | null;
  latest_score: BurnoutScore | null;
  ai_support: AISupport | null;
  trend: TrendPoint[];
  checkin_history?: DailyCheckin[];
}

/**
 * Manager-side employee row
 */
export interface TeamEmployee {
  id: string;
  name: string;
  role?: UserRole;
  latest_score: number;
  risk_level: RiskLevel;
  latest_checkin_at?: string;
}

/**
 * Team summary response
 */
export interface ManagerSummary {
  team_id: string;
  team_name: string;
  team_wellbeing_score: number;
  average_stress: number;
  average_fatigue: number;
  high_risk_count: number;
  employees: TeamEmployee[];
  trend: TrendPoint[];
}

/**
 * Manager-facing AI recommendations
 */
export interface ManagerRecommendation {
  summary: string;
  actions: string[];
}

/**
 * Shared API error shape
 */
export interface ApiError {
  code:
    | "INVALID_INPUT"
    | "NOT_FOUND"
    | "UNAUTHORIZED"
    | "INTERNAL_ERROR";
  message: string;
}

/**
 * Shared API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

/**
 * Generic async state for frontend components
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Auth UI helper types for hackathon mode
 */
export interface LoginFormValues {
  email: string;
  password?: string;
  role: UserRole;
}

/**
 * Simple seeded auth session shape
 */
export interface AuthSession {
  user: UserProfile;
  token?: string;
}
