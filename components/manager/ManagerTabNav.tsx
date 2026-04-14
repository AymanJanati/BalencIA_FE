"use client";

export type ManagerTabKey = "overview" | "employees" | "insights" | "interventions";

interface ManagerTabNavProps {
  activeTab: ManagerTabKey;
  onChange: (tab: ManagerTabKey) => void;
}

const TABS: Array<{ key: ManagerTabKey; label: string; subtitle: string }> = [
  { key: "overview", label: "Overview", subtitle: "Executive summary" },
  { key: "employees", label: "Employees", subtitle: "Operational risk map" },
  { key: "insights", label: "Insights", subtitle: "Explainability and patterns" },
  { key: "interventions", label: "Interventions", subtitle: "Action and simulation" },
];

export default function ManagerTabNav({ activeTab, onChange }: ManagerTabNavProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {TABS.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={[
              "rounded-xl border px-4 py-3 text-left transition-all duration-150",
              active
                ? "border-[#2f8876] bg-brand-subtle shadow-sm"
                : "border-border bg-background-primary hover:bg-background-secondary",
            ].join(" ")}
          >
            <div className="text-sm font-semibold text-text-primary">{tab.label}</div>
            <div className="text-xs text-text-secondary mt-1">{tab.subtitle}</div>
          </button>
        );
      })}
    </div>
  );
}
