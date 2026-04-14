"use client";

// components/forms/MoodSelector.tsx — 5-option mood picker
// Uses MOOD_OPTIONS from constants.ts

import type { MoodValue } from "@/types/index";
import { MOOD_OPTIONS } from "@/lib/constants";

interface MoodSelectorProps {
  value: MoodValue | null;
  onChange: (value: MoodValue) => void;
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-body font-medium text-text-primary">How are you feeling today?</label>
      <div className="flex items-center justify-between gap-2 p-1 bg-background-secondary rounded-input border border-border">
        {MOOD_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value as MoodValue)}
              className={[
                "flex flex-col items-center justify-center flex-1 py-3 px-2 rounded-button transition-all duration-200 gap-1",
                isSelected
                  ? "bg-background-primary shadow-sm text-text-primary scale-[1.02] border border-border"
                  : "text-text-secondary hover:bg-background-primary/50 grayscale hover:grayscale-0",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={option.label}
              title={option.label}
            >
              <span className={`text-2xl transition-transform duration-200 ${isSelected ? "scale-110" : "scale-100"}`}>
                {option.emoji}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
