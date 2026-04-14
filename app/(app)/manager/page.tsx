"use client";

// app/(app)/manager/page.tsx — Manager dashboard (includes recommendations)

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useManagerSummary } from "@/hooks/useManagerSummary";
import { ROUTES, DEFAULT_TEAM_ID } from "@/lib/constants";

import PageHeader from "@/components/ui/PageHeader";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import KPIBox from "@/components/data/KPIBox";
const TrendChart = dynamic(() => import("@/components/data/TrendChart"), { 
  ssr: false,
  loading: () => <div className="animate-pulse h-full w-full bg-border/40 rounded-xl" />
});
import EmployeeList from "@/components/data/EmployeeList";
import ManagerRecommendationBlock from "@/components/ai/ManagerRecommendationBlock";

// State components
import LoadingSkeleton from "@/components/states/LoadingSkeleton";
import ErrorState from "@/components/states/ErrorState";
import EmptyState from "@/components/states/EmptyState";

export default function ManagerPage() {
  const { session, role } = useAuth();
  const router = useRouter();

  // Manager-only behavior guard
  useEffect(() => {
    if (!session) {
      router.replace(ROUTES.login);
    } else if (role !== "manager") {
      router.replace(ROUTES.dashboard); // Redirect employees back to their dashboard
    }
  }, [session, role, router]);

  // Use team_id from session, fallback to seed default if undefined
  const teamId = session?.user?.team_id || DEFAULT_TEAM_ID;

  // Fetch manager summary data
  const { data, loading, error } = useManagerSummary(role === "manager" ? teamId : null);

  // Prevent rendering if guard active
  if (!session || role !== "manager") {
    return null;
  }

  // 1. Loading State
  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-6 w-full max-w-6xl mx-auto opacity-70">
        <div className="h-10 w-1/4 bg-border rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-background-primary border border-border rounded-card flex items-center justify-center">
              <LoadingSkeleton />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div className="h-64 bg-background-primary border border-border rounded-card flex items-center justify-center">
            <LoadingSkeleton />
          </div>
          <div className="h-64 bg-background-primary border border-border rounded-card flex items-center justify-center">
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
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

  // 3. Empty State
  if (!data || !data.summary) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-2xl mx-auto bg-background-primary rounded-card border border-border shadow-sm">
        <span className="text-5xl mb-6">👥</span>
        <h2 className="text-section-title text-text-primary mb-3">No Team Data</h2>
        <div className="text-body text-text-secondary">
          <EmptyState message="There is currently no data available for your team. Check back later when employees have completed their check-ins." />
        </div>
      </div>
    );
  }

  // 4. Success State
  const { summary, recommendations } = data;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <PageHeader 
        title="Team Overview" 
        subtitle={`Summary for ${summary.team_name}`}
      />

      {/* KPI Section (Top) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIBox 
          label="Team Wellbeing" 
          value={summary.team_wellbeing_score.toFixed(1)} 
          trend="+0.2" 
          trendDirection="positive"
        />
        <KPIBox 
          label="Average Stress" 
          value={summary.average_stress.toFixed(1)} 
          trend="-0.1" 
          trendDirection="positive"
        />
        <KPIBox 
          label="Average Fatigue" 
          value={summary.average_fatigue.toFixed(1)} 
        />
        <KPIBox 
          label="High Risk Employees" 
          value={summary.high_risk_count.toString()} 
          alert={summary.high_risk_count > 0} 
        />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Team Details */}
        <div className="flex flex-col gap-8">
          {/* Employee List */}
          <section className="flex flex-col gap-4">
             <h3 className="text-section-title text-text-primary">Team Members</h3>
             <EmployeeList employees={summary.employees} />
          </section>

          {/* Trend Chart */}
          <section className="flex flex-col gap-4">
             <h3 className="text-section-title text-text-primary">Team Wellbeing Trend</h3>
             <Card padding="md" className="flex flex-col items-center justify-center min-h-[220px] bg-background-secondary/30">
               <div className="[&_p]:text-body [&_p]:font-medium [&_p]:text-text-secondary">
                 <TrendChart data={summary.trend} />
               </div>
             </Card>
          </section>
        </div>

        {/* Right Column: AI Manager Recommendations */}
        <div className="flex flex-col gap-4 h-full">
          <h3 className="text-section-title text-text-primary mb-1">AI Recommendations</h3>
          <div className="sticky top-24">
            <ManagerRecommendationBlock 
              summary={recommendations.summary} 
              actions={recommendations.actions}
              reasons={recommendations.reasons}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
