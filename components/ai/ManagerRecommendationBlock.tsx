"use client";

// components/ai/ManagerRecommendationBlock.tsx — team-level summary + actions

import Card from "@/components/ui/Card";

interface ManagerRecommendationBlockProps {
  summary: string;
  actions: string[];
  reasons?: string[];
}

export default function ManagerRecommendationBlock({ summary, actions, reasons }: ManagerRecommendationBlockProps) {
  return (
    <Card padding="lg" className="bg-brand-subtle border-brand/20 shadow-none flex flex-col gap-6 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand rounded-full opacity-10 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-3">
        <h3 className="text-card-title text-text-primary flex items-center gap-2">
          <span className="text-xl">📊</span> Team Insight
        </h3>
        <p className="text-body text-text-secondary font-medium leading-relaxed">
          {summary}
        </p>
      </div>

      {reasons && reasons.length > 0 && (
        <div className="relative z-10 flex flex-col gap-2">
          <h4 className="text-body font-bold text-text-primary">Key Risk Drivers</h4>
          <ul className="flex flex-col gap-2">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary bg-background-primary/50 border border-border/80 px-3 py-2 rounded-md">
                <span className="text-brand shrink-0">→</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {actions && actions.length > 0 && (
        <div className="relative z-10 flex flex-col gap-4">
          <h4 className="text-body font-bold text-text-primary">Recommended Actions</h4>
          <ul className="flex flex-col gap-3">
            {actions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 bg-background-primary border border-border p-3 rounded-lg text-body text-text-primary font-medium">
                <span className="text-transparent bg-clip-text bg-brand font-bold text-lg leading-none mt-0.5">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
