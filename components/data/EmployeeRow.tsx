import type { TeamEmployee } from "@/types/index";
import Badge from "@/components/ui/Badge";

interface EmployeeRowProps {
  employee: TeamEmployee;
  isSelected?: boolean;
  onSelect?: (employee: TeamEmployee) => void;
}

function renderMetric(value?: number | null) {
  if (value == null) return <span className="text-text-secondary">-</span>;
  return <span className="font-semibold text-text-primary">{value.toFixed(0)}</span>;
}

function getTrendLabel(score?: number | null) {
  if (score == null) return { label: "Unknown", className: "text-text-secondary" };
  if (score >= 75) return { label: "Rising", className: "text-risk-high-text" };
  if (score >= 50) return { label: "Watch", className: "text-risk-medium-text" };
  return { label: "Stable", className: "text-risk-low-text" };
}

function getStatusLabel(score?: number | null) {
  if (score == null) return "Unknown";
  if (score >= 75) return "Action needed";
  if (score >= 50) return "Monitor";
  return "Healthy";
}

export default function EmployeeRow({ employee, isSelected = false, onSelect }: EmployeeRowProps) {
  const trend = getTrendLabel(employee.score);
  const status = getStatusLabel(employee.score);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(employee)}
      className={[
        "grid w-full text-left grid-cols-[1.4fr,0.6fr,0.6fr,0.6fr,0.7fr,0.7fr,0.8fr,0.9fr] gap-2 items-center p-4 border-b border-border last:border-0 transition-colors text-sm",
        isSelected
          ? "bg-brand-subtle border-l-4 border-l-[#2f8876]"
          : "bg-background-primary hover:bg-[var(--colors-background-secondary)]",
      ].join(" ")}
    >
      <div className="font-medium text-text-primary truncate">{employee.name}</div>
      <div className="font-semibold text-text-primary">
        {employee.score != null ? `${employee.score.toFixed(0)}` : employee.latest_score?.toFixed(1) || "-"}
      </div>
      <div>{renderMetric(employee.stress)}</div>
      <div>{renderMetric(employee.fatigue)}</div>
      <div>{renderMetric(employee.behavior_score)}</div>
      <div>{renderMetric(employee.meeting_score)}</div>
      <div className={`text-xs font-semibold uppercase ${trend.className}`}>{trend.label}</div>
      <div className="flex flex-col items-start gap-1">
        <span className="text-xs text-text-secondary">{status}</span>
        <Badge level={employee.risk_level as "low" | "medium" | "high"} />
      </div>
    </button>
  );
}
