"use client";

// components/data/KPIBox.tsx — metric card with label + value + trend

import Card from "@/components/ui/Card";

interface KPIBoxProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: "positive" | "negative" | "neutral";
  alert?: boolean;
}

export default function KPIBox({ label, value, trend, trendDirection = "neutral", alert = false }: KPIBoxProps) {
  // Determine trend color
  let trendColor = "text-text-secondary";
  if (trendDirection === "positive") trendColor = "text-risk-low-text";
  if (trendDirection === "negative") trendColor = "text-risk-high-text";

  return (
    <Card 
      padding="md" 
      className={`flex flex-col gap-2 ${alert ? "border-red-200 bg-red-50/30" : ""}`}
    >
      <span className="text-body font-medium text-text-secondary">
        {label}
      </span>
      <div className="flex items-baseline gap-3">
        <span className={`text-kpi font-extrabold ${alert ? "text-risk-high-text" : "text-text-primary"}`}>
          {value}
        </span>
        {trend && (
          <span className={`text-caption font-semibold ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
}
