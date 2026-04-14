"use client";

// components/data/EmployeeList.tsx — list of EmployeeRow components

import { useMemo } from "react";
import type { TeamEmployee } from "@/types";
import EmployeeRow from "./EmployeeRow";
import Card from "@/components/ui/Card";

interface EmployeeListProps {
  employees: TeamEmployee[];
}

export default function EmployeeList({ employees }: EmployeeListProps) {
  // Sort by risk (high -> medium -> low) memoized
  const sortedEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    const riskIndex = { high: 0, medium: 1, low: 2 };
    return [...employees].sort((a, b) => {
      return riskIndex[a.risk_level] - riskIndex[b.risk_level];
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
        {sortedEmployees.map((emp) => (
          <EmployeeRow key={emp.id} employee={emp} />
        ))}
      </div>
    </Card>
  );
}
