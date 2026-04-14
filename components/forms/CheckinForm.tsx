"use client";

// components/forms/CheckinForm.tsx — full check-in form composition
// Combines MoodSelector, SliderFields, and TextArea

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import MoodSelector from "@/components/forms/MoodSelector";
import SliderField from "@/components/ui/SliderField";
import TextArea from "@/components/ui/TextArea";
import { SLIDER_FIELDS } from "@/lib/constants";
import type { CheckinPayload, MoodValue, ScaleValue } from "@/types";

interface CheckinFormProps {
  onSubmit: (payload: CheckinPayload) => void;
  isLoading?: boolean;
}

export default function CheckinForm({ onSubmit, isLoading = false }: CheckinFormProps) {
  const { session } = useAuth();
  
  // Local state for the form fields
  const [mood, setMood] = useState<MoodValue | null>(null);
  const [stress, setStress] = useState<ScaleValue>(3);
  const [fatigue, setFatigue] = useState<ScaleValue>(3);
  const [workload, setWorkload] = useState<ScaleValue>(3);
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id || mood === null) return;

    const payload: CheckinPayload = {
      user_id: session.user.id,
      mood,
      stress,
      fatigue,
      workload,
      note: note.trim() || undefined,
    };

    onSubmit(payload);
  };

  const setSliderValue = (key: string, value: number) => {
    const val = value as ScaleValue;
    if (key === "stress") setStress(val);
    if (key === "fatigue") setFatigue(val);
    if (key === "workload") setWorkload(val);
  };

  const getSliderValue = (key: string): ScaleValue => {
    if (key === "stress") return stress;
    if (key === "fatigue") return fatigue;
    if (key === "workload") return workload;
    return 3;
  };

  return (
    <Card className="max-w-2xl mx-auto overflow-visible" padding="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Mood Selector Section */}
        <section>
          <MoodSelector value={mood} onChange={setMood} />
        </section>

        {/* Sliders Section */}
        <section className="flex flex-col gap-6">
          <h3 className="text-section-title text-text-primary">Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {SLIDER_FIELDS.map((field) => (
              <SliderField
                key={field.key}
                label={field.label}
                hint={field.hint}
                min={field.min}
                max={field.max}
                value={getSliderValue(field.key)}
                onChange={(val) => setSliderValue(field.key, val)}
              />
            ))}
          </div>
        </section>

        {/* Note Section */}
        <section>
          <TextArea
            label="Additional Notes (Optional)"
            placeholder="Anything else on your mind?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            hint="Your notes help our AI provide more personalized support."
          />
        </section>

        {/* Submit Action */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto min-w-[180px]"
            disabled={mood === null || isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Check-in"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
