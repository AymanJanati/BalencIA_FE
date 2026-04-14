"use client";

// components/ui/SliderField.tsx — Labeled range slider for stress / fatigue / workload

interface SliderFieldProps {
  label: string;
  hint?: string;
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
}

export default function SliderField({
  label,
  hint,
  min = 1,
  max = 5,
  value,
  onChange,
}: SliderFieldProps) {
  // Percentage position for the value indicator
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="text-body font-medium text-text-primary">{label}</label>
        {/* Value badge */}
        <span className="w-7 h-7 rounded-full bg-brand-subtle flex items-center justify-center text-caption font-semibold text-[#2f8876]">
          {value}
        </span>
      </div>

      {/* Slider track */}
      <div className="relative h-5 flex items-center">
        {/* Progress fill behind the native input */}
        <div className="absolute left-0 right-0 h-2 rounded-full bg-border overflow-hidden pointer-events-none">
          <div
            className="h-full bg-brand rounded-full transition-all duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            w-full h-2 appearance-none bg-transparent cursor-pointer relative z-10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#2f8876]
            [&::-webkit-slider-thumb]:shadow-sm
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#2f8876]
            [&::-moz-range-thumb]:shadow-sm
            [&::-moz-range-thumb]:border-none
            focus:outline-none
          "
        />
      </div>

      {/* Hint and scale labels */}
      {hint && (
        <div className="flex items-center justify-between">
          <span className="text-caption text-text-secondary">{hint.split(",")[0]?.trim()}</span>
          <span className="text-caption text-text-secondary">{hint.split(",")[1]?.trim()}</span>
        </div>
      )}
    </div>
  );
}
