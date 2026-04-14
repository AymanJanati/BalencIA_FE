"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TeamEmployee } from "@/types";

interface RiskDistributionChartProps {
  employees: TeamEmployee[];
}

const COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

export default function RiskDistributionChart({ employees }: RiskDistributionChartProps) {
  const high = employees.filter((emp) => emp.risk_level === "high").length;
  const medium = employees.filter((emp) => emp.risk_level === "medium").length;
  const low = employees.filter((emp) => emp.risk_level === "low").length;

  const chartData = [
    { name: "High", value: high, color: COLORS.high },
    { name: "Medium", value: medium, color: COLORS.medium },
    { name: "Low", value: low, color: COLORS.low },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return <div className="h-[220px] flex items-center justify-center text-text-secondary">No distribution yet.</div>;
  }

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={86}
            dataKey="value"
            paddingAngle={3}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-2 mt-2">
        {chartData.map((item) => (
          <div key={item.name} className="rounded-lg border border-border bg-background-secondary px-3 py-2 text-center">
            <div className="text-xs font-semibold text-text-secondary uppercase">{item.name}</div>
            <div className="text-lg font-bold text-text-primary">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
