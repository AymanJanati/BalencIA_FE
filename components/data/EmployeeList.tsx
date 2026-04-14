"use client";

// components/data/EmployeeList.tsx — list of EmployeeRow components

import { useMemo } from "react";
import type { TeamEmployee } from "@/types";
import EmployeeRow from "./EmployeeRow";
import Card from "@/components/ui/Card";

interface EmployeeListProps {
  employees: TeamEmployee[];
  selectedEmployeeId?: string | null;
  onSelectEmployee?: (employee: TeamEmployee) => void;
}

export default function EmployeeList({
  employees,
  selectedEmployeeId = null,
  onSelectEmployee,
}: EmployeeListProps) {
  // Sort by risk (high -> medium -> low) memoized
  const sortedEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    const riskIndex = { high: 0, medium: 1, low: 2 };
    return [...employees].sort((a, b) => {
      const aRisk = riskIndex[a.risk_level as keyof typeof riskIndex] ?? 3;
      const bRisk = riskIndex[b.risk_level as keyof typeof riskIndex] ?? 3;
      return aRisk - bRisk;
    });
  }, [employees]);

  if (!employees || employees.length === 0) {
    return (
      <Card padding="md" className="flex items-center justify-center min-h-[120px]">
        <span className="text-body text-text-secondary">No employee data available.</span>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex flex-col border border-border rounded-card overflow-hidden">
        <div className="grid grid-cols-[1.4fr,0.6fr,0.6fr,0.6fr,0.7fr,0.7fr,0.8fr,0.9fr] gap-2 items-center px-4 py-3 bg-background-secondary text-xs uppercase tracking-wide text-text-secondary font-semibold border-b border-border">
          <span>Employee</span>
          <span>Score</span>
          <span>Stress</span>
          <span>Fatigue</span>
          <span>Behavior</span>
          <span>Meeting</span>
          <span>Trend</span>
          <span>Status</span>
        </div>
        {sortedEmployees.map((emp) => (
          <EmployeeRow
            key={emp.id}
            employee={emp}
            isSelected={selectedEmployeeId === emp.id}
            onSelect={onSelectEmployee}
          />
        ))}
      </div>
    </Card>
  );
}
