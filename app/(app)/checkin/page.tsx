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

  // Employee-only screen behavior setup
  useEffect(() => {
    if (!session) {
      router.replace(ROUTES.login);
    } else if (role !== "employee") {
      router.replace(ROUTES.manager);
    }
  }, [session, role, router]);

  // Don't render while redirecting if not an employee
  if (!session || role !== "employee") {
    return null;
  }

  // 4. Success state UI
  if (data) {
    const { burnout_score, ai_support } = data;
    return (
      <div className="max-w-2xl mx-auto">
        <PageHeader 
          title="Check-in Complete" 
          subtitle="Thank you for sharing your status today." 
        />
        <Card padding="lg" className="flex flex-col gap-8 mt-6">
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-border">
            <h2 className="text-caption font-semibold text-text-secondary uppercase tracking-widest">
              Burnout Score
            </h2>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[64px] font-extrabold leading-none tracking-tight text-text-primary">
                {burnout_score.score.toFixed(1)}
              </span>
              <Badge level={burnout_score.risk_level} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-brand-subtle rounded-xl p-5 border border-border">
              <h3 className="text-body font-semibold text-text-primary mb-2 flex items-center gap-2">
                <span className="text-xl">✨</span> AI Insight
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                {ai_support.message}
              </p>
            </div>

            {ai_support.actions && ai_support.actions.length > 0 && (
              <div className="flex flex-col gap-4">
                <h4 className="text-body font-semibold text-text-primary">Recommended Actions</h4>
                <ul className="flex flex-col gap-3">
                  {ai_support.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3 text-body text-text-secondary bg-background-primary border border-border rounded-lg p-4">
                      {/* Gradient bullet point using typography background clip */}
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

  // Next UI States: 1. Idle form, 2. Loading, 3. Error
  return (
    <div>
      <PageHeader 
        title="Daily Check-in" 
        subtitle="Take a moment to reflect on your current wellbeing." 
      />
      
      {/* 3. Error state UI */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-risk-high-bg text-risk-high-text rounded-card border border-red-100 flex items-center justify-center text-body font-medium">
          {error}
        </div>
      )}

      {/* 1. Idle and 2. Loading state UI are managed here */}
      <div className={`transition-opacity duration-300 ${loading ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
        <CheckinForm onSubmit={submit} isLoading={loading} />
      </div>
    </div>
  );
}
