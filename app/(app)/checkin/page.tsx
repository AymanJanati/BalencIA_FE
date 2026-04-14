"use client";

// app/(app)/checkin/page.tsx — Employee check-in screen

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCheckin } from "@/hooks/useCheckin";
import { ROUTES } from "@/lib/constants";

import PageHeader from "@/components/ui/PageHeader";
import CheckinForm from "@/components/forms/CheckinForm";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function CheckinPage() {
  const { session, role } = useAuth();
  const router = useRouter();
  const { data, loading, error, submit } = useCheckin();

  useEffect(() => {
    if (!session) {
      router.replace(ROUTES.login);
    } else if (role !== "employee") {
      router.replace(ROUTES.manager);
    }
  }, [session, role, router]);

  if (!session || role !== "employee") return null;

  // ── Success state: show result ────────────────────────────────────────────
  if (data) {
    const { risk_breakdown, ai_support } = data;
    // Display score as X/100 from the 0-100 global_score
    const displayScore = risk_breakdown.global_score.toFixed(0);

    return (
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="Check-in Complete"
          subtitle="Thank you for sharing your status today."
        />
        <Card padding="lg" className="flex flex-col gap-8 mt-6">

          {/* Score block */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-border">
            <h2 className="text-caption font-semibold text-text-secondary uppercase tracking-widest">
              Burnout Risk Score
            </h2>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-end gap-2">
                <span className="text-[64px] font-extrabold leading-none tracking-tight text-text-primary">
                  {displayScore}
                </span>
                <span className="text-2xl font-medium text-text-secondary mb-2">/100</span>
              </div>
              <Badge level={risk_breakdown.risk_level as "low" | "medium" | "high"} />
            </div>

            {/* Score breakdown breakdown if available */}
            {(risk_breakdown.behavior_score != null || risk_breakdown.meeting_score != null) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-2">
                <div className="flex flex-col items-center bg-background-secondary rounded-lg p-3 border border-border">
                  <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Self-report</span>
                  <span className="text-lg font-bold text-text-primary">{risk_breakdown.self_report_score}</span>
                </div>
                {risk_breakdown.behavior_score != null && (
                  <div className="flex flex-col items-center bg-background-secondary rounded-lg p-3 border border-border">
                    <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Behavior</span>
                    <span className="text-lg font-bold text-text-primary">{risk_breakdown.behavior_score}</span>
                  </div>
                )}
                {risk_breakdown.meeting_score != null && (
                  <div className="flex flex-col items-center bg-background-secondary rounded-lg p-3 border border-border">
                    <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Meetings</span>
                    <span className="text-lg font-bold text-text-primary">{risk_breakdown.meeting_score}</span>
                  </div>
                )}
                <div className="flex flex-col items-center bg-background-secondary rounded-lg p-3 border border-border">
                  <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">Trend</span>
                  <span className="text-lg font-bold text-text-primary">{risk_breakdown.trend_score}</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Support */}
          <div className="flex flex-col gap-6">
            <div className="bg-brand-subtle rounded-xl p-5 border border-border">
              <h3 className="text-body font-semibold text-text-primary mb-2 flex items-center gap-2">
                <span className="text-xl">✨</span> AI Insight
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                {ai_support.message}
              </p>
            </div>

            {/* Reasons (new field from upgraded backend) */}
            {ai_support.reasons && ai_support.reasons.length > 0 && (
              <div className="flex flex-col gap-2">
                <h4 className="text-body font-semibold text-text-primary">Why this score</h4>
                <ul className="flex flex-col gap-2">
                  {ai_support.reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary bg-background-secondary border border-border rounded-lg px-4 py-3">
                      <span className="text-brand shrink-0 mt-0.5">→</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {ai_support.actions && ai_support.actions.length > 0 && (
              <div className="flex flex-col gap-4">
                <h4 className="text-body font-semibold text-text-primary">Recommended Actions</h4>
                <ul className="flex flex-col gap-3">
                  {ai_support.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3 text-body text-text-secondary bg-background-primary border border-border rounded-lg p-4">
                      <span className="text-transparent bg-clip-text bg-brand shrink-0 text-lg font-bold leading-none mt-0.5">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button onClick={() => router.push(ROUTES.dashboard)} size="lg">
              View Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Form state ────────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Daily Check-in"
        subtitle="Take a moment to reflect on your current wellbeing."
      />

      {error && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-risk-high-bg text-risk-high-text rounded-card border border-red-100 flex items-center justify-center text-body font-medium">
          {error}
        </div>
      )}

      <div className={`transition-opacity duration-300 ${loading ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
        <CheckinForm onSubmit={submit} isLoading={loading} />
      </div>
    </div>
  );
}
