"use client";

// app/(app)/dashboard/page.tsx — Employee dashboard

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import { ROUTES, formatCheckinDate } from "@/lib/constants";

import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Activity, Compass, Info, CheckCircle2 } from "lucide-react";

import dynamic from "next/dynamic";
const TrendChart = dynamic(() => import("@/components/data/TrendChart"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-full w-full bg-border/40 rounded-xl" />,
});
const ScoreCompositionChart = dynamic(() => import("@/components/data/ScoreCompositionChart"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-full w-full bg-border/40 rounded-xl" />,
});
import InsightCard from "@/components/ai/InsightCard";
import RecommendationCard from "@/components/ai/RecommendationCard";

import LoadingSkeleton from "@/components/states/LoadingSkeleton";
import ErrorState from "@/components/states/ErrorState";
import EmptyState from "@/components/states/EmptyState";

export default function DashboardPage() {
  const { session, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace(ROUTES.login);
    } else if (role !== "employee") {
      router.replace(ROUTES.manager);
    }
  }, [session, role, router]);

  const { data, loading, error } = useDashboard(session?.user?.id ?? null);

  if (!session || role !== "employee") return null;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-6 w-full max-w-5xl mx-auto opacity-70">
        <div className="h-12 w-1/3 bg-border rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-40 bg-background-primary border border-border rounded-card flex items-center justify-center">
            <LoadingSkeleton />
          </div>
          <div className="h-40 bg-background-primary border border-border rounded-card flex items-center justify-center">
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-risk-high-bg text-risk-high-text rounded-card border border-red-200">
        <h3 className="font-semibold text-lg mb-2">Notice</h3>
        <ErrorState message={error} />
      </div>
    );
  }

  // ── Empty (no check-in yet) ───────────────────────────────────────────────
  if (!data || !data.latest_score) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-2xl mx-auto bg-background-primary rounded-card border border-border shadow-sm">
        <span className="text-5xl mb-6">🌱</span>
        <h2 className="text-section-title text-text-primary mb-3">Welcome to BalancIA</h2>
        <div className="text-body text-text-secondary mb-8">
          <EmptyState message="You haven't completed a check-in yet. Submitting your current wellbeing starts unlocking your personal insights." />
        </div>
        <Button size="lg" onClick={() => router.push(ROUTES.checkin)}>
          Start your first Check-in
        </Button>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  const { latest_score, ai_support, trend, checkin_history, behavioral_metrics, meeting_metrics } = data;

  // global_score is 0-100 in upgraded backend
  const displayScore = latest_score.global_score.toFixed(0);
  const riskLevel    = latest_score.risk_level as "low" | "medium" | "high";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 max-w-[1100px] mx-auto"
    >
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Your Wellbeing Dashboard"
          subtitle={`Welcome back, ${session.user.name}. Here are your real-time insights.`}
          actions={
            <Button onClick={() => router.push(ROUTES.checkin)}>
              Log today&apos;s Check-in
            </Button>
          }
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Score card */}
          <motion.div variants={itemVariants}>
            <Card padding="lg" className="flex flex-col sm:flex-row items-center gap-8 justify-between relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full opacity-[0.03] blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="flex flex-col items-start gap-4 z-10 w-full sm:w-auto">
              <h3 className="text-caption font-semibold text-text-secondary uppercase tracking-widest text-center sm:text-left w-full">
                Current Burnout Risk Score
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <div className="flex items-end gap-1.5">
                  <span className="text-[72px] font-extrabold leading-none tracking-tight text-transparent bg-clip-text bg-brand">
                    {displayScore}
                  </span>
                  <span className="text-2xl font-medium text-text-secondary mb-2">/100</span>
                </div>
                <Badge level={riskLevel} />
              </div>

              {/* Score breakdown sub-row */}
              {(latest_score.behavior_score != null || latest_score.meeting_score != null) && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-1">
                  <div className="flex flex-col items-center bg-background-secondary rounded-lg p-2 border border-border">
                    <span className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider">Self-report</span>
                    <span className="text-base font-bold text-text-primary">{latest_score.self_report_score}</span>
                  </div>
                  {latest_score.behavior_score != null && (
                    <div className="flex flex-col items-center bg-background-secondary rounded-lg p-2 border border-border">
                      <span className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider">Behavior</span>
                      <span className="text-base font-bold text-text-primary">{latest_score.behavior_score}</span>
                    </div>
                  )}
                  {latest_score.meeting_score != null && (
                    <div className="flex flex-col items-center bg-background-secondary rounded-lg p-2 border border-border">
                      <span className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider">Meetings</span>
                      <span className="text-base font-bold text-text-primary">{latest_score.meeting_score}</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center bg-background-secondary rounded-lg p-2 border border-border">
                    <span className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider">Trend</span>
                    <span className="text-base font-bold text-text-primary">{latest_score.trend_score}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="flex">
              <Card padding="lg" className="flex flex-col min-h-[320px] w-full">
                <h3 className="text-card-title text-text-primary mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-text-secondary" />
                  Signal Composition
                </h3>
                <p className="text-caption text-text-secondary mb-2">
                  Explainable score components from your latest cycle.
                </p>
                <div className="flex-1">
                  <ScoreCompositionChart score={latest_score} />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="flex">
              <Card padding="lg" className="flex flex-col min-h-[320px] w-full">
                <h3 className="text-card-title text-text-primary mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-text-secondary" />
                  Wellbeing Trend
                </h3>
              <p className="text-caption text-text-secondary mb-2">
                Risk evolution over recent check-ins.
              </p>
              <div className="flex-1 flex flex-col items-center justify-center text-text-secondary bg-background-secondary/40 rounded-xl border border-border/50 p-4">
                <div className="[&_p]:text-body [&_p]:font-medium [&_p]:text-text-secondary w-full">
                  <TrendChart data={trend} />
                </div>
              </div>
            </Card>
            </motion.div>
          </div>

          {(behavioral_metrics || meeting_metrics) && (
            <motion.div variants={itemVariants}>
              <Card padding="lg" className="flex flex-col gap-4">
                <h3 className="text-card-title text-text-primary flex items-center gap-2">
                  <Compass className="w-5 h-5 text-text-secondary" />
                  Operational Signal Snapshot
                </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {behavioral_metrics && (
                  <>
                    <div className="rounded-lg border border-border bg-background-secondary p-3">
                      <div className="text-xs uppercase font-semibold text-text-secondary">Typing rhythm</div>
                      <div className="text-xl font-bold text-text-primary">{behavioral_metrics.typing_rhythm_score}</div>
                    </div>
                    <div className="rounded-lg border border-border bg-background-secondary p-3">
                      <div className="text-xs uppercase font-semibold text-text-secondary">Inactivity bursts</div>
                      <div className="text-xl font-bold text-text-primary">{behavioral_metrics.inactivity_bursts}</div>
                    </div>
                    <div className="rounded-lg border border-border bg-background-secondary p-3">
                      <div className="text-xs uppercase font-semibold text-text-secondary">Session duration</div>
                      <div className="text-xl font-bold text-text-primary">{behavioral_metrics.session_duration_minutes}m</div>
                    </div>
                  </>
                )}
                {meeting_metrics && (
                  <>
                    <div className="rounded-lg border border-border bg-background-secondary p-3">
                      <div className="text-xs uppercase font-semibold text-text-secondary">Meeting hours</div>
                      <div className="text-xl font-bold text-text-primary">{meeting_metrics.meeting_hours}</div>
                    </div>
                    <div className="rounded-lg border border-border bg-background-secondary p-3">
                      <div className="text-xs uppercase font-semibold text-text-secondary">Back-to-back</div>
                      <div className="text-xl font-bold text-text-primary">{meeting_metrics.back_to_back_count}</div>
                    </div>
                    <div className="rounded-lg border border-border bg-background-secondary p-3">
                      <div className="text-xs uppercase font-semibold text-text-secondary">No-break blocks</div>
                      <div className="text-xl font-bold text-text-primary">{meeting_metrics.no_break_blocks}</div>
                    </div>
                  </>
                )}
              </div>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {ai_support && (
            <motion.div variants={itemVariants}>
              <Card padding="lg" className="bg-brand-subtle border-brand/20">
                <h3 className="text-card-title text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#05fecb]" />
                  Personal Insight
                </h3>
              <div className="text-body text-text-secondary leading-relaxed [&_p]:font-medium [&_p]:text-[15px]">
                <InsightCard message={ai_support.message} />
              </div>

              {/* Reasons (upgraded field) */}
              {ai_support.reasons && ai_support.reasons.length > 0 && (
                <div className="mt-4 flex flex-col gap-1.5">
                  {ai_support.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-text-secondary bg-background-primary/60 rounded-lg px-3 py-2 border border-border/60">
                      <span className="text-brand shrink-0">→</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}
              </Card>
            </motion.div>
          )}

          {ai_support?.actions && ai_support.actions.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card padding="lg">
                <h3 className="text-card-title text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-text-secondary" />
                  Recommended Steps
                </h3>
                <div className="[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_li]:bg-background-secondary [&_li]:text-text-secondary [&_li]:font-medium [&_li]:p-3 [&_li]:rounded-lg [&_li]:border [&_li]:border-border [&_li]:text-body">
                  <RecommendationCard actions={ai_support.actions} />
                </div>
              </Card>
            </motion.div>
          )}

          {checkin_history && checkin_history.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card padding="lg">
                <h3 className="text-card-title text-text-primary mb-4">Recent Logs</h3>
              <div className="flex flex-col gap-3">
                {checkin_history.slice(0, 4).map((checkin) => (
                  <div key={checkin.id} className="flex justify-between items-center text-body border-b border-border/60 last:border-0 pb-3 last:pb-0">
                    <span className="text-text-secondary font-medium">{formatCheckinDate(checkin.created_at)}</span>
                    <span className="font-semibold text-text-primary bg-background-secondary px-2.5 py-1 rounded-full text-caption border border-border">
                      Mood: {checkin.mood}/5
                    </span>
                  </div>
                ))}
              </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
