"use client";

// components/data/TrendChart.tsx — recharts line chart for wellbeing trends

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import type { TrendPoint } from "@/types";
import { formatCheckinDate } from "@/lib/constants";

interface TrendChartProps {
  data: TrendPoint[];
}

export default function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full min-h-[200px] w-full items-center justify-center text-text-secondary">
        Not enough data to display trend
      </div>
    );
  }

  // Map the data for Recharts structure
  const chartData = data.map((point) => ({
    name: formatCheckinDate(point.date),
    score: Number((point.wellbeing_score ?? point.score ?? 0).toFixed(1)),
    stress: point.stress ? Number(point.stress.toFixed(1)) : undefined,
    fatigue: point.fatigue ? Number(point.fatigue.toFixed(1)) : undefined,
    workload: point.workload ? Number(point.workload.toFixed(1)) : undefined,
  }));

  return (
    <div className="h-[220px] w-full min-w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {/* Subtle grid lines matching the brand borders */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: "#6B7280" }} 
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            dy={8}
          />
          
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]}
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
            name="Burnout Score"
            stroke="#2f8876" // Brand color
            strokeWidth={3}
            dot={{ r: 4, fill: "#FFFFFF", stroke: "#2f8876", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#2f8876", stroke: "#FFFFFF", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="stress"
            name="Stress"
            stroke="#EF4444" // Risk High color
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="fatigue"
            name="Fatigue"
            stroke="#EAB308" // Risk Med color
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="workload"
            name="Workload"
            stroke="#3B82F6" // Standard blue
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
