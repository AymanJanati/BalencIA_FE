"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/types";
import { formatCheckinDate } from "@/lib/constants";

interface TrendChartProps {
  data: TrendPoint[];
}

function safeNumber(value: number | undefined): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  return Number(value.toFixed(1));
}

export default function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full min-h-[200px] w-full items-center justify-center text-text-secondary">
        Not enough data to display trend
      </div>
    );
  }

  const chartData = data.map((point) => ({
    name: formatCheckinDate(point.date),
    score: safeNumber(point.score ?? point.team_score ?? point.wellbeing_score),
    stress: safeNumber(point.stress),
    fatigue: safeNumber(point.fatigue),
    workload: safeNumber(point.workload),
  }));

  const hasOperationalLines = chartData.some(
    (item) =>
      item.stress !== undefined || item.fatigue !== undefined || item.workload !== undefined
  );

  const hasScaleFiveValues = chartData.some(
    (item) =>
      (item.score ?? 0) <= 5 ||
      (item.stress ?? 0) <= 5 ||
      (item.fatigue ?? 0) <= 5 ||
      (item.workload ?? 0) <= 5
  );

  const yDomain = hasScaleFiveValues ? [1, 5] : [0, 100];
  const yTicks = hasScaleFiveValues ? [1, 2, 3, 4, 5] : [0, 20, 40, 60, 80, 100];
  const scoreLabel = hasScaleFiveValues ? "Wellbeing Index" : "Risk Score";

  return (
    <div className="h-[250px] w-full min-w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 12, right: 16, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            dy={8}
          />
          <YAxis
            domain={yDomain}
            ticks={yTicks}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickLine={false}
            axisLine={false}
            dx={-8}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              padding: "10px 14px",
              color: "#0F172A",
              fontWeight: 500,
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "12px", fontWeight: 500, color: "#6B7280" }}
          />

          <Line
            type="monotone"
            dataKey="score"
            name={scoreLabel}
            stroke="#2f8876"
            strokeWidth={3}
            dot={{ r: 4, fill: "#FFFFFF", stroke: "#2f8876", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#2f8876", stroke: "#FFFFFF", strokeWidth: 2 }}
          />

          {hasOperationalLines && (
            <Line
              type="monotone"
              dataKey="stress"
              name="Stress"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
          {hasOperationalLines && (
            <Line
              type="monotone"
              dataKey="fatigue"
              name="Fatigue"
              stroke="#EAB308"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
          {hasOperationalLines && (
            <Line
              type="monotone"
              dataKey="workload"
              name="Workload"
              stroke="#3B82F6"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
