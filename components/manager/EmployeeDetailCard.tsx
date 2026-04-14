"use client";

import type { ManagerRecommendation, TeamEmployee } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface EmployeeDetailCardProps {
  employee: TeamEmployee | null;
  recommendation: ManagerRecommendation;
}

function scoreLabel(score?: number | null) {
  if (score == null) return "N/A";
  return `${score.toFixed(0)}/100`;
}

export default function EmployeeDetailCard({ employee, recommendation }: EmployeeDetailCardProps) {
  if (!employee) {
    return (
      <Card padding="lg" className="min-h-[260px] flex items-center justify-center">
        <p className="text-body text-text-secondary">Select an employee to inspect detail and action guidance.</p>
      </Card>
    );
  }

  const selectedActions = recommendation.actions.slice(0, 2);
  const reasons = recommendation.reasons?.slice(0, 2) ?? [];

  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-card-title text-text-primary">{employee.name}</h3>
          <p className="text-caption text-text-secondary">Employee-level operational summary</p>
        </div>
        <Badge level={employee.risk_level as "low" | "medium" | "high"} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-background-secondary p-3">
          <div className="text-xs uppercase font-semibold text-text-secondary">Global score</div>
          <div className="text-xl font-bold text-text-primary">{scoreLabel(employee.score)}</div>
        </div>
        <div className="rounded-lg border border-border bg-background-secondary p-3">
          <div className="text-xs uppercase font-semibold text-text-secondary">Behavior / Meeting</div>
          <div className="text-xl font-bold text-text-primary">
            {(employee.behavior_score ?? 0).toFixed(0)} / {(employee.meeting_score ?? 0).toFixed(0)}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background-secondary p-3">
          <div className="text-xs uppercase font-semibold text-text-secondary">Stress</div>
          <div className="text-xl font-bold text-text-primary">{employee.stress ?? "-"}</div>
        </div>
        <div className="rounded-lg border border-border bg-background-secondary p-3">
          <div className="text-xs uppercase font-semibold text-text-secondary">Fatigue</div>
          <div className="text-xl font-bold text-text-primary">{employee.fatigue ?? "-"}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-text-primary">Suggested Manager Actions</h4>
        {selectedActions.length > 0 ? (
          selectedActions.map((action, index) => (
            <div key={`${action}-${index}`} className="rounded-lg border border-border p-3 text-sm text-text-primary">
              {action}
            </div>
          ))
        ) : (
          <p className="text-caption text-text-secondary">No actions available.</p>
        )}
      </div>

      {reasons.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-text-primary">Why this profile is flagged</h4>
          {reasons.map((reason, index) => (
            <div key={`${reason}-${index}`} className="text-xs text-text-secondary bg-background-secondary rounded-md px-3 py-2 border border-border">
              {reason}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
