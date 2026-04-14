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

import dynamic from "next/dynamic";
// AI and Data components (currently placeholders, styled via parent wrappers)
const TrendChart = dynamic(() => import("@/components/data/TrendChart"), { 
  ssr: false, 
  loading: () => <div className="animate-pulse h-full w-full bg-border/40 rounded-xl" />
});
import InsightCard from "@/components/ai/InsightCard";
import RecommendationCard from "@/components/ai/RecommendationCard";

// State handling components
import LoadingSkeleton from "@/components/states/LoadingSkeleton";
import ErrorState from "@/components/states/ErrorState";
import EmptyState from "@/components/states/EmptyState";

export default function DashboardPage() {
  const { session, role } = useAuth();
  const router = useRouter();

  // Employee-only behavior guard
  useEffect(() => {
    if (!session) {
      router.replace(ROUTES.login);
    } else if (role !== "employee") {
      router.replace(ROUTES.manager);
    }
  }, [session, role, router]);

  // Fetch dashboard data
  const { data, loading, error } = useDashboard(session?.user?.id ?? null);

  // Prevent rendering anything if guard is active
  if (!session || role !== "employee") {
    return null;
  }

  // 1. Loading UI State
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

  // 2. Error UI State
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-risk-high-bg text-risk-high-text rounded-card border border-red-200">
        <h3 className="font-semibold text-lg mb-2">Notice</h3>
        <div className="text-body font-medium">
          <ErrorState message={error} />
        </div>
      </div>
    );
  }

  // 3. Empty UI State
  if (!data || !data.latest_score) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-2xl mx-auto bg-background-primary rounded-card border border-border shadow-sm">
        <span className="text-5xl mb-6">🌱</span>
        <h2 className="text-section-title text-text-primary mb-3">Welcome to BalencIA</h2>
        <div className="text-body text-text-secondary mb-8">
          <EmptyState message="You haven't completed a check-in yet. Submitting your current wellbeing starts unlocking your personal insights." />
        </div>
        <Button size="lg" onClick={() => router.push(ROUTES.checkin)}>
          Start your first Check-in
        </Button>
      </div>
    );
  }

  // 4. Success UI State
  const { latest_score, ai_support, trend, checkin_history } = data;

  return (
    <div className="flex flex-col gap-6 max-w-[1100px] mx-auto opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <PageHeader 
        title={`Your Wellbeing Dashboard`} 
        subtitle={`Welcome back, ${session.user.name}. Here are your real-time insights.`}
        actions={
          <Button onClick={() => router.push(ROUTES.checkin)}>
            Log today&apos;s Check-in
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: KPI & Flow */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card padding="lg" className="flex flex-col sm:flex-row items-center gap-8 justify-between relative overflow-hidden">
            {/* Soft decorative background effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full opacity-[0.03] blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="flex flex-col items-start gap-4 z-10 w-full sm:w-auto">
              <h3 className="text-caption font-semibold text-text-secondary uppercase tracking-widest text-center sm:text-left w-full">
                Current Burnout Score
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <span className="text-[72px] font-extrabold leading-none tracking-tight text-transparent bg-clip-text bg-brand">
                  {latest_score.score.toFixed(1)}
                </span>
                <Badge level={latest_score.risk_level} />
              </div>
            </div>
          </Card>

          <Card padding="lg" className="flex flex-col flex-1 min-h-[320px]">
             <h3 className="text-card-title text-text-primary mb-6">Wellbeing Trend</h3>
             <div className="flex-1 flex flex-col items-center justify-center text-text-secondary bg-background-secondary/40 rounded-xl border border-border/50 p-6">
               {/* Wrapper styles child placeholder to look native */}
               <div className="[&_p]:text-body [&_p]:font-medium [&_p]:text-text-secondary">
                 <TrendChart data={trend} />
               </div>
             </div>
          </Card>
        </div>

        {/* Right Column: AI & History */}
        <div className="flex flex-col gap-6">
          {ai_support && (
            <Card padding="lg" className="bg-brand-subtle border border-brand/10 shadow-none">
               <h3 className="text-card-title text-text-primary mb-3 flex items-center gap-2">
                 <span className="text-brand">✨</span> Personal Insight
               </h3>
               {/* Wrapped placeholder styles */}
               <div className="text-body text-text-secondary leading-relaxed [&_p]:font-medium [&_p]:text-[15px]">
                 <InsightCard message={ai_support.message} />
               </div>
            </Card>
          )}

          {ai_support?.actions && ai_support.actions.length > 0 && (
            <Card padding="lg">
              <h3 className="text-card-title text-text-primary mb-4">Recommended Steps</h3>
              {/* Wrapped placeholder styles */}
              <div className="[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_li]:bg-background-secondary [&_li]:text-text-secondary [&_li]:font-medium [&_li]:p-3 [&_li]:rounded-lg [&_li]:border [&_li]:border-border [&_li]:text-body">
                 <RecommendationCard actions={ai_support.actions} />
              </div>
            </Card>
          )}

          {checkin_history && checkin_history.length > 0 && (
             <Card padding="lg">
               <h3 className="text-card-title text-text-primary mb-4">Recent Logs</h3>
               <div className="flex flex-col gap-3">
                 {checkin_history.slice(0, 4).map(checkin => (
                    <div key={checkin.id} className="flex justify-between items-center text-body border-b border-border/60 last:border-0 pb-3 last:pb-0">
                       <span className="text-text-secondary font-medium">{formatCheckinDate(checkin.created_at)}</span>
                       <span className="font-semibold text-text-primary bg-background-secondary px-2.5 py-1 rounded-full text-caption border border-border">
                         Mood: {checkin.mood}/5
                       </span>
                    </div>
                 ))}
               </div>
               <div className="pt-4 text-center">
                 <span className="text-caption text-brand font-medium hover:underline cursor-pointer">
                   View full history
                 </span>
               </div>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
