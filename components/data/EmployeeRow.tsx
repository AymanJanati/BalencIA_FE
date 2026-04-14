// components/data/EmployeeRow.tsx — single employee row with badge + score

import type { TeamEmployee } from "@/types/index";
import Badge from "@/components/ui/Badge";

interface EmployeeRowProps {
  employee: TeamEmployee;
}

export default function EmployeeRow({ employee }: EmployeeRowProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border last:border-0 bg-background-primary hover:bg-[var(--colors-background-secondary)] transition-colors">
      <div className="flex items-center gap-3">
        <span className="font-medium text-text-primary text-body">{employee.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-body font-semibold text-text-secondary">
          {employee.latest_score.toFixed(1)}
        </span>
        <Badge level={employee.risk_level} />
      </div>
    </div>
  );
}
