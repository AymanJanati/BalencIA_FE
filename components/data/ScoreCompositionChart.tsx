"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RiskBreakdown } from "@/types";

interface ScoreCompositionChartProps {
  score: RiskBreakdown;
}

const BAR_COLORS = ["#2f8876", "#0ea5e9", "#2563eb", "#475569"];

export default function ScoreCompositionChart({ score }: ScoreCompositionChartProps) {
  const chartData = [
    { key: "Self-report", value: score.self_report_score },
    ...(score.behavior_score != null
      ? [{ key: "Behavior", value: score.behavior_score }]
      : []),
    ...(score.meeting_score != null
      ? [{ key: "Meetings", value: score.meeting_score }]
      : []),
    { key: "Trend", value: score.trend_score },
  ];

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 12, right: 20, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="key"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
            {chartData.map((entry, index) => (
              <Cell key={entry.key} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
            <LabelList dataKey="value" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
