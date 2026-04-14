// mock-data.ts — BalencIA

import type {
  AISupport,
  AuthSession,
  BurnoutScore,
  CheckinResponse,
  DailyCheckin,
  EmployeeDashboard,
  LoginFormValues,
  ManagerRecommendation,
  ManagerSummary,
  RiskBreakdown,
  TeamEmployee,
  TrendPoint,
  UserProfile,
} from "@/types";

export const mockUsers: UserProfile[] = [
  {
    id: "mgr_001",
    name: "Sarah Benali",
    email: "sarah@balencia-demo.com",
    role: "manager",
    team_id: "team_001",
  },
  {
    id: "emp_001",
    name: "Youssef Ait",
    email: "youssef@balencia-demo.com",
    role: "employee",
    team_id: "team_001",
  },
  {
    id: "emp_002",
    name: "Lina Amrani",
    email: "lina@balencia-demo.com",
    role: "employee",
    team_id: "team_001",
  },
  {
    id: "emp_003",
    name: "Omar Idrissi",
    email: "omar@balencia-demo.com",
    role: "employee",
    team_id: "team_001",
  },
];

export const mockSessions: Record<string, AuthSession> = {
  manager: {
    user: mockUsers[0],
    token: "demo-manager-token",
  },
  employee_youssef: {
    user: mockUsers[1],
    token: "demo-employee-youssef-token",
  },
  employee_lina: {
    user: mockUsers[2],
    token: "demo-employee-lina-token",
  },
  employee_omar: {
    user: mockUsers[3],
    token: "demo-employee-omar-token",
  },
};

export const mockLoginDefaults: LoginFormValues = {
  email: "youssef@balencia-demo.com",
  password: "demo",
};

export const mockCheckinsByUser: Record<string, DailyCheckin[]> = {
  emp_001: [
    {
      id: "chk_001_1",
      user_id: "emp_001",
      mood: 3,
      stress: 4,
      fatigue: 4,
      workload: 5,
      note: "Many meetings and task switching today.",
      created_at: "2026-04-09T09:00:00Z",
    },
    {
      id: "chk_001_2",
      user_id: "emp_001",
      mood: 2,
      stress: 5,
      fatigue: 4,
      workload: 5,
      note: "Feeling overloaded this morning.",
      created_at: "2026-04-10T09:00:00Z",
    },
    {
      id: "chk_001_3",
      user_id: "emp_001",
      mood: 2,
      stress: 5,
      fatigue: 5,
      workload: 4,
      note: "Hard to recover from the last few days.",
      created_at: "2026-04-11T09:00:00Z",
    },
    {
      id: "chk_001_4",
      user_id: "emp_001",
      mood: 2,
      stress: 5,
      fatigue: 5,
      workload: 5,
      note: "Still too much pressure.",
      created_at: "2026-04-12T09:00:00Z",
    },
    {
      id: "chk_001_5",
      user_id: "emp_001",
      mood: 1,
      stress: 5,
      fatigue: 5,
      workload: 5,
      note: "I need a lighter day.",
      created_at: "2026-04-13T09:00:00Z",
    },
  ],
  emp_002: [
    {
      id: "chk_002_1",
      user_id: "emp_002",
      mood: 4,
      stress: 3,
      fatigue: 2,
      workload: 3,
      note: "Busy but manageable.",
      created_at: "2026-04-09T09:00:00Z",
    },
    {
      id: "chk_002_2",
      user_id: "emp_002",
      mood: 4,
      stress: 3,
      fatigue: 3,
      workload: 3,
      note: "Good day overall.",
      created_at: "2026-04-10T09:00:00Z",
    },
    {
      id: "chk_002_3",
      user_id: "emp_002",
      mood: 3,
      stress: 3,
      fatigue: 3,
      workload: 4,
      note: "Slightly heavier workload.",
      created_at: "2026-04-11T09:00:00Z",
    },
    {
      id: "chk_002_4",
      user_id: "emp_002",
      mood: 3,
      stress: 4,
      fatigue: 3,
      workload: 4,
      note: "Some pressure before deadlines.",
      created_at: "2026-04-12T09:00:00Z",
    },
    {
      id: "chk_002_5",
      user_id: "emp_002",
      mood: 3,
      stress: 4,
      fatigue: 3,
      workload: 4,
      note: "Still okay, but getting tired.",
      created_at: "2026-04-13T09:00:00Z",
    },
  ],
  emp_003: [
    {
      id: "chk_003_1",
      user_id: "emp_003",
      mood: 5,
      stress: 2,
      fatigue: 2,
      workload: 2,
      note: "Focused and calm.",
      created_at: "2026-04-09T09:00:00Z",
    },
    {
      id: "chk_003_2",
      user_id: "emp_003",
      mood: 4,
      stress: 2,
      fatigue: 2,
      workload: 2,
      note: "Stable day.",
      created_at: "2026-04-10T09:00:00Z",
    },
    {
      id: "chk_003_3",
      user_id: "emp_003",
      mood: 4,
      stress: 2,
      fatigue: 2,
      workload: 3,
      note: "Normal workload.",
      created_at: "2026-04-11T09:00:00Z",
    },
    {
      id: "chk_003_4",
      user_id: "emp_003",
      mood: 4,
      stress: 2,
      fatigue: 2,
      workload: 2,
      note: "Balanced day.",
      created_at: "2026-04-12T09:00:00Z",
    },
    {
      id: "chk_003_5",
      user_id: "emp_003",
      mood: 5,
      stress: 2,
      fatigue: 1,
      workload: 2,
      note: "Feeling good.",
      created_at: "2026-04-13T09:00:00Z",
    },
  ],
};

