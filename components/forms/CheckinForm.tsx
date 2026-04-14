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
  const [includeAdvancedSignals, setIncludeAdvancedSignals] = useState(false);

  const [typingRhythmScore, setTypingRhythmScore] = useState(55);
  const [inactivityBursts, setInactivityBursts] = useState(3);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(180);
  const [breakCount, setBreakCount] = useState(2);
  const [tabSwitchRate, setTabSwitchRate] = useState(20);
  const [lateActivityFlag, setLateActivityFlag] = useState(false);

  const [meetingsCount, setMeetingsCount] = useState(4);
  const [meetingHours, setMeetingHours] = useState(2.5);
  const [backToBackCount, setBackToBackCount] = useState(1);
  const [noBreakBlocks, setNoBreakBlocks] = useState(0);

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

    if (includeAdvancedSignals) {
      payload.behavioral_metrics = {
        typing_rhythm_score: typingRhythmScore,
        inactivity_bursts: inactivityBursts,
        session_duration_minutes: sessionDurationMinutes,
        break_count: breakCount,
        tab_switch_rate: tabSwitchRate,
        late_activity_flag: lateActivityFlag,
      };

      payload.meeting_metrics = {
        meetings_count: meetingsCount,
        meeting_hours: meetingHours,
        back_to_back_count: backToBackCount,
        no_break_blocks: noBreakBlocks,
      };
    }

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

        <section className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-background-secondary/70 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-body font-semibold text-text-primary">Advanced Operational Signals</h4>
                <p className="text-caption text-text-secondary">
                  Optional analytics inputs for behavioral strain and meeting overload scoring.
                </p>
              </div>
              <Button
                type="button"
                variant={includeAdvancedSignals ? "secondary" : "primary"}
                size="sm"
                onClick={() => setIncludeAdvancedSignals((value) => !value)}
              >
                {includeAdvancedSignals ? "Disable Signals" : "Enable Signals"}
              </Button>
            </div>
          </div>

          {includeAdvancedSignals && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-4 bg-background-primary">
                <h5 className="text-sm font-semibold text-text-primary mb-3">Behavioral Strain</h5>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs text-text-secondary flex flex-col gap-1">
                    Typing rhythm (0-100)
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={typingRhythmScore}
                      onChange={(e) => setTypingRhythmScore(Number(e.target.value))}
                      className="rounded-input border border-border px-3 py-2 text-sm text-text-primary"
                    />
                  </label>
                  <label className="text-xs text-text-secondary flex flex-col gap-1">
                    Inactivity bursts
                    <input
                      type="number"
                      min={0}
                      value={inactivityBursts}
                      onChange={(e) => setInactivityBursts(Number(e.target.value))}
                      className="rounded-input border border-border px-3 py-2 text-sm text-text-primary"
                    />
                  </label>
                  <label className="text-xs text-text-secondary flex flex-col gap-1">
                    Session duration (min)
                    <input
                      type="number"
                      min={0}
                      value={sessionDurationMinutes}
                      onChange={(e) => setSessionDurationMinutes(Number(e.target.value))}
                      className="rounded-input border border-border px-3 py-2 text-sm text-text-primary"
                    />
                  </label>
                  <label className="text-xs text-text-secondary flex flex-col gap-1">
                    Break count
                    <input
                      type="number"
                      min={0}
                      value={breakCount}
                      onChange={(e) => setBreakCount(Number(e.target.value))}
                      className="rounded-input border border-border px-3 py-2 text-sm text-text-primary"
                    />
                  </label>
                  <label className="text-xs text-text-secondary flex flex-col gap-1">
                    Tab switch rate
                    <input
                      type="number"
                      min={0}
                      value={tabSwitchRate}
                      onChange={(e) => setTabSwitchRate(Number(e.target.value))}
                      className="rounded-input border border-border px-3 py-2 text-sm text-text-primary"
                    />
                  </label>
                  <label className="text-xs text-text-secondary flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      checked={lateActivityFlag}
                      onChange={(e) => setLateActivityFlag(e.target.checked)}
                    />
                    Late activity
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4 bg-background-primary">
                <h5 className="text-sm font-semibold text-text-primary mb-3">Meeting Overload</h5>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs text-text-secondary flex flex-col gap-1">
                    Meetings count
                    <input
                      type="number"
                      min={0}
                      value={meetingsCount}
                      onChange={(e) => setMeetingsCount(Number(e.target.value))}
                      className="rounded-input border border-border px-3 py-2 text-sm text-text-primary"
                    />
                  </label>
                  <label className="text-xs text-text-secondary flex flex-col gap-1">
                    Meeting hours
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={meetingHours}
                      onChange={(e) => setMeetingHours(Number(e.target.value))}
                      className="rounded-input border border-border px-3 py-2 text-sm text-text-primary"
                    />
                  </label>
                  <label className="text-xs text-text-secondary flex flex-col gap-1">
                    Back-to-back meetings
                    <input
                      type="number"
                      min={0}
                      value={backToBackCount}
                      onChange={(e) => setBackToBackCount(Number(e.target.value))}
                      className="rounded-input border border-border px-3 py-2 text-sm text-text-primary"
                    />
                  </label>
                  <label className="text-xs text-text-secondary flex flex-col gap-1">
                    No-break blocks
                    <input
                      type="number"
                      min={0}
                      value={noBreakBlocks}
                      onChange={(e) => setNoBreakBlocks(Number(e.target.value))}
                      className="rounded-input border border-border px-3 py-2 text-sm text-text-primary"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
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
