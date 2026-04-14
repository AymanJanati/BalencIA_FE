"use client";

import { startTransition, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import type { InterventionType, SimulationResponse } from "@/types";

interface InterventionSimulatorProps {
  simulation: SimulationResponse | null;
  isLoading: boolean;
  error: string | null;
  onSimulate: (interventionType: InterventionType, intensity: number) => Promise<void>;
}

const INTERVENTIONS: Array<{ value: InterventionType; label: string; description: string }> = [
  {
    value: "reduce_meetings",
    label: "Reduce meetings",
    description: "Cuts non-essential meetings to lower overload quickly.",
  },
  {
    value: "redistribute_workload",
    label: "Redistribute workload",
    description: "Rebalances high-pressure tasks across team members.",
  },
  {
    value: "add_recovery_time",
    label: "Add recovery time",
    description: "Creates break and deep-focus windows for recovery.",
  },
  {
    value: "reduce_task_pressure",
    label: "Reduce task pressure",
    description: "Relaxes deadline density and concurrent task load.",
  },
];

export default function InterventionSimulator({
  simulation,
  isLoading,
  error,
  onSimulate,
}: InterventionSimulatorProps) {
  const [intervention, setIntervention] = useState<InterventionType>("reduce_meetings");
  const [intensity, setIntensity] = useState(0.3);

  const scoreImpact = simulation
    ? simulation.estimated_impact.team_score_before - simulation.estimated_impact.team_score_after
    : 0;
  const riskImpact = simulation
    ? simulation.estimated_impact.high_risk_count_before - simulation.estimated_impact.high_risk_count_after
    : 0;

  const selectedIntervention = INTERVENTIONS.find((item) => item.value === intervention);

  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-card-title text-text-primary">Intervention Simulator</h3>
        <p className="text-body text-text-secondary">
          Estimate impact before acting. This model is rule-based and designed for operational planning.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Intervention
        </label>
        <select
          value={intervention}
          onChange={(e) => setIntervention(e.target.value as InterventionType)}
          className="rounded-input border border-border bg-background-primary px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[#2f8876]/20"
        >
          {INTERVENTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <p className="text-caption text-text-secondary">{selectedIntervention?.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Intensity
          </label>
          <span className="text-xs font-semibold text-text-primary">{Math.round(intensity * 100)}%</span>
        </div>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.1}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full accent-[#2f8876]"
        />
      </div>

      <Button
        onClick={() => {
          startTransition(() => {
            void onSimulate(intervention, intensity);
          });
        }}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Estimating impact..." : "Run Simulation"}
      </Button>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-risk-high-text">
          {error}
        </div>
      )}

      {simulation && (
        <motion.div 
          initial={{ opacity: 0, height: 0, scale: 0.95 }} 
          animate={{ opacity: 1, height: "auto", scale: 1 }} 
          className="grid grid-cols-2 gap-3 origin-top"
        >
          <div className="rounded-xl border border-[#2f8876]/30 bg-gradient-to-br from-[#2f8876]/10 to-transparent p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#05fecb] rounded-full opacity-20 blur-xl"></div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#2f8876]">Team Risk Shift</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#1f4037]">-{scoreImpact.toFixed(1)}</span>
            </div>
            <div className="text-xs font-medium text-[#2f8876]/70 mt-1">
              From {simulation.estimated_impact.team_score_before.toFixed(1)} to{" "}
              {simulation.estimated_impact.team_score_after.toFixed(1)}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background-secondary p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">High-Risk Shift</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-text-primary">-{riskImpact}</span>
            </div>
            <div className="text-xs font-medium text-text-secondary mt-1">
              From {simulation.estimated_impact.high_risk_count_before} to{" "}
              {simulation.estimated_impact.high_risk_count_after}
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
}