export const mockScoresByUser: Record<string, RiskBreakdown[]> = {
  emp_001: [
    { self_report_score: 80, trend_score: 80, global_score: 80, risk_level: "high" },
    { self_report_score: 83, trend_score: 85, global_score: 85, risk_level: "high" },
    { self_report_score: 88, trend_score: 90, global_score: 90, risk_level: "high" },
    { self_report_score: 91, trend_score: 92, global_score: 93, risk_level: "high" },
    { self_report_score: 95, trend_score: 95, global_score: 96, risk_level: "high" },
  ],
  emp_002: [
    { self_report_score: 55, trend_score: 50, global_score: 52, risk_level: "medium" },
    { self_report_score: 58, trend_score: 55, global_score: 56, risk_level: "medium" },
    { self_report_score: 60, trend_score: 62, global_score: 61, risk_level: "medium" },
    { self_report_score: 65, trend_score: 68, global_score: 66, risk_level: "medium" },
    { self_report_score: 68, trend_score: 70, global_score: 69, risk_level: "medium" },
  ],
  emp_003: [
    { self_report_score: 25, trend_score: 20, global_score: 22, risk_level: "low" },
    { self_report_score: 28, trend_score: 25, global_score: 26, risk_level: "low" },
    { self_report_score: 30, trend_score: 32, global_score: 31, risk_level: "low" },
    { self_report_score: 25, trend_score: 28, global_score: 27, risk_level: "low" },
    { self_report_score: 20, trend_score: 25, global_score: 22, risk_level: "low" },
  ],
};

export const mockAiSupportByUser: Record<string, AISupport> = {
  emp_001: {
    message:
      "You are showing signs of sustained overload this week. Try to protect your energy and reduce non-essential pressure today.",
    actions: [
      "Take a short recovery break between tasks",
      "Delay one non-urgent task",
      "Avoid unnecessary meetings today",
    ],
  },
  emp_002: {
    message:
      "Your stress is manageable, but your workload trend is rising. A small adjustment now can help you stay balanced.",
    actions: [
      "Block one focus session today",
      "Reduce context switching where possible",
      "Review tomorrow's priorities early",
    ],
  },
  emp_003: {
    message:
      "Your current pattern looks balanced and stable. Keep protecting the habits that help you stay focused.",
    actions: [
      "Maintain your current work rhythm",
      "Keep a short break around midday",
      "Preserve your focus windows",
    ],
  },
};

export const mockEmployeeTrends: Record<string, TrendPoint[]> = {
  emp_001: [
    { date: "2026-04-09", wellbeing_score: 4.0, stress: 4, fatigue: 4, workload: 5 },
    { date: "2026-04-10", wellbeing_score: 4.3, stress: 5, fatigue: 4, workload: 5 },
    { date: "2026-04-11", wellbeing_score: 4.55, stress: 5, fatigue: 5, workload: 4 },
    { date: "2026-04-12", wellbeing_score: 4.7, stress: 5, fatigue: 5, workload: 5 },
    { date: "2026-04-13", wellbeing_score: 4.85, stress: 5, fatigue: 5, workload: 5 },
  ],
  emp_002: [
    { date: "2026-04-09", wellbeing_score: 2.8, stress: 3, fatigue: 2, workload: 3 },
    { date: "2026-04-10", wellbeing_score: 2.9, stress: 3, fatigue: 3, workload: 3 },
    { date: "2026-04-11", wellbeing_score: 3.1, stress: 3, fatigue: 3, workload: 4 },
    { date: "2026-04-12", wellbeing_score: 3.4, stress: 4, fatigue: 3, workload: 4 },
    { date: "2026-04-13", wellbeing_score: 3.45, stress: 4, fatigue: 3, workload: 4 },
  ],
  emp_003: [
    { date: "2026-04-09", wellbeing_score: 1.8, stress: 2, fatigue: 2, workload: 2 },
    { date: "2026-04-10", wellbeing_score: 1.85, stress: 2, fatigue: 2, workload: 2 },
    { date: "2026-04-11", wellbeing_score: 2.0, stress: 2, fatigue: 2, workload: 3 },
    { date: "2026-04-12", wellbeing_score: 1.9, stress: 2, fatigue: 2, workload: 2 },
    { date: "2026-04-13", wellbeing_score: 1.7, stress: 2, fatigue: 1, workload: 2 },
  ],
};

