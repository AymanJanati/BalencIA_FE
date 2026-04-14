"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { useManagerSummary } from "@/hooks/useManagerSummary";
import { ROUTES, DEFAULT_TEAM_ID } from "@/lib/constants";
import { simulateManagerIntervention } from "@/services/api";
import type { InterventionType, SimulationResponse, TeamEmployee } from "@/types";

import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import KPIBox from "@/components/data/KPIBox";
import EmployeeList from "@/components/data/EmployeeList";
import ManagerRecommendationBlock from "@/components/ai/ManagerRecommendationBlock";
import ManagerTabNav, { type ManagerTabKey } from "@/components/manager/ManagerTabNav";
import EmployeeDetailCard from "@/components/manager/EmployeeDetailCard";

import LoadingSkeleton from "@/components/states/LoadingSkeleton";
import ErrorState from "@/components/states/ErrorState";
import EmptyState from "@/components/states/EmptyState";

const TrendChart = dynamic(() => import("@/components/data/TrendChart"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-full w-full bg-border/40 rounded-xl" />,
});
const RiskDistributionChart = dynamic(() => import("@/components/data/RiskDistributionChart"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-full w-full bg-border/40 rounded-xl" />,
});
const InterventionSimulator = dynamic(() => import("@/components/ai/InterventionSimulator"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-[240px] w-full bg-border/40 rounded-xl" />,
});

const INTERVENTION_CATALOG: Array<{
  key: InterventionType;
  title: string;
  description: string;
  focus: string;
  defaultIntensity: number;
}> = [
  {
    key: "reduce_meetings",
    title: "Reduce meeting pressure",
    description: "Trim non-essential meetings and protect maker time for overloaded contributors.",
    focus: "Meeting load and fatigue",
    defaultIntensity: 0.4,
  },
  {
    key: "redistribute_workload",
    title: "Redistribute workload",
    description: "Move peak-load tasks away from high-risk employees and rebalance delivery ownership.",
    focus: "Stress and self-report pressure",
    defaultIntensity: 0.5,
  },
  {
    key: "add_recovery_time",
    title: "Add recovery block",
    description: "Reserve uninterrupted recovery windows to reduce sustained behavioral strain.",
    focus: "Behavioral strain and burnout prevention",
    defaultIntensity: 0.4,
  },
  {
    key: "reduce_task_pressure",
    title: "Reduce deadline pressure",
    description: "Stagger near-term deadlines and simplify in-flight work to lower immediate risk.",
    focus: "Workload concentration and fatigue",
    defaultIntensity: 0.6,
  },
];