export const mockEmployeeDashboards: Record<string, EmployeeDashboard> = {
  emp_001: {
    user: mockUsers[1],
    latest_checkin: mockCheckinsByUser.emp_001[4],
    latest_score: mockScoresByUser.emp_001[4],
    ai_support: mockAiSupportByUser.emp_001,
    trend: mockEmployeeTrends.emp_001,
    checkin_history: [...mockCheckinsByUser.emp_001].reverse(),
  },
  emp_002: {
    user: mockUsers[2],
    latest_checkin: mockCheckinsByUser.emp_002[4],
    latest_score: mockScoresByUser.emp_002[4],
    ai_support: mockAiSupportByUser.emp_002,
    trend: mockEmployeeTrends.emp_002,
    checkin_history: [...mockCheckinsByUser.emp_002].reverse(),
  },
  emp_003: {
    user: mockUsers[3],
    latest_checkin: mockCheckinsByUser.emp_003[4],
    latest_score: mockScoresByUser.emp_003[4],
    ai_support: mockAiSupportByUser.emp_003,
    trend: mockEmployeeTrends.emp_003,
    checkin_history: [...mockCheckinsByUser.emp_003].reverse(),
  },
};

export const mockTeamEmployees: TeamEmployee[] = [
  {
    id: "emp_001",
    name: "Youssef Ait",
    latest_score: 4.85,
    risk_level: "high",
    latest_checkin_at: "2026-04-13T09:00:00Z",
  },
  {
    id: "emp_002",
    name: "Lina Amrani",
    latest_score: 3.45,
    risk_level: "medium",
    latest_checkin_at: "2026-04-13T09:00:00Z",
  },
  {
    id: "emp_003",
    name: "Omar Idrissi",
    latest_score: 1.7,
    risk_level: "low",
    latest_checkin_at: "2026-04-13T09:00:00Z",
  },
];

export const mockManagerSummary: ManagerSummary = {
  team_id: "team_001",
  team_name: "Product Team Alpha",
  team_wellbeing_score: 3.33,
  average_stress: 3.67,
  average_fatigue: 3.0,
  high_risk_count: 1,
  employees: mockTeamEmployees,
  trend: [
    { date: "2026-04-09", wellbeing_score: 2.87, stress: 3.0, fatigue: 2.67, workload: 3.33 },
    { date: "2026-04-10", wellbeing_score: 3.02, stress: 3.33, fatigue: 3.0, workload: 3.33 },
    { date: "2026-04-11", wellbeing_score: 3.22, stress: 3.33, fatigue: 3.33, workload: 3.67 },
    { date: "2026-04-12", wellbeing_score: 3.33, stress: 3.67, fatigue: 3.33, workload: 3.67 },
    { date: "2026-04-13", wellbeing_score: 3.33, stress: 3.67, fatigue: 3.0, workload: 3.67 },
  ],
};

export const mockManagerRecommendations: ManagerRecommendation = {
  summary:
    "One employee shows sustained high burnout risk and the team workload trend is increasing. A lighter coordination pattern may reduce pressure quickly.",
  actions: [
    "Redistribute one high-pressure task away from the highest-risk employee",
    "Reduce non-essential meetings for the next 48 hours",
    "Encourage short recovery breaks after intensive work blocks",
  ],
};

export const mockLatestCheckinResponse: CheckinResponse = {
  success: true,
  checkin_id: "chk_demo_001",
  risk_breakdown: {
    self_report_score: 82,
    trend_score: 85,
    global_score: 84,
    risk_level: "high",
  },
  ai_support: {
    message:
      "You are showing signs of overload today. Try to protect your energy and reduce non-essential pressure.",
    actions: [
      "Take a short break",
      "Delay one non-urgent task",
      "Avoid unnecessary meetings today",
    ],
    reasons: [
      "Your reported stress is peaking",
      "Your fatigue has worsened since yesterday"
    ]
  },
};

/**
 * Helpers
 */

export function getMockUserById(userId: string): UserProfile | undefined {
  return mockUsers.find((user) => user.id === userId);
}

export function getMockEmployeeDashboard(userId: string): EmployeeDashboard | null {
  return mockEmployeeDashboards[userId] ?? null;
}

export function getMockCheckins(userId: string): DailyCheckin[] {
  return mockCheckinsByUser[userId] ?? [];
}

export function getMockManagerSummary(teamId: string): ManagerSummary | null {
  if (teamId !== "team_001") return null;
  return mockManagerSummary;
}

export function getMockManagerRecommendations(teamId: string): ManagerRecommendation | null {
  if (teamId !== "team_001") return null;
  return mockManagerRecommendations;
}

export function getMockSessionByRole(role: "employee" | "manager"): AuthSession {
  return role === "manager" ? mockSessions.manager : mockSessions.employee_youssef;
}

export function getMockSessionByEmail(email: string): AuthSession | null {
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  return {
    user,
    token: `demo-token-${user.id}`,
  };
}