export default function ManagerPage() {
  const { session, role } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ManagerTabKey>("overview");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const [simulation, setSimulation] = useState<SimulationResponse | null>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.replace(ROUTES.login);
    } else if (role !== "manager") {
      router.replace(ROUTES.dashboard);
    }
  }, [session, role, router]);

  const teamId = session?.user?.team_id || DEFAULT_TEAM_ID;
  const { data, loading, error } = useManagerSummary(role === "manager" ? teamId : null);

  const summary = data?.summary;
  const recommendations = data?.recommendations;

  const filteredEmployees = useMemo(() => {
    if (!summary) return [];
    return summary.employees.filter((employee) => {
      const matchesSearch = employee.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesRisk = riskFilter === "all" ? true : employee.risk_level === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [summary, query, riskFilter]);

  useEffect(() => {
    if (!filteredEmployees.length) {
      setSelectedEmployeeId(null);
      return;
    }
    if (!selectedEmployeeId || !filteredEmployees.some((item) => item.id === selectedEmployeeId)) {
      setSelectedEmployeeId(filteredEmployees[0].id);
    }
  }, [filteredEmployees, selectedEmployeeId]);

  const selectedEmployee = useMemo(() => {
    if (!summary || !selectedEmployeeId) return null;
    return summary.employees.find((employee) => employee.id === selectedEmployeeId) ?? null;
  }, [summary, selectedEmployeeId]);

  const anomalyAlerts = useMemo(() => {
    if (!summary) return [];
    const alerts: string[] = [];
    const trend = summary.trend ?? [];
    const trendDelta = trend.length > 1 ? (trend[trend.length - 1].team_score ?? 0) - (trend[0].team_score ?? 0) : 0;

    if (summary.high_risk_count >= 2) alerts.push("Multiple employees remain in high-risk status.");
    if ((summary.meeting_load_avg ?? 0) >= 60) alerts.push("Meeting overload remains above operational threshold.");
    if ((summary.behavioral_strain_avg ?? 0) >= 65) alerts.push("Behavioral strain is elevated across the team.");
    if (trendDelta >= 6) alerts.push("Team risk trend has worsened significantly in recent days.");
    if (summary.average_fatigue >= 3.5) alerts.push("Fatigue is persistently high and requires short-term mitigation.");

    return alerts.length ? alerts : ["No critical anomalies detected. Maintain current monitoring cadence."];
  }, [summary]);

  const topRiskDrivers = useMemo(() => {
    if (!summary) return [];
    if (summary.top_risk_drivers && summary.top_risk_drivers.length > 0) {
      return summary.top_risk_drivers;
    }

    const rankedCandidates: Array<{ label: string; value: number }> = [
      { label: "Meeting pressure is elevated this cycle.", value: summary.meeting_load_avg ?? 0 },
      { label: "Behavioral strain is trending above baseline.", value: summary.behavioral_strain_avg ?? 0 },
      { label: "Stress remains high across active team members.", value: (summary.average_stress / 5) * 100 },
      { label: "Fatigue trend suggests recovery capacity is low.", value: (summary.average_fatigue / 5) * 100 },
      {
        label: "High-risk concentration requires targeted intervention.",
        value: summary.employees.length > 0 ? (summary.high_risk_count / summary.employees.length) * 100 : 0,
      },
    ];

    return rankedCandidates
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map((item) => item.label);
  }, [summary]);

  const driverIntensity = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Stress", value: Math.min(100, Math.max(0, (summary.average_stress / 5) * 100)) },
      { label: "Fatigue", value: Math.min(100, Math.max(0, (summary.average_fatigue / 5) * 100)) },
      { label: "Behavior", value: Math.min(100, Math.max(0, summary.behavioral_strain_avg ?? 0)) },
      { label: "Meetings", value: Math.min(100, Math.max(0, summary.meeting_load_avg ?? 0)) },
    ];
  }, [summary]);

  async function runSimulation(interventionType: InterventionType, intensity: number) {
    setSimulationError(null);
    setSimulationLoading(true);
    try {
      const result = await simulateManagerIntervention(teamId, interventionType, intensity, session?.token);
      setSimulation(result);
      setActiveTab("interventions");
    } catch (err) {
      setSimulationError(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setSimulationLoading(false);
    }
  }

  if (!session || role !== "manager") return null;

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-6 w-full max-w-6xl mx-auto opacity-70">
        <div className="h-10 w-1/3 bg-border rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-background-primary border border-border rounded-card flex items-center justify-center">
              <LoadingSkeleton />
            </div>
          ))}
        </div>
        <div className="h-96 bg-background-primary border border-border rounded-card flex items-center justify-center">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-risk-high-bg text-risk-high-text rounded-card border border-red-200">
        <h3 className="font-semibold text-lg mb-2">Notice</h3>
        <ErrorState message={error} />
      </div>
    );
  }

  if (!summary || !recommendations) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-2xl mx-auto bg-background-primary rounded-card border border-border shadow-sm">
        <h2 className="text-section-title text-text-primary mb-3">No Team Data</h2>
        <div className="text-body text-text-secondary">
          <EmptyState message="There is currently no data available for your team. Check back later when employees have completed their check-ins." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <PageHeader
        title="Manager Control Panel"
        subtitle={`AI-powered workforce intelligence for ${summary.team_name}`}
      />

      <ManagerTabNav activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="flex flex-col gap-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
            <KPIBox label="Team Risk Score" value={`${summary.team_wellbeing_score.toFixed(1)}/100`} />
            <KPIBox label="High-Risk Count" value={summary.high_risk_count.toString()} alert={summary.high_risk_count > 0} />
            <KPIBox label="Average Stress" value={summary.average_stress.toFixed(1)} />
            <KPIBox label="Average Fatigue" value={summary.average_fatigue.toFixed(1)} />
            <KPIBox label="Meeting Load Avg" value={summary.meeting_load_avg != null ? summary.meeting_load_avg.toFixed(1) : "N/A"} />
            <KPIBox label="Behavioral Strain Avg" value={summary.behavioral_strain_avg != null ? summary.behavioral_strain_avg.toFixed(1) : "N/A"} />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card padding="lg" className="xl:col-span-2">
              <h3 className="text-card-title text-text-primary mb-2">Team Risk Trend</h3>
              <p className="text-caption text-text-secondary mb-3">Daily team-level trajectory from the backend summary feed.</p>
              <TrendChart data={summary.trend} />
            </Card>
            <Card padding="lg">
              <h3 className="text-card-title text-text-primary mb-2">Risk Distribution</h3>
              <p className="text-caption text-text-secondary mb-3">Current spread of low, medium and high-risk employees.</p>
              <RiskDistributionChart employees={summary.employees} />
            </Card>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card padding="lg" className="flex flex-col gap-3">
              <h3 className="text-card-title text-text-primary">Top Risk Drivers</h3>
              {topRiskDrivers.length > 0 ? (
                topRiskDrivers.map((driver, index) => (
                  <div key={`${driver}-${index}`} className="rounded-lg border border-border bg-background-secondary p-3 text-sm text-text-primary">
                    <span className="font-semibold text-text-secondary mr-2">{index + 1}.</span>
                    {driver}
                  </div>
                ))
              ) : (
                <p className="text-body text-text-secondary">No top drivers available.</p>
              )}
              <div className="mt-2 pt-3 border-t border-border/70 flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Driver intensity</p>
                {driverIntensity.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-16 text-xs font-medium text-text-secondary">{item.label}</div>
                    <div className="flex-1 h-2.5 rounded-full bg-background-secondary overflow-hidden border border-border/60">
                      <div
                        className="h-full bg-brand"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-xs font-semibold text-text-primary">{Math.round(item.value)}</div>
                  </div>
                ))}
              </div>
            </Card>
            <ManagerRecommendationBlock
              summary={recommendations.summary}
              actions={recommendations.actions}
              reasons={recommendations.reasons}
            />
          </section>
        </div>
      )}

      {activeTab === "employees" && (
        <div className="flex flex-col gap-6">
          <Card padding="lg" className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-end gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Search employee</label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name"
                  className="mt-1 w-full rounded-input border border-border px-3 py-2 text-sm bg-background-primary"
                />
              </div>
              <div className="w-full md:w-56">
                <label className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Risk filter</label>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as "all" | "high" | "medium" | "low")}
                  className="mt-1 w-full rounded-input border border-border px-3 py-2 text-sm bg-background-primary"
                >
                  <option value="all">All risk levels</option>
                  <option value="high">High risk</option>
                  <option value="medium">Medium risk</option>
                  <option value="low">Low risk</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <EmployeeList
                employees={filteredEmployees}
                selectedEmployeeId={selectedEmployeeId}
                onSelectEmployee={(employee: TeamEmployee) => setSelectedEmployeeId(employee.id)}
              />
            </div>
          </Card>

          <EmployeeDetailCard employee={selectedEmployee} recommendation={recommendations} />
        </div>
      )}

      {activeTab === "insights" && (
        <div className="flex flex-col gap-6">
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-text-primary">Fatigue trend</h3>
              <p className="text-caption text-text-secondary mt-1">Current average</p>
              <p className="text-2xl font-bold text-text-primary mt-2">{summary.average_fatigue.toFixed(1)} / 5</p>
              <div className="mt-3 h-2 rounded-full bg-background-secondary">
                <div className="h-full rounded-full bg-[#f59e0b]" style={{ width: `${Math.min(100, (summary.average_fatigue / 5) * 100)}%` }} />
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-sm font-semibold text-text-primary">Meeting overload</h3>
              <p className="text-caption text-text-secondary mt-1">Current average</p>
              <p className="text-2xl font-bold text-text-primary mt-2">
                {summary.meeting_load_avg != null ? summary.meeting_load_avg.toFixed(1) : "N/A"}
              </p>
              <div className="mt-3 h-2 rounded-full bg-background-secondary">
                <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${Math.min(100, summary.meeting_load_avg ?? 0)}%` }} />
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-sm font-semibold text-text-primary">Behavioral strain</h3>
              <p className="text-caption text-text-secondary mt-1">Current average</p>
              <p className="text-2xl font-bold text-text-primary mt-2">
                {summary.behavioral_strain_avg != null ? summary.behavioral_strain_avg.toFixed(1) : "N/A"}
              </p>
              <div className="mt-3 h-2 rounded-full bg-background-secondary">
                <div className="h-full rounded-full bg-[#2f8876]" style={{ width: `${Math.min(100, summary.behavioral_strain_avg ?? 0)}%` }} />
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-sm font-semibold text-text-primary">Repeated risk pattern</h3>
              <p className="text-caption text-text-secondary mt-1">Detection</p>
              <p className="text-2xl font-bold text-text-primary mt-2">{summary.high_risk_count > 0 ? "Active" : "Low"}</p>
              <p className="text-xs text-text-secondary mt-3">
                {summary.high_risk_count > 0
                  ? "High-risk state is recurring for one or more employees."
                  : "No repeated high-risk cycle detected currently."}
              </p>
            </Card>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card padding="lg" className="flex flex-col gap-3">
              <h3 className="text-card-title text-text-primary">Anomaly Alerts</h3>
              {anomalyAlerts.map((alert, index) => (
                <div key={`${alert}-${index}`} className="rounded-lg border border-border bg-background-secondary p-3 text-sm text-text-primary">
                  {alert}
                </div>
              ))}
            </Card>

            <Card padding="lg" className="flex flex-col gap-3">
              <h3 className="text-card-title text-text-primary">Explainability Drivers</h3>
              {(recommendations.reasons ?? []).length > 0 ? (
                (recommendations.reasons ?? []).map((reason, index) => (
                  <div key={`${reason}-${index}`} className="rounded-lg border border-border bg-background-secondary p-3 text-sm text-text-primary">
                    {reason}
                  </div>
                ))
              ) : (
                <p className="text-body text-text-secondary">No explanation drivers available yet.</p>
              )}
            </Card>
          </section>
        </div>
      )}

      {activeTab === "interventions" && (
        <div className="flex flex-col gap-6">
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {INTERVENTION_CATALOG.map((item) => {
              const estimatedScoreAfter = Math.max(0, summary.team_wellbeing_score - summary.team_wellbeing_score * item.defaultIntensity * 0.08);
              const estimatedHighRiskAfter = Math.max(0, summary.high_risk_count - (item.defaultIntensity >= 0.5 && summary.high_risk_count > 0 ? 1 : 0));
              return (
                <Card key={item.key} padding="lg" className="flex flex-col gap-3">
                  <h3 className="text-card-title text-text-primary">{item.title}</h3>
                  <p className="text-body text-text-secondary">{item.description}</p>
                  <p className="text-caption text-text-secondary">Focus: {item.focus}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border border-border p-2 bg-background-secondary text-sm">
                      <div className="text-xs text-text-secondary">Before/After score</div>
                      <div className="font-semibold text-text-primary">
                        {summary.team_wellbeing_score.toFixed(1)} {"->"} {estimatedScoreAfter.toFixed(1)}
                      </div>
                    </div>
                    <div className="rounded-md border border-border p-2 bg-background-secondary text-sm">
                      <div className="text-xs text-text-secondary">Before/After high risk</div>
                      <div className="font-semibold text-text-primary">
                        {summary.high_risk_count} {"->"} {estimatedHighRiskAfter}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => void runSimulation(item.key, item.defaultIntensity)}>
                    Simulate This Intervention
                  </Button>
                </Card>
              );
            })}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <InterventionSimulator
              simulation={simulation}
              isLoading={simulationLoading}
              error={simulationError}
              onSimulate={runSimulation}
            />
            <ManagerRecommendationBlock
              summary={recommendations.summary}
              actions={recommendations.actions}
              reasons={recommendations.reasons}
            />
          </section>
        </div>
      )}
    </div>
  );
}
